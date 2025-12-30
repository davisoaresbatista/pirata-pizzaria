import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ============================================================================
// RATE LIMITING CONFIGURATION
// ============================================================================
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

// Detectar ambiente de desenvolvimento
const isDevelopment = process.env.NODE_ENV === "development";

// Limites diferentes para dev e produção
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Rotas de autenticação - SEMPRE restritivas para evitar força bruta
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 10 }, // 10 tentativas por 15 min (mantido)
  // APIs gerais
  api: { 
    windowMs: 60 * 1000, 
    maxRequests: isDevelopment ? 300 : 100 // 300 dev / 100 prod
  },
  // APIs de escrita (POST/PUT/DELETE)
  apiWrite: { 
    windowMs: 60 * 1000, 
    maxRequests: isDevelopment ? 100 : 30 // 100 dev / 30 prod
  },
};

// Store simples em memória para rate limiting (em produção usar Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(ip: string, path: string): string {
  return `${ip}:${path}`;
}

function isRateLimited(
  ip: string,
  path: string,
  config: RateLimitConfig
): { limited: boolean; remaining: number; resetIn: number } {
  const key = getRateLimitKey(ip, path);
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return { limited: false, remaining: config.maxRequests - 1, resetIn: config.windowMs };
  }

  if (record.count >= config.maxRequests) {
    return { 
      limited: true, 
      remaining: 0, 
      resetIn: record.resetTime - now 
    };
  }

  record.count++;
  return { 
    limited: false, 
    remaining: config.maxRequests - record.count, 
    resetIn: record.resetTime - now 
  };
}

// Limpar entradas antigas periodicamente
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Limpa a cada minuto

// ============================================================================
// SECURITY HEADERS
// ============================================================================
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy - protege contra XSS
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js precisa disso
      "style-src 'self' 'unsafe-inline'", // Para Tailwind
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'", // Previne clickjacking
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  // Strict Transport Security - força HTTPS
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Previne clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Previne MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Controle de referrer
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy - desabilita recursos não utilizados
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  // Previne XSS em navegadores antigos
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

// ============================================================================
// PATH UTILITIES
// ============================================================================
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return "unknown";
}

// ============================================================================
// MAIN MIDDLEWARE
// ============================================================================
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);

  // ===== RATE LIMITING =====
  let rateLimitConfig: RateLimitConfig | null = null;

  // APIs públicas com rate limiting mais permissivo (mas ainda protegidas)
  const publicReadApis = ["/api/menu/public"];
  const isPublicReadApi = publicReadApis.some(api => pathname.startsWith(api)) && request.method === "GET";

  if (pathname.startsWith("/api/auth")) {
    // Autenticação SEMPRE com rate limiting restritivo
    rateLimitConfig = RATE_LIMITS.auth;
  } else if (pathname.startsWith("/api")) {
    const isWriteMethod = ["POST", "PUT", "DELETE", "PATCH"].includes(request.method);
    
    if (isPublicReadApi) {
      // APIs públicas de leitura: limite mais alto mas ainda protegido
      rateLimitConfig = { windowMs: 60 * 1000, maxRequests: isDevelopment ? 500 : 200 };
    } else {
      rateLimitConfig = isWriteMethod ? RATE_LIMITS.apiWrite : RATE_LIMITS.api;
    }
  }

  if (rateLimitConfig) {
    const rateLimitPath = pathname.startsWith("/api/auth") ? "auth" : "api";
    const { limited, remaining, resetIn } = isRateLimited(ip, rateLimitPath, rateLimitConfig);

    if (limited) {
      console.warn(`[SECURITY] Rate limit exceeded for IP: ${ip} on path: ${pathname}`);
      const response = NextResponse.json(
        { 
          error: "Muitas requisições. Tente novamente em alguns minutos.",
          retryAfter: Math.ceil(resetIn / 1000)
        },
        { status: 429 }
      );
      response.headers.set("Retry-After", String(Math.ceil(resetIn / 1000)));
      response.headers.set("X-RateLimit-Remaining", "0");
      return addSecurityHeaders(response);
    }
  }

  // ===== PROTEÇÃO DE ROTAS ADMIN =====
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // Redireciona para login se não autenticado
    if (!token) {
      console.warn(`[SECURITY] Unauthenticated access attempt to ${pathname} from IP: ${ip}`);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Log de acesso a áreas sensíveis
    if (pathname.includes("/usuarios") || pathname.includes("/configuracoes")) {
      console.info(`[AUDIT] User ${token.email} (${token.role}) accessed ${pathname}`);
    }
  }

  // ===== PROTEÇÃO DE APIs SENSÍVEIS =====
  if (pathname.startsWith("/api/users") || pathname.startsWith("/api/shift-config")) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token || token.role !== "ADMIN") {
      console.warn(`[SECURITY] Unauthorized API access attempt to ${pathname} from IP: ${ip}`);
      return addSecurityHeaders(
        NextResponse.json({ error: "Acesso negado" }, { status: 403 })
      );
    }
  }

  // ===== BLOQUEAR PATHS SUSPEITOS =====
  const suspiciousPaths = [
    "/.env",
    "/.git",
    "/wp-admin",
    "/wp-login",
    "/phpmyadmin",
    "/.htaccess",
    "/config.php",
    "/admin.php",
  ];

  if (suspiciousPaths.some(p => pathname.toLowerCase().includes(p))) {
    console.warn(`[SECURITY] Suspicious path access attempt: ${pathname} from IP: ${ip}`);
    return new NextResponse("Not Found", { status: 404 });
  }

  // ===== CONTINUAR NORMALMENTE COM HEADERS DE SEGURANÇA =====
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

// ============================================================================
// MATCHER CONFIGURATION
// ============================================================================
export const config = {
  matcher: [
    // Proteger todas as rotas exceto assets estáticos
    "/((?!_next/static|_next/image|favicon.ico|logo|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.ico$).*)",
  ],
};


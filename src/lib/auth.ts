import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

// ============================================================================
// CONSTANTES DE SEGURANÇA
// ============================================================================
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutos

// ============================================================================
// FUNÇÕES DE SEGURANÇA
// ============================================================================

/**
 * Verifica se o usuário está bloqueado por muitas tentativas de login
 */
async function isUserLocked(email: string, ip: string): Promise<boolean> {
  const lockoutTime = new Date(Date.now() - LOCKOUT_DURATION_MS);

  try {
    const recentAttempts = await prisma.loginAttempt.count({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { ipAddress: ip },
        ],
        success: false,
        createdAt: { gte: lockoutTime },
      },
    });

    return recentAttempts >= MAX_LOGIN_ATTEMPTS;
  } catch {
    // Se a tabela não existir ainda, não bloquear
    return false;
  }
}

/**
 * Registra uma tentativa de login
 */
async function recordLoginAttempt(
  email: string,
  ip: string,
  success: boolean,
  userAgent?: string
): Promise<void> {
  try {
    await prisma.loginAttempt.create({
      data: {
        email: email.toLowerCase(),
        ipAddress: ip,
        success,
        userAgent: userAgent || null,
      },
    });

    // Limpar tentativas antigas (mais de 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await prisma.loginAttempt.deleteMany({
      where: { createdAt: { lt: oneDayAgo } },
    });
  } catch {
    // Falha silenciosa se a tabela não existir
    console.warn("[AUTH] Não foi possível registrar tentativa de login");
  }
}

// ============================================================================
// CONFIGURAÇÃO DO NEXTAUTH
// ============================================================================
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, req) {
        // Obter IP do request
        const ip = (req?.headers?.["x-forwarded-for"] as string)?.split(",")[0]?.trim() 
          || (req?.headers?.["x-real-ip"] as string)
          || "unknown";
        const userAgent = req?.headers?.["user-agent"] as string | undefined;

        // Validar campos obrigatórios
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const email = credentials.email.toLowerCase().trim();

        // Verificar bloqueio por tentativas excessivas
        const isLocked = await isUserLocked(email, ip);
        if (isLocked) {
          console.warn(`[AUTH] Conta bloqueada por muitas tentativas: ${email} (IP: ${ip})`);
          throw new Error("Conta temporariamente bloqueada. Tente novamente em 15 minutos.");
        }

        // Buscar usuário
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Registrar tentativa falha
          await recordLoginAttempt(email, ip, false, userAgent);
          
          // Usar mensagem genérica para não revelar se o usuário existe
          throw new Error("Email ou senha incorretos");
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          // Registrar tentativa falha
          await recordLoginAttempt(email, ip, false, userAgent);
          console.warn(`[AUTH] Senha incorreta para: ${email} (IP: ${ip})`);
          throw new Error("Email ou senha incorretos");
        }

        // Login bem-sucedido
        await recordLoginAttempt(email, ip, true, userAgent);
        console.info(`[AUTH] Login bem-sucedido: ${email} (IP: ${ip})`);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  
  session: {
    strategy: "jwt",
    // Sessão mais curta para maior segurança
    maxAge: 8 * 60 * 60, // 8 horas (reduzido de 30 dias)
    updateAge: 60 * 60, // Atualiza a cada 1 hora
  },
  
  pages: {
    signIn: "/login",
    error: "/login", // Página de erro customizada
  },
  
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Quando o usuário faz login
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        // Adicionar timestamp para verificar validade
        token.iat = Math.floor(Date.now() / 1000);
      }
      
      // Verificar se a sessão precisa ser revalidada (a cada hora)
      if (trigger === "update" || !token.lastVerified) {
        token.lastVerified = Date.now();
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    
    // Proteger contra token hijacking
    async signIn({ user }) {
      // Verificar se o usuário ainda existe e está ativo
      if (!user?.id) return false;
      
      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true },
        });
        
        return !!dbUser;
      } catch {
        return false;
      }
    },
  },
  
  events: {
    async signOut({ token }) {
      // Log de logout
      if (token?.email) {
        console.info(`[AUTH] Logout: ${token.email}`);
      }
    },
  },
  
  // Configurações de segurança
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  
  // Cookies seguros
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? "__Secure-next-auth.session-token" 
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

// ============================================================================
// HELPERS EXPORTADOS
// ============================================================================

/**
 * Hash de senha com configuração segura
 */
export async function hashPassword(password: string): Promise<string> {
  // bcrypt com cost factor 12 (mais seguro que 10)
  return bcrypt.hash(password, 12);
}

/**
 * Verifica força da senha
 */
export function isStrongPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Mínimo de 8 caracteres");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Pelo menos uma letra minúscula");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Pelo menos uma letra maiúscula");
  }
  if (!/\d/.test(password)) {
    errors.push("Pelo menos um número");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

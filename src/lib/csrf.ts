import { randomBytes } from "crypto";
import { cookies } from "next/headers";

// ============================================================================
// CSRF PROTECTION
// ============================================================================

const CSRF_COOKIE_NAME = "__csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";
const TOKEN_LENGTH = 32;

/**
 * Gera um token CSRF seguro
 */
export function generateCSRFToken(): string {
  return randomBytes(TOKEN_LENGTH).toString("hex");
}

/**
 * Define o cookie CSRF (use em Server Components)
 */
export async function setCSRFCookie(): Promise<string> {
  const token = generateCSRFToken();
  const cookieStore = await cookies();
  
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hora
  });
  
  return token;
}

/**
 * Obtém o token CSRF do cookie
 */
export async function getCSRFToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE_NAME)?.value;
}

/**
 * Valida o token CSRF (compara header com cookie)
 */
export async function validateCSRFToken(headerToken: string | null): Promise<boolean> {
  if (!headerToken) return false;
  
  const cookieToken = await getCSRFToken();
  if (!cookieToken) return false;
  
  // Comparação timing-safe
  if (headerToken.length !== cookieToken.length) return false;
  
  let mismatch = 0;
  for (let i = 0; i < headerToken.length; i++) {
    mismatch |= headerToken.charCodeAt(i) ^ cookieToken.charCodeAt(i);
  }
  
  return mismatch === 0;
}

/**
 * Middleware helper para validar CSRF em APIs
 */
export async function requireCSRFToken(request: Request): Promise<{ valid: boolean; error?: string }> {
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  
  if (!headerToken) {
    return { valid: false, error: "Token CSRF ausente" };
  }
  
  const isValid = await validateCSRFToken(headerToken);
  
  if (!isValid) {
    return { valid: false, error: "Token CSRF inválido" };
  }
  
  return { valid: true };
}


import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { z } from "zod";

// ============================================================================
// TYPES
// ============================================================================
export type UserRole = "ADMIN" | "MANAGER";

export interface ApiContext {
  session: {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
  };
  ip: string;
  userAgent: string;
}

export interface ApiSecurityOptions {
  // Autenticação
  requireAuth?: boolean;
  requiredRoles?: UserRole[];
  
  // Auditoria
  auditAction?: string;
  
  // Validação
  bodySchema?: z.ZodSchema;
  querySchema?: z.ZodSchema;
}

// ============================================================================
// SANITIZATION UTILITIES
// ============================================================================

/**
 * Remove caracteres potencialmente perigosos de strings
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove scripts
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim();
}

/**
 * Sanitiza um objeto recursivamente
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === "string" ? sanitizeString(item) : 
        typeof item === "object" && item !== null ? sanitizeObject(item as Record<string, unknown>) : 
        item
      );
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

export interface AuditLogEntry {
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ip: string;
  userAgent: string;
}

/**
 * Registra uma ação no log de auditoria
 */
export async function logAuditAction(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        userEmail: entry.userEmail,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId || null,
        details: entry.details ? JSON.stringify(entry.details) : null,
        ipAddress: entry.ip,
        userAgent: entry.userAgent,
      },
    });
  } catch (error) {
    // Não falhar a requisição se o log falhar, apenas registrar no console
    console.error("[AUDIT] Falha ao registrar log:", error);
  }
}

// ============================================================================
// IP & USER AGENT UTILITIES
// ============================================================================

export function getClientIP(request: NextRequest): string {
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

export function getUserAgent(request: NextRequest): string {
  return request.headers.get("user-agent") || "unknown";
}

// ============================================================================
// API WRAPPER
// ============================================================================

type ApiHandler<T = unknown> = (
  request: NextRequest,
  context: ApiContext,
  validatedData?: T
) => Promise<NextResponse>;

/**
 * Wrapper para handlers de API com segurança integrada
 */
export function withApiSecurity<T = unknown>(
  handler: ApiHandler<T>,
  options: ApiSecurityOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const {
      requireAuth = true,
      requiredRoles,
      auditAction,
      bodySchema,
      querySchema,
    } = options;

    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);

    try {
      // ===== AUTENTICAÇÃO =====
      let session = null;
      
      if (requireAuth) {
        session = await getServerSession(authOptions);
        
        if (!session?.user) {
          console.warn(`[API] Acesso não autorizado de IP: ${ip}`);
          return NextResponse.json(
            { error: "Não autorizado" },
            { status: 401 }
          );
        }

        // ===== AUTORIZAÇÃO POR ROLE =====
        if (requiredRoles && requiredRoles.length > 0) {
          const userRole = session.user.role as UserRole;
          
          if (!requiredRoles.includes(userRole)) {
            console.warn(
              `[API] Acesso negado para ${session.user.email} (${userRole}) - requer: ${requiredRoles.join(", ")}`
            );
            
            await logAuditAction({
              userId: session.user.id,
              userEmail: session.user.email || "unknown",
              action: "ACCESS_DENIED",
              resource: request.nextUrl.pathname,
              details: { requiredRoles, userRole },
              ip,
              userAgent,
            });

            return NextResponse.json(
              { error: "Acesso negado. Você não tem permissão para esta ação." },
              { status: 403 }
            );
          }
        }
      }

      // ===== VALIDAÇÃO DE QUERY PARAMS =====
      let validatedQuery: Record<string, unknown> | undefined;
      
      if (querySchema) {
        const searchParams = Object.fromEntries(request.nextUrl.searchParams);
        const queryResult = querySchema.safeParse(searchParams);
        
        if (!queryResult.success) {
          return NextResponse.json(
            { 
              error: "Parâmetros de consulta inválidos",
              details: queryResult.error.flatten().fieldErrors
            },
            { status: 400 }
          );
        }
        
        validatedQuery = sanitizeObject(queryResult.data as Record<string, unknown>);
      }

      // ===== VALIDAÇÃO DE BODY =====
      let validatedBody: T | undefined;
      
      if (bodySchema && ["POST", "PUT", "PATCH"].includes(request.method)) {
        let body: unknown;
        
        try {
          body = await request.json();
        } catch {
          return NextResponse.json(
            { error: "Corpo da requisição inválido (JSON malformado)" },
            { status: 400 }
          );
        }

        const bodyResult = bodySchema.safeParse(body);
        
        if (!bodyResult.success) {
          return NextResponse.json(
            { 
              error: "Dados inválidos",
              details: bodyResult.error.flatten().fieldErrors
            },
            { status: 400 }
          );
        }
        
        validatedBody = sanitizeObject(bodyResult.data as Record<string, unknown>) as T;
      }

      // ===== CONTEXTO DA API =====
      const context: ApiContext = {
        session: session?.user ? {
          user: {
            id: session.user.id as string,
            email: session.user.email as string,
            name: session.user.name as string,
            role: session.user.role as UserRole,
          },
        } : null as unknown as ApiContext["session"],
        ip,
        userAgent,
      };

      // ===== EXECUTAR HANDLER =====
      const response = await handler(
        request, 
        context, 
        validatedBody || (validatedQuery as T)
      );

      // ===== AUDIT LOG PARA AÇÕES DE ESCRITA =====
      if (
        auditAction && 
        session?.user && 
        ["POST", "PUT", "PATCH", "DELETE"].includes(request.method)
      ) {
        await logAuditAction({
          userId: session.user.id as string,
          userEmail: session.user.email as string,
          action: auditAction,
          resource: request.nextUrl.pathname,
          details: validatedBody as Record<string, unknown>,
          ip,
          userAgent,
        });
      }

      return response;

    } catch (error) {
      console.error("[API] Erro interno:", error);
      
      // Não expor detalhes do erro em produção
      const isProduction = process.env.NODE_ENV === "production";
      
      return NextResponse.json(
        { 
          error: "Erro interno do servidor",
          ...(isProduction ? {} : { details: String(error) })
        },
        { status: 500 }
      );
    }
  };
}

// ============================================================================
// VALIDATION SCHEMAS COMUNS
// ============================================================================

export const schemas = {
  // ID de recurso
  id: z.string().min(1, "ID é obrigatório").max(100),
  
  // Email
  email: z.string().email("Email inválido").max(255),
  
  // Senha forte
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Senha deve conter letras maiúsculas, minúsculas e números"
    ),
  
  // Senha simples (manter compatibilidade)
  simplePassword: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100),
  
  // Nome
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100)
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Nome contém caracteres inválidos"),
  
  // Telefone brasileiro
  phone: z
    .string()
    .optional()
    .transform(v => v || null)
    .pipe(
      z.string().regex(/^[\d\s()+-]*$/, "Telefone inválido").max(20).nullable()
    ),
  
  // Documento (CPF/CNPJ)
  document: z
    .string()
    .optional()
    .transform(v => v || null)
    .pipe(
      z.string().max(20).nullable()
    ),
  
  // Valor monetário
  money: z
    .union([z.string(), z.number()])
    .transform(v => {
      const num = typeof v === "string" ? parseFloat(v) : v;
      return isNaN(num) ? 0 : num;
    })
    .pipe(z.number().min(0, "Valor deve ser positivo")),
  
  // Data
  date: z
    .string()
    .refine(v => !isNaN(Date.parse(v)), "Data inválida"),
  
  // Data opcional
  optionalDate: z
    .string()
    .optional()
    .transform(v => v || null)
    .pipe(
      z.string().refine(v => v === null || !isNaN(Date.parse(v)), "Data inválida").nullable()
    ),
  
  // Notas/observações
  notes: z
    .string()
    .max(1000, "Observações muito longas")
    .optional()
    .transform(v => v || null),
  
  // Horário (HH:MM)
  time: z
    .string()
    .optional()
    .transform(v => v || null)
    .pipe(
      z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido").nullable()
    ),
  
  // Boolean flexível
  flexibleBoolean: z
    .union([z.boolean(), z.string()])
    .transform(v => v === true || v === "true"),
  
  // Paginação
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

// ============================================================================
// RESPONSE HELPERS
// ============================================================================

export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function errorResponse(
  message: string, 
  status = 400, 
  details?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status }
  );
}

export function notFoundResponse(resource = "Recurso"): NextResponse {
  return NextResponse.json(
    { error: `${resource} não encontrado` },
    { status: 404 }
  );
}

export function forbiddenResponse(message = "Acesso negado"): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 });
}


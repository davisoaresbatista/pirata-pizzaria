import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { 
  withApiSecurity, 
  successResponse, 
  errorResponse,
  logAuditAction,
  type ApiContext 
} from "@/lib/api-security";
import { createUserSchema } from "@/lib/validation-schemas";

// ============================================================================
// GET /api/users - Lista todos os usuários
// ============================================================================
export const GET = withApiSecurity(
  async (request: NextRequest, context: ApiContext) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
    });

    return successResponse(users);
  },
  {
    requireAuth: true,
    requiredRoles: ["ADMIN"], // Apenas admins podem listar usuários
  }
);

// ============================================================================
// POST /api/users - Cria um novo usuário
// ============================================================================
export const POST = withApiSecurity(
  async (request: NextRequest, context: ApiContext, data: unknown) => {
    const { name, email, password, role } = data as {
      name: string;
      email: string;
      password: string;
      role: "ADMIN" | "MANAGER";
    };

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return errorResponse("Este email já está em uso", 400);
    }

    // Hash seguro da senha (bcrypt com cost factor 12)
    const hashedPassword = await hashPassword(password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || "MANAGER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Log de auditoria
    await logAuditAction({
      userId: context.session.user.id,
      userEmail: context.session.user.email,
      action: "CREATE_USER",
      resource: "/api/users",
      resourceId: user.id,
      details: { 
        newUserEmail: user.email, 
        newUserRole: user.role 
      },
      ip: context.ip,
      userAgent: context.userAgent,
    });

    return successResponse(user, 201);
  },
  {
    requireAuth: true,
    requiredRoles: ["ADMIN"],
    bodySchema: createUserSchema,
    auditAction: "CREATE_USER",
  }
);

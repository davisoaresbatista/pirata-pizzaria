import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { 
  withApiSecurity, 
  successResponse, 
  errorResponse,
  notFoundResponse,
  logAuditAction,
  type ApiContext 
} from "@/lib/api-security";
import { updateUserSchema } from "@/lib/validation-schemas";

// ============================================================================
// GET /api/users/[id] - Busca um usuário específico
// ============================================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const handler = withApiSecurity(
    async (req: NextRequest, context: ApiContext) => {
      const { id } = await params;
      
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        return notFoundResponse("Usuário");
      }

      return successResponse(user);
    },
    {
      requireAuth: true,
      requiredRoles: ["ADMIN"],
    }
  );

  return handler(request);
}

// ============================================================================
// PUT /api/users/[id] - Atualiza um usuário
// ============================================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const handler = withApiSecurity(
    async (req: NextRequest, context: ApiContext, data: unknown) => {
      const { id } = await params;
      const updates = data as {
        name?: string;
        email?: string;
        password?: string;
        role?: "ADMIN" | "MANAGER";
      };

      // Verificar se usuário existe
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return notFoundResponse("Usuário");
      }

      // Se está atualizando email, verificar duplicidade
      if (updates.email && updates.email.toLowerCase() !== existingUser.email) {
        const emailInUse = await prisma.user.findUnique({
          where: { email: updates.email.toLowerCase() },
        });

        if (emailInUse) {
          return errorResponse("Este email já está em uso", 400);
        }
      }

      // Preparar dados para atualização
      const updateData: Record<string, unknown> = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.email) updateData.email = updates.email.toLowerCase();
      if (updates.role) updateData.role = updates.role;
      if (updates.password) {
        updateData.password = await hashPassword(updates.password);
      }

      // Atualizar usuário
      const user = await prisma.user.update({
        where: { id },
        data: updateData,
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
        action: "UPDATE_USER",
        resource: `/api/users/${id}`,
        resourceId: id,
        details: { 
          updatedFields: Object.keys(updateData).filter(k => k !== "password"),
          targetUserEmail: user.email,
        },
        ip: context.ip,
        userAgent: context.userAgent,
      });

      return successResponse(user);
    },
    {
      requireAuth: true,
      requiredRoles: ["ADMIN"],
      bodySchema: updateUserSchema,
    }
  );

  return handler(request);
}

// ============================================================================
// DELETE /api/users/[id] - Remove um usuário
// ============================================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const handler = withApiSecurity(
    async (req: NextRequest, context: ApiContext) => {
      const { id } = await params;

      // Verificar se usuário existe
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true },
      });

      if (!user) {
        return notFoundResponse("Usuário");
      }

      // Impedir auto-exclusão
      if (user.id === context.session.user.id) {
        return errorResponse("Você não pode excluir sua própria conta", 400);
      }

      // Verificar se é o último admin
      if (context.session.user.role === "ADMIN") {
        const adminCount = await prisma.user.count({
          where: { role: "ADMIN" },
        });

        if (adminCount <= 1) {
          return errorResponse("Não é possível excluir o último administrador", 400);
        }
      }

      // Deletar usuário
      await prisma.user.delete({
        where: { id },
      });

      // Log de auditoria
      await logAuditAction({
        userId: context.session.user.id,
        userEmail: context.session.user.email,
        action: "DELETE_USER",
        resource: `/api/users/${id}`,
        resourceId: id,
        details: { deletedUserEmail: user.email },
        ip: context.ip,
        userAgent: context.userAgent,
      });

      return successResponse({ message: "Usuário excluído com sucesso" });
    },
    {
      requireAuth: true,
      requiredRoles: ["ADMIN"],
    }
  );

  return handler(request);
}

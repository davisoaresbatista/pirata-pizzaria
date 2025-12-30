import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { 
  withApiSecurity, 
  successResponse,
  notFoundResponse,
  logAuditAction,
  type ApiContext 
} from "@/lib/api-security";
import { z } from "zod";

// ============================================================================
// SCHEMAS
// ============================================================================

const updateCategorySchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().transform(v => v || null),
  icon: z.string().max(50).optional().transform(v => v || null),
  order: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

// ============================================================================
// GET /api/menu/categories/[id]
// ============================================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const handler = withApiSecurity(
    async (req: NextRequest, context: ApiContext) => {
      const { id } = await params;
      
      const category = await prisma.menuCategory.findUnique({
        where: { id },
        include: {
          items: {
            orderBy: { order: "asc" },
          },
        },
      });

      if (!category) {
        return notFoundResponse("Categoria");
      }

      return successResponse(category);
    },
    {
      requireAuth: true,
    }
  );

  return handler(request);
}

// ============================================================================
// PUT /api/menu/categories/[id]
// ============================================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const handler = withApiSecurity(
    async (req: NextRequest, context: ApiContext, data: unknown) => {
      const { id } = await params;
      const updates = data as z.infer<typeof updateCategorySchema>;

      const existing = await prisma.menuCategory.findUnique({
        where: { id },
      });

      if (!existing) {
        return notFoundResponse("Categoria");
      }

      const category = await prisma.menuCategory.update({
        where: { id },
        data: updates,
      });

      await logAuditAction({
        userId: context.session.user.id,
        userEmail: context.session.user.email,
        action: "UPDATE_MENU_CATEGORY",
        resource: `/api/menu/categories/${id}`,
        resourceId: id,
        details: { categoryName: category.displayName },
        ip: context.ip,
        userAgent: context.userAgent,
      });

      return successResponse(category);
    },
    {
      requireAuth: true,
      bodySchema: updateCategorySchema,
    }
  );

  return handler(request);
}

// ============================================================================
// DELETE /api/menu/categories/[id]
// ============================================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const handler = withApiSecurity(
    async (req: NextRequest, context: ApiContext) => {
      const { id } = await params;

      const category = await prisma.menuCategory.findUnique({
        where: { id },
        include: { _count: { select: { items: true } } },
      });

      if (!category) {
        return notFoundResponse("Categoria");
      }

      // Deletar categoria (cascade vai deletar os itens)
      await prisma.menuCategory.delete({
        where: { id },
      });

      await logAuditAction({
        userId: context.session.user.id,
        userEmail: context.session.user.email,
        action: "DELETE_MENU_CATEGORY",
        resource: `/api/menu/categories/${id}`,
        resourceId: id,
        details: { 
          categoryName: category.displayName,
          itemsDeleted: category._count.items,
        },
        ip: context.ip,
        userAgent: context.userAgent,
      });

      return successResponse({ message: "Categoria excluída com sucesso" });
    },
    {
      requireAuth: true,
      requiredRoles: ["ADMIN"],
    }
  );

  return handler(request);
}

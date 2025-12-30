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

const updateItemSchema = z.object({
  categoryId: z.string().min(1).optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().transform(v => v || null),
  price: z.union([z.string(), z.number()]).transform(v => {
    const num = typeof v === "string" ? parseFloat(v) : v;
    return isNaN(num) ? 0 : num;
  }).optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  popular: z.boolean().optional(),
  spicy: z.boolean().optional(),
  vegetarian: z.boolean().optional(),
  newItem: z.boolean().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")).transform(v => v || null),
  order: z.number().int().min(0).optional(),
});

// ============================================================================
// GET /api/menu/items/[id]
// ============================================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const handler = withApiSecurity(
    async (req: NextRequest, context: ApiContext) => {
      const { id } = await params;
      
      const item = await prisma.menuItem.findUnique({
        where: { id },
        include: {
          category: {
            select: { id: true, name: true, displayName: true },
          },
        },
      });

      if (!item) {
        return notFoundResponse("Item");
      }

      return successResponse(item);
    },
    {
      requireAuth: true,
    }
  );

  return handler(request);
}

// ============================================================================
// PUT /api/menu/items/[id]
// ============================================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const handler = withApiSecurity(
    async (req: NextRequest, context: ApiContext, data: unknown) => {
      const { id } = await params;
      const updates = data as z.infer<typeof updateItemSchema>;

      const existing = await prisma.menuItem.findUnique({
        where: { id },
      });

      if (!existing) {
        return notFoundResponse("Item");
      }

      // Se mudou de categoria, verificar se nova categoria existe
      if (updates.categoryId && updates.categoryId !== existing.categoryId) {
        const category = await prisma.menuCategory.findUnique({
          where: { id: updates.categoryId },
        });

        if (!category) {
          return successResponse(
            { error: "Categoria não encontrada" },
            404
          );
        }
      }

      const item = await prisma.menuItem.update({
        where: { id },
        data: updates,
        include: {
          category: {
            select: { id: true, displayName: true },
          },
        },
      });

      await logAuditAction({
        userId: context.session.user.id,
        userEmail: context.session.user.email,
        action: "UPDATE_MENU_ITEM",
        resource: `/api/menu/items/${id}`,
        resourceId: id,
        details: { 
          itemName: item.name,
          updatedFields: Object.keys(updates),
        },
        ip: context.ip,
        userAgent: context.userAgent,
      });

      return successResponse(item);
    },
    {
      requireAuth: true,
      bodySchema: updateItemSchema,
    }
  );

  return handler(request);
}

// ============================================================================
// DELETE /api/menu/items/[id]
// ============================================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const handler = withApiSecurity(
    async (req: NextRequest, context: ApiContext) => {
      const { id } = await params;

      const item = await prisma.menuItem.findUnique({
        where: { id },
        include: { category: { select: { displayName: true } } },
      });

      if (!item) {
        return notFoundResponse("Item");
      }

      await prisma.menuItem.delete({
        where: { id },
      });

      await logAuditAction({
        userId: context.session.user.id,
        userEmail: context.session.user.email,
        action: "DELETE_MENU_ITEM",
        resource: `/api/menu/items/${id}`,
        resourceId: id,
        details: { 
          itemName: item.name,
          categoryName: item.category.displayName,
        },
        ip: context.ip,
        userAgent: context.userAgent,
      });

      return successResponse({ message: "Item excluído com sucesso" });
    },
    {
      requireAuth: true,
    }
  );

  return handler(request);
}

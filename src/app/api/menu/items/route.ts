import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { 
  withApiSecurity, 
  successResponse,
  logAuditAction,
  type ApiContext 
} from "@/lib/api-security";
import { z } from "zod";

// ============================================================================
// SCHEMAS
// ============================================================================

const createItemSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().transform(v => v || null),
  price: z.union([z.string(), z.number()]).transform(v => {
    const num = typeof v === "string" ? parseFloat(v) : v;
    return isNaN(num) ? 0 : num;
  }),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  popular: z.boolean().default(false),
  spicy: z.boolean().default(false),
  vegetarian: z.boolean().default(false),
  newItem: z.boolean().default(false),
  imageUrl: z.string().url().optional().or(z.literal("")).transform(v => v || null),
  order: z.number().int().min(0).default(0),
});

// ============================================================================
// GET /api/menu/items - Lista todos os itens (admin)
// ============================================================================
export const GET = withApiSecurity(
  async (request: NextRequest, context: ApiContext) => {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const where: Record<string, unknown> = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
      include: {
        category: {
          select: { id: true, name: true, displayName: true },
        },
      },
    });

    return successResponse(items);
  },
  {
    requireAuth: true,
  }
);

// ============================================================================
// POST /api/menu/items - Cria novo item
// ============================================================================
export const POST = withApiSecurity(
  async (request: NextRequest, context: ApiContext, data: unknown) => {
    const itemData = data as z.infer<typeof createItemSchema>;

    // Verificar se categoria existe
    const category = await prisma.menuCategory.findUnique({
      where: { id: itemData.categoryId },
    });

    if (!category) {
      return successResponse(
        { error: "Categoria não encontrada" },
        404
      );
    }

    const item = await prisma.menuItem.create({
      data: itemData,
      include: {
        category: {
          select: { id: true, displayName: true },
        },
      },
    });

    await logAuditAction({
      userId: context.session.user.id,
      userEmail: context.session.user.email,
      action: "CREATE_MENU_ITEM",
      resource: "/api/menu/items",
      resourceId: item.id,
      details: { 
        itemName: item.name,
        categoryName: item.category.displayName,
        price: item.price,
      },
      ip: context.ip,
      userAgent: context.userAgent,
    });

    return successResponse(item, 201);
  },
  {
    requireAuth: true,
    bodySchema: createItemSchema,
  }
);

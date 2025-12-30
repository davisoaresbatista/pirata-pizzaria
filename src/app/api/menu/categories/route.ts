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

const createCategorySchema = z.object({
  name: z.string().min(1).max(50).regex(/^[a-z_]+$/, "Use apenas letras minúsculas e underscores"),
  displayName: z.string().min(1).max(100),
  description: z.string().max(500).optional().transform(v => v || null),
  icon: z.string().max(50).optional().transform(v => v || null),
  order: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

// ============================================================================
// GET /api/menu/categories - Lista todas as categorias (admin)
// ============================================================================
export const GET = withApiSecurity(
  async (request: NextRequest, context: ApiContext) => {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return successResponse(categories);
  },
  {
    requireAuth: true,
  }
);

// ============================================================================
// POST /api/menu/categories - Cria nova categoria
// ============================================================================
export const POST = withApiSecurity(
  async (request: NextRequest, context: ApiContext, data: unknown) => {
    const categoryData = data as z.infer<typeof createCategorySchema>;

    // Verificar se nome já existe
    const existing = await prisma.menuCategory.findUnique({
      where: { name: categoryData.name },
    });

    if (existing) {
      return successResponse(
        { error: "Já existe uma categoria com este nome" },
        400
      );
    }

    const category = await prisma.menuCategory.create({
      data: categoryData,
    });

    await logAuditAction({
      userId: context.session.user.id,
      userEmail: context.session.user.email,
      action: "CREATE_MENU_CATEGORY",
      resource: "/api/menu/categories",
      resourceId: category.id,
      details: { categoryName: category.displayName },
      ip: context.ip,
      userAgent: context.userAgent,
    });

    return successResponse(category, 201);
  },
  {
    requireAuth: true,
    bodySchema: createCategorySchema,
  }
);

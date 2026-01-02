import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ============================================================================
// GET /api/menu/public - Busca cardápio público (sem autenticação)
// ============================================================================
export async function GET() {
  try {
    // Testar conexão primeiro
    await prisma.$connect();
    
    const categories = await prisma.menuCategory.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        items: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
      },
    });

    // Formatar para o frontend
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      displayName: category.displayName,
      description: category.description,
      icon: category.icon,
      shift: category.shift,
      items: category.items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        active: item.active,
        featured: item.featured,
        popular: item.popular,
        spicy: item.spicy,
        vegetarian: item.vegetarian,
        newItem: item.newItem,
        imageUrl: item.imageUrl,
      })),
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    const errorDetails = {
      message: errorMessage,
      dbProvider: process.env.DATABASE_URL?.split(":")[0] || "unknown",
      nodeEnv: process.env.NODE_ENV,
    };
    console.error("Erro ao buscar cardápio:", errorDetails);
    return NextResponse.json(
      { error: "Erro ao buscar cardápio", details: errorDetails },
      { status: 500 }
    );
  }
}

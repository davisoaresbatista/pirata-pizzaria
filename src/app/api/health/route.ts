import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ============================================================================
// GET /api/health - Endpoint de diagnóstico (público temporariamente)
// ============================================================================
export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    databaseConfigured: !!process.env.DATABASE_URL,
    databaseProvider: process.env.DATABASE_URL?.split(":")[0] || "not-set",
    nextauthConfigured: !!process.env.NEXTAUTH_SECRET,
    nextauthUrl: process.env.NEXTAUTH_URL || "not-set",
  };

  // Testar conexão com banco
  try {
    await prisma.$connect();
    diagnostics.databaseConnection = "success";
    
    // Testar query simples
    const categoryCount = await prisma.menuCategory.count();
    const itemCount = await prisma.menuItem.count();
    diagnostics.menuCategoriesCount = categoryCount;
    diagnostics.menuItemsCount = itemCount;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    diagnostics.databaseConnection = "failed";
    diagnostics.databaseError = errorMessage;
    
    // Checar se é erro de provider incorreto
    if (errorMessage.includes("sqlite") && process.env.DATABASE_URL?.includes("mysql")) {
      diagnostics.hint = "Prisma client gerado para SQLite mas DATABASE_URL é MySQL. Necessário rebuild.";
    }
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json(diagnostics, {
    status: diagnostics.databaseConnection === "success" ? 200 : 500,
  });
}


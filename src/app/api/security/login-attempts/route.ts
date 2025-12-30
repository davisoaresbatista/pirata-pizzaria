import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { 
  withApiSecurity, 
  successResponse,
  type ApiContext 
} from "@/lib/api-security";
import { z } from "zod";

// ============================================================================
// SCHEMAS
// ============================================================================

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  email: z.string().optional(),
  ipAddress: z.string().optional(),
  success: z.enum(["true", "false"]).optional(),
});

// ============================================================================
// GET /api/security/login-attempts - Lista tentativas de login
// ============================================================================
export const GET = withApiSecurity(
  async (request: NextRequest, context: ApiContext) => {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const email = searchParams.get("email");
    const ipAddress = searchParams.get("ipAddress");
    const success = searchParams.get("success");

    const where: Record<string, unknown> = {};

    if (email) {
      where.email = { contains: email };
    }

    if (ipAddress) {
      where.ipAddress = ipAddress;
    }

    if (success !== null && success !== undefined) {
      where.success = success === "true";
    }

    const [attempts, total, stats] = await Promise.all([
      prisma.loginAttempt.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.loginAttempt.count({ where }),
      // Estatísticas das últimas 24h
      prisma.loginAttempt.groupBy({
        by: ["success"],
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
        _count: true,
      }),
    ]);

    // Processar estatísticas
    const last24h = {
      successful: stats.find(s => s.success)?._count || 0,
      failed: stats.find(s => !s.success)?._count || 0,
    };

    return successResponse({
      attempts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        last24h,
      },
    });
  },
  {
    requireAuth: true,
    requiredRoles: ["ADMIN"],
    querySchema: querySchema,
  }
);


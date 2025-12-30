import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { 
  withApiSecurity, 
  successResponse, 
  logAuditAction,
  type ApiContext 
} from "@/lib/api-security";
import { createAdvanceSchema, advanceQuerySchema } from "@/lib/validation-schemas";

// ============================================================================
// GET /api/advances - Lista adiantamentos
// ============================================================================
export const GET = withApiSecurity(
  async (request: NextRequest, context: ApiContext) => {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const employeeId = searchParams.get("employeeId");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (employeeId) where.employeeId = employeeId;

    const advances = await prisma.advance.findMany({
      where,
      orderBy: { requestDate: "desc" },
      include: {
        employee: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    return successResponse(advances);
  },
  {
    requireAuth: true,
    querySchema: advanceQuerySchema,
  }
);

// ============================================================================
// POST /api/advances - Cria um novo adiantamento
// ============================================================================
export const POST = withApiSecurity(
  async (request: NextRequest, context: ApiContext, data: unknown) => {
    const advanceData = data as {
      employeeId: string;
      amount: number;
      requestDate?: string | null;
      notes?: string | null;
    };

    // Verificar se funcionário existe
    const employee = await prisma.employee.findUnique({
      where: { id: advanceData.employeeId },
      select: { id: true, name: true },
    });

    if (!employee) {
      return successResponse(
        { error: "Funcionário não encontrado" },
        404
      );
    }

    // Criar adiantamento
    const advance = await prisma.advance.create({
      data: {
        employeeId: advanceData.employeeId,
        amount: advanceData.amount,
        requestDate: advanceData.requestDate 
          ? new Date(advanceData.requestDate) 
          : new Date(),
        notes: advanceData.notes || null,
        status: "PENDING",
      },
      include: {
        employee: {
          select: { id: true, name: true },
        },
      },
    });

    // Log de auditoria
    await logAuditAction({
      userId: context.session.user.id,
      userEmail: context.session.user.email,
      action: "CREATE_ADVANCE",
      resource: "/api/advances",
      resourceId: advance.id,
      details: { 
        employeeName: employee.name,
        amount: advanceData.amount,
      },
      ip: context.ip,
      userAgent: context.userAgent,
    });

    return successResponse(advance, 201);
  },
  {
    requireAuth: true,
    bodySchema: createAdvanceSchema,
    auditAction: "CREATE_ADVANCE",
  }
);

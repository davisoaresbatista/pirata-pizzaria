import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { 
  withApiSecurity, 
  successResponse, 
  errorResponse,
  logAuditAction,
  type ApiContext 
} from "@/lib/api-security";
import { createEmployeeSchema } from "@/lib/validation-schemas";

// ============================================================================
// GET /api/employees - Lista todos os funcionários
// ============================================================================
export const GET = withApiSecurity(
  async (request: NextRequest, context: ApiContext) => {
    const employees = await prisma.employee.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { advances: true },
        },
      },
    });

    return successResponse(employees);
  },
  {
    requireAuth: true,
    // ADMIN e MANAGER podem ver funcionários
  }
);

// ============================================================================
// POST /api/employees - Cria um novo funcionário
// ============================================================================
export const POST = withApiSecurity(
  async (request: NextRequest, context: ApiContext, data: unknown) => {
    const employeeData = data as {
      name: string;
      role: string;
      phone?: string | null;
      document?: string | null;
      hireDate?: string | null;
      salary?: number;
      worksLunch?: boolean;
      lunchPaymentType?: string;
      lunchValue?: number;
      lunchStartTime?: string | null;
      lunchEndTime?: string | null;
      worksDinner?: boolean;
      dinnerPaymentType?: string;
      dinnerWeekdayValue?: number;
      dinnerWeekendValue?: number;
      dinnerStartTime?: string | null;
      dinnerEndTime?: string | null;
    };

    // Criar funcionário com todos os campos
    const employee = await prisma.employee.create({
      data: {
        name: employeeData.name,
        role: employeeData.role || "Funcionário",
        phone: employeeData.phone || null,
        document: employeeData.document || null,
        hireDate: employeeData.hireDate ? new Date(employeeData.hireDate) : new Date(),
        salary: employeeData.salary || 0,
        worksLunch: employeeData.worksLunch || false,
        lunchPaymentType: employeeData.lunchPaymentType || "SHIFT",
        lunchValue: employeeData.lunchValue || 0,
        lunchStartTime: employeeData.lunchStartTime || null,
        lunchEndTime: employeeData.lunchEndTime || null,
        worksDinner: employeeData.worksDinner !== false,
        dinnerPaymentType: employeeData.dinnerPaymentType || "SHIFT",
        dinnerWeekdayValue: employeeData.dinnerWeekdayValue || 0,
        dinnerWeekendValue: employeeData.dinnerWeekendValue || 0,
        dinnerStartTime: employeeData.dinnerStartTime || null,
        dinnerEndTime: employeeData.dinnerEndTime || null,
      },
    });

    // Log de auditoria
    await logAuditAction({
      userId: context.session.user.id,
      userEmail: context.session.user.email,
      action: "CREATE_EMPLOYEE",
      resource: "/api/employees",
      resourceId: employee.id,
      details: { 
        employeeName: employee.name,
        employeeRole: employee.role,
      },
      ip: context.ip,
      userAgent: context.userAgent,
    });

    return successResponse(employee, 201);
  },
  {
    requireAuth: true,
    bodySchema: createEmployeeSchema,
    auditAction: "CREATE_EMPLOYEE",
  }
);

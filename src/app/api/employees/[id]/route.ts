import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { 
  withApiSecurity, 
  successResponse, 
  notFoundResponse,
  logAuditAction,
  type ApiContext 
} from "@/lib/api-security";
import { updateEmployeeSchema } from "@/lib/validation-schemas";

// ============================================================================
// GET /api/employees/[id] - Busca um funcionário específico
// ============================================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const handler = withApiSecurity(
    async (req: NextRequest, context: ApiContext) => {
      const { id } = await params;
      
      const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
          advances: {
            orderBy: { requestDate: "desc" },
            take: 5,
          },
          _count: {
            select: { 
              advances: true,
              timeEntries: true,
            },
          },
        },
      });

      if (!employee) {
        return notFoundResponse("Funcionário");
      }

      return successResponse(employee);
    },
    {
      requireAuth: true,
    }
  );

  return handler(request);
}

// ============================================================================
// PUT /api/employees/[id] - Atualiza um funcionário
// ============================================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const handler = withApiSecurity(
    async (req: NextRequest, context: ApiContext, data: unknown) => {
      const { id } = await params;
      const updates = data as Record<string, unknown>;

      // Verificar se funcionário existe
      const existingEmployee = await prisma.employee.findUnique({
        where: { id },
      });

      if (!existingEmployee) {
        return notFoundResponse("Funcionário");
      }

      // Preparar dados para atualização (apenas campos fornecidos)
      const updateData: Record<string, unknown> = {};
      
      const allowedFields = [
        "name", "role", "phone", "document", "salary", "active",
        "worksLunch", "lunchPaymentType", "lunchValue", "lunchStartTime", "lunchEndTime",
        "worksDinner", "dinnerPaymentType", "dinnerWeekdayValue", "dinnerWeekendValue", 
        "dinnerStartTime", "dinnerEndTime"
      ];

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          updateData[field] = updates[field];
        }
      }

      // Tratar hireDate separadamente
      if (updates.hireDate) {
        updateData.hireDate = new Date(updates.hireDate as string);
      }

      // Atualizar funcionário
      const employee = await prisma.employee.update({
        where: { id },
        data: updateData,
      });

      // Log de auditoria
      await logAuditAction({
        userId: context.session.user.id,
        userEmail: context.session.user.email,
        action: "UPDATE_EMPLOYEE",
        resource: `/api/employees/${id}`,
        resourceId: id,
        details: { 
          employeeName: employee.name,
          updatedFields: Object.keys(updateData),
        },
        ip: context.ip,
        userAgent: context.userAgent,
      });

      return successResponse(employee);
    },
    {
      requireAuth: true,
      bodySchema: updateEmployeeSchema,
    }
  );

  return handler(request);
}

// ============================================================================
// DELETE /api/employees/[id] - Remove um funcionário
// ============================================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const handler = withApiSecurity(
    async (req: NextRequest, context: ApiContext) => {
      const { id } = await params;

      // Verificar se funcionário existe
      const employee = await prisma.employee.findUnique({
        where: { id },
        select: { id: true, name: true },
      });

      if (!employee) {
        return notFoundResponse("Funcionário");
      }

      // Deletar funcionário (cascade vai remover advances, time entries, etc.)
      await prisma.employee.delete({
        where: { id },
      });

      // Log de auditoria
      await logAuditAction({
        userId: context.session.user.id,
        userEmail: context.session.user.email,
        action: "DELETE_EMPLOYEE",
        resource: `/api/employees/${id}`,
        resourceId: id,
        details: { deletedEmployeeName: employee.name },
        ip: context.ip,
        userAgent: context.userAgent,
      });

      return successResponse({ message: "Funcionário excluído com sucesso" });
    },
    {
      requireAuth: true,
      requiredRoles: ["ADMIN"], // Apenas admin pode deletar
    }
  );

  return handler(request);
}

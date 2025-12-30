import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { 
  withApiSecurity, 
  successResponse, 
  notFoundResponse,
  logAuditAction,
  type ApiContext 
} from "@/lib/api-security";
import { updateAdvanceSchema } from "@/lib/validation-schemas";

// ============================================================================
// PUT /api/advances/[id] - Atualiza um adiantamento
// ============================================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const handler = withApiSecurity(
    async (req: NextRequest, context: ApiContext, data: unknown) => {
      const { id } = await params;
      const updates = data as {
        amount?: number;
        status?: string;
        paymentDate?: string | null;
        notes?: string | null;
      };

      // Verificar se adiantamento existe
      const existingAdvance = await prisma.advance.findUnique({
        where: { id },
        include: { employee: { select: { name: true } } },
      });

      if (!existingAdvance) {
        return notFoundResponse("Adiantamento");
      }

      // Preparar dados para atualização
      const updateData: Record<string, unknown> = {};
      
      if (updates.amount !== undefined) {
        updateData.amount = updates.amount;
      }
      
      if (updates.status) {
        updateData.status = updates.status;
        
        // Se estiver marcando como pago, adiciona a data de pagamento
        if (updates.status === "PAID" && !updates.paymentDate) {
          updateData.paymentDate = new Date();
        }
      }
      
      if (updates.paymentDate) {
        updateData.paymentDate = new Date(updates.paymentDate);
      }
      
      if (updates.notes !== undefined) {
        updateData.notes = updates.notes;
      }

      // Atualizar adiantamento
      const advance = await prisma.advance.update({
        where: { id },
        data: updateData,
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
        action: "UPDATE_ADVANCE",
        resource: `/api/advances/${id}`,
        resourceId: id,
        details: { 
          employeeName: existingAdvance.employee.name,
          updatedFields: Object.keys(updateData),
          newStatus: updates.status,
        },
        ip: context.ip,
        userAgent: context.userAgent,
      });

      return successResponse(advance);
    },
    {
      requireAuth: true,
      bodySchema: updateAdvanceSchema,
    }
  );

  return handler(request);
}

// ============================================================================
// DELETE /api/advances/[id] - Remove um adiantamento
// ============================================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const handler = withApiSecurity(
    async (req: NextRequest, context: ApiContext) => {
      const { id } = await params;

      // Verificar se adiantamento existe
      const advance = await prisma.advance.findUnique({
        where: { id },
        include: { employee: { select: { name: true } } },
      });

      if (!advance) {
        return notFoundResponse("Adiantamento");
      }

      // Deletar adiantamento
      await prisma.advance.delete({
        where: { id },
      });

      // Log de auditoria
      await logAuditAction({
        userId: context.session.user.id,
        userEmail: context.session.user.email,
        action: "DELETE_ADVANCE",
        resource: `/api/advances/${id}`,
        resourceId: id,
        details: { 
          employeeName: advance.employee.name,
          amount: advance.amount,
        },
        ip: context.ip,
        userAgent: context.userAgent,
      });

      return successResponse({ message: "Adiantamento excluído com sucesso" });
    },
    {
      requireAuth: true,
    }
  );

  return handler(request);
}

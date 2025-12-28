import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { bonuses, deductions, paid, paymentDate, notes } = body;

    const current = await prisma.payrollEntry.findUnique({
      where: { id },
    });

    if (!current) {
      return NextResponse.json(
        { error: "Entrada não encontrada" },
        { status: 404 }
      );
    }

    const newBonuses = bonuses !== undefined ? parseFloat(bonuses) : Number(current.bonuses);
    const newDeductions = deductions !== undefined ? parseFloat(deductions) : Number(current.deductions);
    const netSalary = Number(current.baseSalary) - Number(current.advances) + newBonuses - newDeductions;

    const entry = await prisma.payrollEntry.update({
      where: { id },
      data: {
        bonuses: newBonuses,
        deductions: newDeductions,
        netSalary,
        paid: paid !== undefined ? paid : current.paid,
        paymentDate: paymentDate ? new Date(paymentDate) : (paid ? new Date() : null),
        notes,
      },
      include: {
        employee: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Erro ao atualizar folha:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar folha de pagamento" },
      { status: 500 }
    );
  }
}


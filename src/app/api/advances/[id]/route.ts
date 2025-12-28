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
    const { status, paymentDate, notes } = body;

    const updateData: Record<string, unknown> = {};
    
    if (status) {
      updateData.status = status;
      
      // Se estiver marcando como pago, adiciona a data de pagamento
      if (status === "PAID" && !paymentDate) {
        updateData.paymentDate = new Date();
      }
    }
    
    if (paymentDate) {
      updateData.paymentDate = new Date(paymentDate);
    }
    
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const advance = await prisma.advance.update({
      where: { id },
      data: updateData,
      include: {
        employee: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(advance);
  } catch (error) {
    console.error("Erro ao atualizar adiantamento:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar adiantamento" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.advance.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Adiantamento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir adiantamento:", error);
    return NextResponse.json(
      { error: "Erro ao excluir adiantamento" },
      { status: 500 }
    );
  }
}


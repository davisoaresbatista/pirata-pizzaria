import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        advances: {
          orderBy: { requestDate: "desc" },
        },
        payrollEntries: {
          orderBy: { month: "desc" },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Funcionário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Erro ao buscar funcionário:", error);
    return NextResponse.json(
      { error: "Erro ao buscar funcionário" },
      { status: 500 }
    );
  }
}

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
    const { name, role, salary, phone, document, hireDate, active } = body;

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        name,
        role,
        salary: salary ? parseFloat(salary) : undefined,
        phone,
        document,
        hireDate: hireDate ? new Date(hireDate) : undefined,
        active,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Erro ao atualizar funcionário:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar funcionário" },
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
    await prisma.employee.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Funcionário excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir funcionário:", error);
    return NextResponse.json(
      { error: "Erro ao excluir funcionário" },
      { status: 500 }
    );
  }
}


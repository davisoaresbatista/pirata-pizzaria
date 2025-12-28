import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    const where: Record<string, unknown> = {};
    if (month) {
      where.month = month;
    }

    const payroll = await prisma.payrollEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        employee: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    return NextResponse.json(payroll);
  } catch (error) {
    console.error("Erro ao buscar folha:", error);
    return NextResponse.json(
      { error: "Erro ao buscar folha de pagamento" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { month } = body;

    if (!month) {
      return NextResponse.json(
        { error: "Mês é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar todos os funcionários ativos
    const employees = await prisma.employee.findMany({
      where: { active: true },
      include: {
        advances: {
          where: {
            status: "PAID",
            paymentDate: {
              gte: new Date(`${month}-01`),
              lt: new Date(
                new Date(`${month}-01`).getFullYear(),
                new Date(`${month}-01`).getMonth() + 1,
                1
              ),
            },
          },
        },
      },
    });

    // Criar ou atualizar entradas de folha para cada funcionário
    const entries = [];
    for (const employee of employees) {
      const totalAdvances = employee.advances.reduce(
        (sum, adv) => sum + Number(adv.amount),
        0
      );

      const netSalary = Number(employee.salary) - totalAdvances;

      const entry = await prisma.payrollEntry.upsert({
        where: {
          employeeId_month: {
            employeeId: employee.id,
            month,
          },
        },
        update: {
          baseSalary: employee.salary,
          advances: totalAdvances,
          netSalary,
        },
        create: {
          employeeId: employee.id,
          month,
          baseSalary: employee.salary,
          advances: totalAdvances,
          netSalary,
        },
        include: {
          employee: {
            select: { id: true, name: true, role: true },
          },
        },
      });

      entries.push(entry);
    }

    return NextResponse.json(entries, { status: 201 });
  } catch (error) {
    console.error("Erro ao gerar folha:", error);
    return NextResponse.json(
      { error: "Erro ao gerar folha de pagamento" },
      { status: 500 }
    );
  }
}


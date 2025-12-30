import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const periods = await prisma.payrollPeriod.findMany({
      include: {
        payments: true,
      },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json(periods);
  } catch (error) {
    console.error("Erro ao buscar períodos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar períodos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { startDate, endDate, periodType } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Datas de início e fim são obrigatórias" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Buscar todos os registros de ponto do período
    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        employee: true,
      },
    });

    // Buscar todos os funcionários ativos
    const employees = await prisma.employee.findMany({
      where: { active: true },
    });

    // Buscar adiantamentos PAGOS (já entregues ao funcionário)
    // Estes são os que devem ser descontados do salário
    const advances = await prisma.advance.findMany({
      where: {
        status: "PAID",
      },
    });

    // Agrupar adiantamentos por funcionário
    const advancesByEmployee = advances.reduce((acc, adv) => {
      acc[adv.employeeId] = (acc[adv.employeeId] || 0) + Number(adv.amount);
      return acc;
    }, {} as Record<string, number>);
    
    // IDs dos adiantamentos que serão marcados como pagos
    const advanceIds = advances.map(a => a.id);

    // Calcular pagamentos por funcionário
    const payments = employees.map((emp) => {
      const empEntries = timeEntries.filter((e) => e.employeeId === emp.id && e.status === "PRESENT");
      const daysWorked = empEntries.length;
      const lunchShifts = empEntries.filter((e) => e.workedLunch).length;
      const dinnerShifts = empEntries.filter((e) => e.workedDinner).length;
      
      // Somar valores já calculados nos registros de ponto
      // Os valores já incluem o cálculo proporcional para mensalistas
      const lunchTotal = empEntries.reduce((sum, e) => sum + Number(e.lunchValue || 0), 0);
      const dinnerTotal = empEntries.reduce((sum, e) => sum + Number(e.dinnerValue || 0), 0);
      
      // O fixedSalary agora é apenas informativo para identificar mensalistas
      // Não é somado ao grossAmount pois já está incluído no lunchTotal/dinnerTotal
      const fixedSalary = 0;

      const grossAmount = Math.round((lunchTotal + dinnerTotal) * 100) / 100;
      const advancesAmount = advancesByEmployee[emp.id] || 0;
      const netAmount = Math.max(0, Math.round((grossAmount - advancesAmount) * 100) / 100);

      return {
        employeeId: emp.id,
        employeeName: emp.name,
        daysWorked,
        lunchShifts,
        dinnerShifts,
        fixedSalary,
        lunchTotal: Math.round(lunchTotal * 100) / 100,
        dinnerTotal: Math.round(dinnerTotal * 100) / 100,
        grossAmount,
        advances: advancesAmount,
        deductions: 0,
        netAmount,
      };
    }).filter((p) => p.grossAmount > 0 || p.advances > 0);

    // Calcular total do período
    const totalAmount = Math.round(payments.reduce((sum, p) => sum + p.netAmount, 0) * 100) / 100;

    // Criar período com pagamentos
    const period = await prisma.payrollPeriod.create({
      data: {
        startDate: start,
        endDate: end,
        periodType: periodType || "CUSTOM",
        totalAmount,
        payments: {
          create: payments,
        },
      },
      include: {
        payments: true,
      },
    });

    // Marcar adiantamentos como DESCONTADOS (já foram abatidos do salário)
    if (advanceIds.length > 0) {
      await prisma.advance.updateMany({
        where: {
          id: {
            in: advanceIds,
          },
        },
        data: {
          status: "DISCOUNTED",
        },
      });
    }

    return NextResponse.json(period, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar período:", error);
    return NextResponse.json(
      { error: "Erro ao criar período" },
      { status: 500 }
    );
  }
}


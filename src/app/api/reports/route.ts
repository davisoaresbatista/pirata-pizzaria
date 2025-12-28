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
    const type = searchParams.get("type") || "overview";

    if (!month) {
      return NextResponse.json(
        { error: "Mês é obrigatório" },
        { status: 400 }
      );
    }

    const [year, monthNum] = month.split("-");
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);

    if (type === "overview") {
      // Resumo geral
      const [expenses, revenues, payroll, employees, advances] = await Promise.all([
        prisma.expense.aggregate({
          where: { date: { gte: startDate, lte: endDate } },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.revenue.aggregate({
          where: { date: { gte: startDate, lte: endDate } },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.payrollEntry.aggregate({
          where: { month },
          _sum: { netSalary: true },
          _count: true,
        }),
        prisma.employee.count({ where: { active: true } }),
        prisma.advance.aggregate({
          where: {
            status: "PAID",
            paymentDate: { gte: startDate, lte: endDate },
          },
          _sum: { amount: true },
          _count: true,
        }),
      ]);

      const totalExpenses = Number(expenses._sum.amount || 0);
      const totalRevenue = Number(revenues._sum.amount || 0);
      const totalPayroll = Number(payroll._sum.netSalary || 0);
      const totalAdvances = Number(advances._sum.amount || 0);
      
      const profit = totalRevenue - totalExpenses - totalPayroll;

      return NextResponse.json({
        month,
        revenue: {
          total: totalRevenue,
          count: revenues._count,
        },
        expenses: {
          total: totalExpenses,
          count: expenses._count,
        },
        payroll: {
          total: totalPayroll,
          count: payroll._count,
        },
        advances: {
          total: totalAdvances,
          count: advances._count,
        },
        employees: employees,
        profit,
      });
    }

    if (type === "expenses-by-category") {
      const expensesByCategory = await prisma.expense.groupBy({
        by: ["category"],
        where: { date: { gte: startDate, lte: endDate } },
        _sum: { amount: true },
        _count: true,
      });

      return NextResponse.json(expensesByCategory);
    }

    if (type === "revenues-by-source") {
      const revenuesBySource = await prisma.revenue.groupBy({
        by: ["source"],
        where: { date: { gte: startDate, lte: endDate } },
        _sum: { amount: true },
        _count: true,
      });

      return NextResponse.json(revenuesBySource);
    }

    if (type === "employees") {
      const employeesReport = await prisma.employee.findMany({
        where: { active: true },
        include: {
          advances: {
            where: {
              status: "PAID",
              paymentDate: { gte: startDate, lte: endDate },
            },
          },
          payrollEntries: {
            where: { month },
          },
        },
      });

      const report = employeesReport.map((emp) => ({
        id: emp.id,
        name: emp.name,
        role: emp.role,
        salary: Number(emp.salary),
        advances: emp.advances.reduce((sum, a) => sum + Number(a.amount), 0),
        advancesCount: emp.advances.length,
        payroll: emp.payrollEntries[0]
          ? {
              netSalary: Number(emp.payrollEntries[0].netSalary),
              paid: emp.payrollEntries[0].paid,
            }
          : null,
      }));

      return NextResponse.json(report);
    }

    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    return NextResponse.json(
      { error: "Erro ao gerar relatório" },
      { status: 500 }
    );
  }
}


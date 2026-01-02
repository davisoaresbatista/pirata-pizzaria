import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/admin/DashboardContent";

async function getDashboardData() {
  const now = new Date();
  
  // Se estamos nos primeiros 5 dias do mês, usar mês anterior para ter dados completos
  const useLastMonth = now.getDate() <= 5;
  const referenceDate = useLastMonth 
    ? new Date(now.getFullYear(), now.getMonth() - 1, 1)
    : now;
  
  // Período atual (mês de referência)
  const startOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const endOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59);
  
  // Período anterior (mês anterior ao de referência)
  const startOfLastMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 1);
  const endOfLastMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0, 23, 59, 59);
  
  // Semana atual
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // ========== FUNCIONÁRIOS ==========
  const employees = await prisma.employee.findMany({
    where: { active: true },
    include: {
      advances: {
        where: {
          status: { in: ["PENDING", "APPROVED", "PAID"] }
        }
      },
      timeEntries: {
        where: {
          date: { gte: startOfMonth, lte: endOfMonth }
        }
      }
    }
  });

  const totalEmployees = employees.length;
  const lunchOnlyEmployees = employees.filter(e => e.worksLunch && !e.worksDinner).length;
  const dinnerOnlyEmployees = employees.filter(e => !e.worksLunch && e.worksDinner).length;
  const bothShiftsEmployees = employees.filter(e => e.worksLunch && e.worksDinner).length;

  // ========== ADIANTAMENTOS ==========
  const allAdvances = await prisma.advance.findMany({
    where: {
      requestDate: { gte: startOfMonth, lte: endOfMonth }
    },
    include: { employee: { select: { name: true } } }
  });

  const pendingAdvances = allAdvances.filter(a => a.status === "PENDING");
  const approvedAdvances = allAdvances.filter(a => a.status === "APPROVED");
  const paidAdvances = allAdvances.filter(a => a.status === "PAID");

  const pendingAmount = pendingAdvances.reduce((sum, a) => sum + Number(a.amount), 0);
  const approvedAmount = approvedAdvances.reduce((sum, a) => sum + Number(a.amount), 0);
  const paidAmount = paidAdvances.reduce((sum, a) => sum + Number(a.amount), 0);

  // Funcionários com mais adiantamentos
  const advancesByEmployee = employees.map(e => ({
    name: e.name,
    total: e.advances.reduce((sum, a) => sum + Number(a.amount), 0),
    count: e.advances.length
  })).filter(e => e.count > 0).sort((a, b) => b.total - a.total).slice(0, 5);

  // ========== RECEITAS (VENDAS DO CONSUMER CONNECT) ==========
  // Buscar vendas do mês atual
  const currentMonthSales = await prisma.$queryRaw<
    Array<{ orders: bigint; revenue: string; avgTicket: string; items: bigint }>
  >`
    SELECT 
      COUNT(*) as orders,
      COALESCE(SUM(CAST(amount AS REAL)), 0) as revenue,
      COALESCE(AVG(CAST(amount AS REAL)), 0) as avgTicket,
      COALESCE(SUM(itemsCount), 0) as items
    FROM sales_orders
    WHERE deletedAt IS NULL
      AND openedAt >= ${startOfMonth.getTime()}
      AND openedAt <= ${endOfMonth.getTime()}
  `;

  // Buscar vendas do mês anterior
  const lastMonthSales = await prisma.$queryRaw<
    Array<{ orders: bigint; revenue: string }>
  >`
    SELECT 
      COUNT(*) as orders,
      COALESCE(SUM(CAST(amount AS REAL)), 0) as revenue
    FROM sales_orders
    WHERE deletedAt IS NULL
      AND openedAt >= ${startOfLastMonth.getTime()}
      AND openedAt <= ${endOfLastMonth.getTime()}
  `;

  const monthlyRevenue = Number(currentMonthSales[0]?.revenue || 0);
  const lastMonthRevenue = Number(lastMonthSales[0]?.revenue || 0);
  const totalOrders = Number(currentMonthSales[0]?.orders || 0);
  const avgTicket = Number(currentMonthSales[0]?.avgTicket || 0);

  const revenueChange = lastMonthRevenue > 0 
    ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;

  // Receitas por tipo de atendimento
  const salesByType = await prisma.$queryRaw<
    Array<{ type: string; revenue: string; orders: bigint }>
  >`
    SELECT 
      CASE 
        WHEN isCounter = 1 THEN 'Balcão'
        WHEN isDelivery = 1 THEN 'Delivery'
        ELSE 'Mesa'
      END as type,
      SUM(CAST(amount AS REAL)) as revenue,
      COUNT(*) as orders
    FROM sales_orders
    WHERE deletedAt IS NULL
      AND openedAt >= ${startOfMonth.getTime()}
      AND openedAt <= ${endOfMonth.getTime()}
    GROUP BY 
      CASE 
        WHEN isCounter = 1 THEN 'Balcão'
        WHEN isDelivery = 1 THEN 'Delivery'
        ELSE 'Mesa'
      END
  `;

  const revenueBySource = salesByType.reduce((acc, s) => {
    acc[s.type] = Number(s.revenue) || 0;
    return acc;
  }, {} as Record<string, number>);

  // ========== DESPESAS ==========
  const expenses = await prisma.expense.findMany({
    where: { date: { gte: startOfMonth, lte: endOfMonth } }
  });
  const monthlyExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const lastMonthExpenses = await prisma.expense.findMany({
    where: { date: { gte: startOfLastMonth, lte: endOfLastMonth } }
  });
  const lastMonthExpense = lastMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const expenseChange = lastMonthExpense > 0 
    ? ((monthlyExpenses - lastMonthExpense) / lastMonthExpense) * 100 
    : 0;

  // Despesas por categoria
  const expenseByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {} as Record<string, number>);

  const topExpenseCategory = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];

  // ========== CONTROLE DE PONTO ==========
  const timeEntries = await prisma.timeEntry.findMany({
    where: { date: { gte: startOfMonth, lte: endOfMonth } },
    include: { employee: { select: { name: true } } }
  });

  const lastMonthTimeEntries = await prisma.timeEntry.findMany({
    where: { date: { gte: startOfLastMonth, lte: endOfLastMonth } }
  });

  const lunchShifts = timeEntries.filter(e => e.workedLunch).length;
  const dinnerShifts = timeEntries.filter(e => e.workedDinner).length;
  const totalShiftValue = timeEntries.reduce((sum, e) => sum + Number(e.totalValue), 0);
  const lastMonthShiftValue = lastMonthTimeEntries.reduce((sum, e) => sum + Number(e.totalValue), 0);

  const shiftCostChange = lastMonthShiftValue > 0 
    ? ((totalShiftValue - lastMonthShiftValue) / lastMonthShiftValue) * 100 
    : 0;

  // Dias trabalhados únicos
  const workDays = new Set(timeEntries.map(e => e.date.toISOString().split('T')[0])).size;

  // Funcionários que mais trabalharam
  const workByEmployee = timeEntries.reduce((acc, e) => {
    const name = e.employee.name;
    if (!acc[name]) acc[name] = { shifts: 0, value: 0 };
    if (e.workedLunch) acc[name].shifts++;
    if (e.workedDinner) acc[name].shifts++;
    acc[name].value += Number(e.totalValue);
    return acc;
  }, {} as Record<string, { shifts: number; value: number }>);

  const topWorkers = Object.entries(workByEmployee)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.shifts - a.shifts)
    .slice(0, 5);

  // Registros de hoje
  const todayEntries = await prisma.timeEntry.findMany({
    where: { date: { gte: today, lt: tomorrow } },
    include: { employee: { select: { name: true } } }
  });

  const todayLunch = todayEntries.filter(e => e.workedLunch).length;
  const todayDinner = todayEntries.filter(e => e.workedDinner).length;
  const todayValue = todayEntries.reduce((sum, e) => sum + Number(e.totalValue), 0);

  // Registros da semana
  const weekEntries = await prisma.timeEntry.findMany({
    where: { date: { gte: startOfWeek, lt: tomorrow } }
  });
  const weekValue = weekEntries.reduce((sum, e) => sum + Number(e.totalValue), 0);

  // ========== FECHAMENTOS ==========
  const payrollPeriods = await prisma.payrollPeriod.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      payments: true
    }
  });

  const lastPayroll = payrollPeriods[0];
  const lastPayrollTotal = lastPayroll 
    ? lastPayroll.payments.reduce((sum, p) => sum + Number(p.netAmount), 0)
    : 0;

  // ========== CÁLCULOS FINAIS ==========
  const totalCosts = monthlyExpenses + totalShiftValue;
  const profit = monthlyRevenue - totalCosts;
  const profitMargin = monthlyRevenue > 0 ? (profit / monthlyRevenue) * 100 : 0;

  const avgDailyCost = workDays > 0 ? totalShiftValue / workDays : 0;
  const avgShiftCost = (lunchShifts + dinnerShifts) > 0 
    ? totalShiftValue / (lunchShifts + dinnerShifts) 
    : 0;

  // Dia da semana mais caro
  const costByDayOfWeek = timeEntries.reduce((acc, e) => {
    const day = e.date.getDay();
    acc[day] = (acc[day] || 0) + Number(e.totalValue);
    return acc;
  }, {} as Record<number, number>);

  const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const mostExpensiveDay = Object.entries(costByDayOfWeek)
    .sort((a, b) => b[1] - a[1])[0];

  // ========== PROJEÇÃO DE VENDAS ==========
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const dailyAvgRevenue = currentDay > 0 ? monthlyRevenue / currentDay : 0;
  const projectedRevenue = dailyAvgRevenue * daysInMonth;
  const dailyAvgOrders = currentDay > 0 ? totalOrders / currentDay : 0;

  // ========== ALERTAS E INSIGHTS ==========
  const alerts: { type: "warning" | "info" | "success"; message: string }[] = [];

  if (pendingAdvances.length > 3) {
    alerts.push({ type: "warning", message: `${pendingAdvances.length} adiantamentos pendentes de aprovação` });
  }
  if (expenseChange > 20) {
    alerts.push({ type: "warning", message: `Despesas aumentaram ${expenseChange.toFixed(0)}% em relação ao mês passado` });
  }
  if (profit < 0) {
    alerts.push({ type: "warning", message: "Resultado do mês está negativo - atenção!" });
  }
  if (profitMargin > 20) {
    alerts.push({ type: "success", message: `Margem de lucro está em ${profitMargin.toFixed(0)}% - excelente!` });
  }
  if (todayLunch === 0 && now.getHours() < 17 && now.getDay() !== 1) {
    alerts.push({ type: "info", message: "Nenhum registro de ponto para o almoço de hoje" });
  }
  if (revenueChange > 15) {
    alerts.push({ type: "success", message: `Receita cresceu ${revenueChange.toFixed(0)}% vs mês anterior!` });
  }
  if (revenueChange < -15) {
    alerts.push({ type: "warning", message: `Receita caiu ${Math.abs(revenueChange).toFixed(0)}% vs mês anterior` });
  }

  return {
    // Funcionários
    totalEmployees,
    lunchOnlyEmployees,
    dinnerOnlyEmployees,
    bothShiftsEmployees,
    
    // Adiantamentos
    pendingAdvances: pendingAdvances.length,
    approvedAdvances: approvedAdvances.length,
    paidAdvances: paidAdvances.length,
    pendingAmount,
    approvedAmount,
    paidAmount,
    advancesByEmployee,
    
    // Receitas (Vendas)
    monthlyRevenue,
    revenueChange,
    revenueBySource,
    totalOrders,
    avgTicket,
    dailyAvgRevenue,
    dailyAvgOrders,
    projectedRevenue,
    
    // Despesas
    monthlyExpenses,
    expenseChange,
    topExpenseCategory: topExpenseCategory as [string, number],
    expenseByCategory,
    
    // Ponto
    lunchShifts,
    dinnerShifts,
    totalShiftValue,
    shiftCostChange,
    workDays,
    topWorkers,
    
    // Hoje
    todayLunch,
    todayDinner,
    todayValue,
    
    // Semana
    weekValue,
    
    // Fechamento
    lastPayrollTotal,
    lastPayrollDate: lastPayroll?.createdAt,
    
    // Calculados
    totalCosts,
    profit,
    profitMargin,
    avgDailyCost,
    avgShiftCost,
    mostExpensiveDay: mostExpensiveDay ? dayNames[Number(mostExpensiveDay[0])] : "N/A",
    mostExpensiveDayValue: mostExpensiveDay ? mostExpensiveDay[1] : 0,
    
    // Alertas
    alerts,
    
    // Meta
    currentMonth: now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
    daysInMonth: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(),
    currentDay: now.getDate(),
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/admin/ponto");
  }

  const stats = await getDashboardData();

  return <DashboardContent stats={stats} />;
}

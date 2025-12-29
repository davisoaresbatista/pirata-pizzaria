import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wallet, TrendingUp, TrendingDown, DollarSign, Sun, Moon, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Funcionários
  const totalEmployees = await prisma.employee.count();
  const activeEmployees = await prisma.employee.count({ where: { active: true } });

  // Adiantamentos pendentes
  const pendingAdvances = await prisma.advance.findMany({
    where: { status: "PENDING" },
  });
  const totalAdvancesPending = pendingAdvances.reduce(
    (sum, a) => sum + Number(a.amount),
    0
  );

  // Receitas do mês
  const revenues = await prisma.revenue.findMany({
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });
  const monthlyRevenue = revenues.reduce((sum, r) => sum + Number(r.amount), 0);

  // Despesas do mês
  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });
  const monthlyExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // Registros de ponto do mês
  const timeEntries = await prisma.timeEntry.findMany({
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  const lunchShifts = timeEntries.filter((e) => e.workedLunch).length;
  const dinnerShifts = timeEntries.filter((e) => e.workedDinner).length;
  const totalShiftValue = timeEntries.reduce(
    (sum, e) => sum + Number(e.totalValue),
    0
  );

  // Registros de hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayEntries = await prisma.timeEntry.findMany({
    where: {
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  const todayLunch = todayEntries.filter((e) => e.workedLunch).length;
  const todayDinner = todayEntries.filter((e) => e.workedDinner).length;
  const todayValue = todayEntries.reduce((sum, e) => sum + Number(e.totalValue), 0);

  return {
    totalEmployees,
    activeEmployees,
    pendingAdvancesCount: pendingAdvances.length,
    totalAdvancesPending,
    monthlyRevenue,
    monthlyExpenses,
    lunchShifts,
    dinnerShifts,
    totalShiftValue,
    todayLunch,
    todayDinner,
    todayValue,
    currentMonth: now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardData();

  const profit = stats.monthlyRevenue - stats.monthlyExpenses - stats.totalShiftValue;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral - {stats.currentMonth}
        </p>
      </div>

      {/* Hoje */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Hoje
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Almoço
              </CardTitle>
              <Sun className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayLunch}</div>
              <p className="text-xs text-muted-foreground">funcionários</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Jantar
              </CardTitle>
              <Moon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayDinner}</div>
              <p className="text-xs text-muted-foreground">funcionários</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor do Dia
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.todayValue)}
              </div>
              <p className="text-xs text-muted-foreground">em turnos</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Funcionários Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEmployees}</div>
            <p className="text-xs text-muted-foreground">
              de {stats.totalEmployees} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Adiantamentos Pendentes
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAdvancesCount}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.totalAdvancesPending)} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita do Mês
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.monthlyRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              entradas registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas do Mês
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.monthlyExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              saídas registradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Turnos do mês */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Turnos Almoço (Mês)
            </CardTitle>
            <Sun className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lunchShifts}</div>
            <p className="text-xs text-muted-foreground">turnos trabalhados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Turnos Jantar (Mês)
            </CardTitle>
            <Moon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dinnerShifts}</div>
            <p className="text-xs text-muted-foreground">turnos trabalhados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Custo com Turnos (Mês)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(stats.totalShiftValue)}
            </div>
            <p className="text-xs text-muted-foreground">funcionários por hora</p>
          </CardContent>
        </Card>
      </div>

      {/* Resultado */}
      <Card className={profit >= 0 ? "border-green-200 bg-green-50 dark:bg-green-950/20" : "border-red-200 bg-red-50 dark:bg-red-950/20"}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Resultado do Mês (Receitas - Despesas - Turnos)
          </CardTitle>
          <DollarSign className={`h-4 w-4 ${profit >= 0 ? "text-green-600" : "text-red-600"}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${profit >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
            {formatCurrency(profit)}
          </div>
          <p className={`text-sm ${profit >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
            {profit >= 0 ? "Lucro" : "Prejuízo"} no período
          </p>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-secondary/50">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Dica:</strong> Registre o ponto diário dos funcionários e faça o fechamento semanal/quinzenal para calcular os valores a pagar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

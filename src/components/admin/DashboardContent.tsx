"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, Wallet, TrendingUp, TrendingDown, DollarSign, Sun, Moon, Calendar,
  Clock, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight, 
  PiggyBank, Receipt, CreditCard, Target, BarChart3, Percent, Activity, Utensils,
  Eye, EyeOff
} from "lucide-react";

interface DashboardStats {
  // Funcionários
  totalEmployees: number;
  lunchOnlyEmployees: number;
  dinnerOnlyEmployees: number;
  bothShiftsEmployees: number;
  
  // Adiantamentos
  pendingAdvances: number;
  approvedAdvances: number;
  paidAdvances: number;
  pendingAmount: number;
  approvedAmount: number;
  paidAmount: number;
  advancesByEmployee: { name: string; total: number; count: number }[];
  
  // Receitas (Vendas)
  monthlyRevenue: number;
  revenueChange: number;
  revenueBySource: Record<string, number>;
  totalOrders: number;
  avgTicket: number;
  dailyAvgRevenue: number;
  dailyAvgOrders: number;
  projectedRevenue: number;
  
  // Despesas
  monthlyExpenses: number;
  expenseChange: number;
  topExpenseCategory: [string, number];
  expenseByCategory: Record<string, number>;
  
  // Ponto
  lunchShifts: number;
  dinnerShifts: number;
  totalShiftValue: number;
  shiftCostChange: number;
  workDays: number;
  topWorkers: { name: string; shifts: number; value: number }[];
  
  // Hoje
  todayLunch: number;
  todayDinner: number;
  todayValue: number;
  
  // Semana
  weekValue: number;
  
  // Fechamento
  lastPayrollTotal: number;
  lastPayrollDate?: Date;
  
  // Calculados
  totalCosts: number;
  profit: number;
  profitMargin: number;
  avgDailyCost: number;
  avgShiftCost: number;
  mostExpensiveDay: string;
  mostExpensiveDayValue: number;
  
  // Alertas
  alerts: { type: "warning" | "info" | "success"; message: string }[];
  
  // Meta
  currentMonth: string;
  daysInMonth: number;
  currentDay: number;
}

interface DashboardContentProps {
  stats: DashboardStats;
}

export function DashboardContent({ stats }: DashboardContentProps) {
  const [showValues, setShowValues] = useState(true);

  const formatCurrency = (value: number) => {
    if (!showValues) return "R$ ••••••";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercent = (value: number) => {
    if (!showValues) return "••%";
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      SUPPLIES: "Suprimentos",
      UTILITIES: "Utilidades",
      MAINTENANCE: "Manutenção",
      MARKETING: "Marketing",
      RENT: "Aluguel",
      OTHER: "Outros",
    };
    return labels[category] || category;
  };

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      SALES: "Vendas",
      DELIVERY: "Delivery",
      OTHER: "Outros",
    };
    return labels[source] || source;
  };

  const progressPercent = (stats.currentDay / stats.daysInMonth) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Dashboard
          </h1>
          <p className="text-muted-foreground capitalize">
            Visão completa da operação - {stats.currentMonth}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowValues(!showValues)}
            className="gap-2"
          >
            {showValues ? (
              <>
                <EyeOff className="h-4 w-4" />
                Ocultar Valores
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Mostrar Valores
              </>
            )}
          </Button>
          <Badge variant="outline" className="text-sm">
            Dia {stats.currentDay} de {stats.daysInMonth}
          </Badge>
          <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Alertas */}
      {stats.alerts.length > 0 && (
        <div className="space-y-2">
          {stats.alerts.map((alert, i) => (
            <div 
              key={i}
              className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                alert.type === "warning" 
                  ? "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400" 
                  : alert.type === "success"
                  ? "bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-400"
                  : "bg-blue-50 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400"
              }`}
            >
              {alert.type === "warning" && <AlertTriangle className="h-4 w-4" />}
              {alert.type === "success" && <CheckCircle className="h-4 w-4" />}
              {alert.type === "info" && <Activity className="h-4 w-4" />}
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* KPIs de Vendas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Faturamento
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.monthlyRevenue)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {stats.revenueChange >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-xs ${stats.revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatPercent(stats.revenueChange)} vs mês anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pedidos
            </CardTitle>
            <Utensils className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showValues ? stats.totalOrders.toLocaleString() : "••••"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ~{showValues ? Math.round(stats.dailyAvgOrders) : "••"}/dia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Médio
            </CardTitle>
            <Receipt className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(stats.avgTicket)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              por pedido
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projeção Mensal
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {formatCurrency(stats.projectedRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              estimado para o mês
            </p>
          </CardContent>
        </Card>

        <Card className={stats.profit >= 0 ? "border-green-300 bg-green-50/50 dark:bg-green-950/20" : "border-red-300 bg-red-50/50 dark:bg-red-950/20"}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resultado
            </CardTitle>
            <Target className={`h-4 w-4 ${stats.profit >= 0 ? "text-green-600" : "text-red-600"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.profit >= 0 ? "text-green-700" : "text-red-700"}`}>
              {formatCurrency(stats.profit)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Percent className="h-3 w-3" />
              <span className="text-xs text-muted-foreground">
                Margem: {showValues ? `${stats.profitMargin.toFixed(1)}%` : "••%"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPIs de Custos */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas Operacionais
            </CardTitle>
            <Receipt className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.monthlyExpenses)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {stats.expenseChange <= 0 ? (
                <ArrowDownRight className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowUpRight className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-xs ${stats.expenseChange <= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatPercent(stats.expenseChange)} vs mês anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Custo de Pessoal
            </CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(stats.totalShiftValue)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {stats.shiftCostChange <= 0 ? (
                <ArrowDownRight className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowUpRight className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-xs ${stats.shiftCostChange <= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatPercent(stats.shiftCostChange)} vs mês anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Custo Total
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalCosts)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.monthlyRevenue > 0 ? `${((stats.totalCosts / stats.monthlyRevenue) * 100).toFixed(0)}% da receita` : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Operação de Hoje e Semana */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Hoje
              </CardTitle>
              <Badge variant="outline">{formatCurrency(stats.todayValue)}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <Sun className="h-8 w-8 text-amber-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.todayLunch}</div>
                  <div className="text-xs text-muted-foreground">no almoço</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Moon className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.todayDinner}</div>
                  <div className="text-xs text-muted-foreground">no jantar</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Esta Semana
              </CardTitle>
              <Badge variant="outline">{formatCurrency(stats.weekValue)}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Custo médio/dia</span>
                <span className="font-semibold">{formatCurrency(stats.avgDailyCost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Custo médio/turno</span>
                <span className="font-semibold">{formatCurrency(stats.avgShiftCost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Dia mais caro</span>
                <span className="font-semibold">{stats.mostExpensiveDay}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento - 3 colunas */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Equipe */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Equipe
            </CardTitle>
            <CardDescription>Distribuição por turno</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <div className="text-4xl font-bold">{stats.totalEmployees}</div>
              <div className="text-sm text-muted-foreground">funcionários ativos</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-sm">
                  <Sun className="h-4 w-4 text-amber-500" />
                  Só Almoço
                </span>
                <Badge variant="secondary">{stats.lunchOnlyEmployees}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-sm">
                  <Moon className="h-4 w-4 text-blue-500" />
                  Só Jantar
                </span>
                <Badge variant="secondary">{stats.dinnerOnlyEmployees}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-sm">
                  <Utensils className="h-4 w-4 text-purple-500" />
                  Ambos
                </span>
                <Badge variant="secondary">{stats.bothShiftsEmployees}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Turnos do Mês */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Turnos do Mês
            </CardTitle>
            <CardDescription>{stats.workDays} dias trabalhados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <Sun className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                <div className="text-2xl font-bold">{stats.lunchShifts}</div>
                <div className="text-xs text-muted-foreground">almoço</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Moon className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <div className="text-2xl font-bold">{stats.dinnerShifts}</div>
                <div className="text-xs text-muted-foreground">jantar</div>
              </div>
            </div>
            <div className="p-3 bg-secondary/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total de turnos</span>
                <span className="font-bold">{stats.lunchShifts + stats.dinnerShifts}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm">Custo total</span>
                <span className="font-bold text-orange-600">{formatCurrency(stats.totalShiftValue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Adiantamentos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Adiantamentos
            </CardTitle>
            <CardDescription>Status do mês</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-2 rounded bg-amber-50 dark:bg-amber-950/20">
              <span className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                Pendentes
              </span>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(stats.pendingAmount)}</div>
                <div className="text-xs text-muted-foreground">{stats.pendingAdvances} solic.</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-blue-50 dark:bg-blue-950/20">
              <span className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Aprovados
              </span>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(stats.approvedAmount)}</div>
                <div className="text-xs text-muted-foreground">{stats.approvedAdvances} aprov.</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-green-50 dark:bg-green-950/20">
              <span className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Pagos
              </span>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(stats.paidAmount)}</div>
                <div className="text-xs text-muted-foreground">{stats.paidAdvances} pagos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rankings e Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Trabalhadores */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top 5 - Mais Turnos
            </CardTitle>
            <CardDescription>Funcionários com mais turnos no mês</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topWorkers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum registro ainda
              </p>
            ) : (
              <div className="space-y-3">
                {stats.topWorkers.map((worker, i) => (
                  <div key={worker.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? "bg-amber-100 text-amber-700" :
                        i === 1 ? "bg-gray-100 text-gray-700" :
                        i === 2 ? "bg-orange-100 text-orange-700" :
                        "bg-secondary text-muted-foreground"
                      }`}>
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium">{worker.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{worker.shifts} turnos</div>
                      <div className="text-xs text-muted-foreground">{formatCurrency(worker.value)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Adiantamentos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Adiantamentos por Funcionário
            </CardTitle>
            <CardDescription>Top 5 com mais adiantamentos em aberto</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.advancesByEmployee.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum adiantamento em aberto
              </p>
            ) : (
              <div className="space-y-3">
                {stats.advancesByEmployee.map((emp, i) => (
                  <div key={emp.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium">{emp.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600">{formatCurrency(emp.total)}</div>
                      <div className="text-xs text-muted-foreground">{emp.count} adianto(s)</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Custos */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Despesas por Categoria */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <PiggyBank className="h-5 w-5" />
              Despesas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(stats.expenseByCategory).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma despesa registrada
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.expenseByCategory)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([category, value]) => {
                    const percent = stats.monthlyExpenses > 0 
                      ? (value / stats.monthlyExpenses) * 100 
                      : 0;
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{getCategoryLabel(category)}</span>
                          <span className="font-medium">{formatCurrency(value)}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 transition-all" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Receitas por Fonte */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Receitas por Fonte
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(stats.revenueBySource).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma receita registrada
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.revenueBySource)
                  .sort((a, b) => b[1] - a[1])
                  .map(([source, value]) => {
                    const percent = stats.monthlyRevenue > 0 
                      ? (value / stats.monthlyRevenue) * 100 
                      : 0;
                    return (
                      <div key={source} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{getSourceLabel(source)}</span>
                          <span className="font-medium">{formatCurrency(value)}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Último Fechamento */}
      {stats.lastPayrollDate && (
        <Card className="bg-secondary/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Último Fechamento</h3>
                  <p className="text-sm text-muted-foreground">
                    Realizado em {new Date(stats.lastPayrollDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatCurrency(stats.lastPayrollTotal)}</div>
                <p className="text-sm text-muted-foreground">total líquido pago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo Final */}
      <Card className={`${
        stats.profit >= 0 
          ? "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30" 
          : "border-red-300 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30"
      }`}>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Receita Total</div>
              <div className="text-xl font-bold text-green-600">{formatCurrency(stats.monthlyRevenue)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Despesas</div>
              <div className="text-xl font-bold text-red-600">{formatCurrency(stats.monthlyExpenses)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Mão de Obra</div>
              <div className="text-xl font-bold text-orange-600">{formatCurrency(stats.totalShiftValue)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Resultado</div>
              <div className={`text-2xl font-bold ${stats.profit >= 0 ? "text-green-700" : "text-red-700"}`}>
                {formatCurrency(stats.profit)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


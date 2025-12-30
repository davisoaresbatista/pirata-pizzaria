"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Wallet,
  BarChart3,
} from "lucide-react";

interface OverviewData {
  month: string;
  revenue: { total: number; count: number };
  expenses: { total: number; count: number };
  payroll: { total: number; count: number };
  advances: { total: number; count: number };
  employees: number;
  profit: number;
}

interface ExpenseByCategory {
  category: string;
  _sum: { amount: number };
  _count: number;
}

interface RevenueBySource {
  source: string;
  _sum: { amount: number };
  _count: number;
}

interface EmployeeReport {
  id: string;
  name: string;
  role: string;
  salary: number;
  advances: number;
  advancesCount: number;
  payroll: { netSalary: number; paid: boolean } | null;
}

const categoryLabels: Record<string, string> = {
  INGREDIENTS: "Ingredientes",
  UTILITIES: "Água/Luz/Gás",
  RENT: "Aluguel",
  EQUIPMENT: "Equipamentos",
  MAINTENANCE: "Manutenção",
  MARKETING: "Marketing",
  SUPPLIES: "Materiais",
  OTHER: "Outros",
};

const sourceLabels: Record<string, string> = {
  SALES: "Vendas",
  DELIVERY: "Delivery",
  EVENTS: "Eventos",
  OTHER: "Outros",
};

export default function RelatoriosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [expensesByCategory, setExpensesByCategory] = useState<ExpenseByCategory[]>([]);
  const [revenuesBySource, setRevenuesBySource] = useState<RevenueBySource[]>([]);
  const [employeesReport, setEmployeesReport] = useState<EmployeeReport[]>([]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const [overviewRes, expensesRes, revenuesRes, employeesRes] = await Promise.all([
        fetch(`/api/reports?month=${selectedMonth}&type=overview`),
        fetch(`/api/reports?month=${selectedMonth}&type=expenses-by-category`),
        fetch(`/api/reports?month=${selectedMonth}&type=revenues-by-source`),
        fetch(`/api/reports?month=${selectedMonth}&type=employees`),
      ]);

      if (overviewRes.ok) setOverview(await overviewRes.json());
      if (expensesRes.ok) setExpensesByCategory(await expensesRes.json());
      if (revenuesRes.ok) setRevenuesBySource(await revenuesRes.json());
      if (employeesRes.ok) setEmployeesReport(await employeesRes.json());
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedMonth]);

  const formatCurrency = (value: number) =>
    `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Análise financeira detalhada
          </p>
        </div>
        <Input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-40"
        />
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Receitas</span>
              </div>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(overview.revenue.total)}
              </p>
              <p className="text-xs text-muted-foreground">
                {overview.revenue.count} lançamentos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm text-muted-foreground">Despesas</span>
              </div>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(overview.expenses.total)}
              </p>
              <p className="text-xs text-muted-foreground">
                {overview.expenses.count} lançamentos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">Folha</span>
              </div>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(overview.payroll.total)}
              </p>
              <p className="text-xs text-muted-foreground">
                {overview.employees} funcionários
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-muted-foreground">Adiantamentos</span>
              </div>
              <p className="text-xl font-bold text-amber-600">
                {formatCurrency(overview.advances.total)}
              </p>
              <p className="text-xs text-muted-foreground">
                {overview.advances.count} pagos
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign
                  className={`h-4 w-4 ${overview.profit >= 0 ? "text-green-600" : "text-red-600"}`}
                />
                <span className="text-sm text-muted-foreground">Resultado</span>
              </div>
              <p
                className={`text-2xl font-bold ${overview.profit >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(overview.profit)}
              </p>
              <p className="text-xs text-muted-foreground">
                {overview.profit >= 0 ? "Lucro" : "Prejuízo"} no período
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Reports */}
      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Por Categoria</TabsTrigger>
          <TabsTrigger value="sources">Por Fonte</TabsTrigger>
          <TabsTrigger value="employees">Por Funcionário</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Despesas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expensesByCategory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma despesa no período
                </p>
              ) : (
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Categoria</TableHead>
                      <TableHead className="w-[20%] text-center">Lançamentos</TableHead>
                      <TableHead className="w-[25%] text-right">Total</TableHead>
                      <TableHead className="w-[15%] text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expensesByCategory.map((item) => {
                      const total = expensesByCategory.reduce(
                        (sum, i) => sum + Number(i._sum.amount),
                        0
                      );
                      const percentage = ((Number(item._sum.amount) / total) * 100).toFixed(1);
                      return (
                        <TableRow key={item.category}>
                          <TableCell>
                            <Badge variant="outline">
                              {categoryLabels[item.category] || item.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">{item._count}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(Number(item._sum.amount))}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {percentage}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Receitas por Fonte
              </CardTitle>
            </CardHeader>
            <CardContent>
              {revenuesBySource.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma receita no período
                </p>
              ) : (
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Fonte</TableHead>
                      <TableHead className="w-[20%] text-center">Lançamentos</TableHead>
                      <TableHead className="w-[25%] text-right">Total</TableHead>
                      <TableHead className="w-[15%] text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenuesBySource.map((item) => {
                      const total = revenuesBySource.reduce(
                        (sum, i) => sum + Number(i._sum.amount),
                        0
                      );
                      const percentage = ((Number(item._sum.amount) / total) * 100).toFixed(1);
                      return (
                        <TableRow key={item.source}>
                          <TableCell>
                            <Badge variant="secondary">
                              {sourceLabels[item.source] || item.source}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">{item._count}</TableCell>
                          <TableCell className="text-right font-semibold text-green-600">
                            {formatCurrency(Number(item._sum.amount))}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {percentage}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Relatório por Funcionário
              </CardTitle>
            </CardHeader>
            <CardContent>
              {employeesReport.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum funcionário ativo
                </p>
              ) : (
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[20%]">Funcionário</TableHead>
                      <TableHead className="w-[18%]">Cargo</TableHead>
                      <TableHead className="w-[15%] text-right">Salário Base</TableHead>
                      <TableHead className="w-[15%] text-right">Adiantamentos</TableHead>
                      <TableHead className="w-[15%] text-right">Líquido</TableHead>
                      <TableHead className="w-[17%] text-center">Status Pagamento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeesReport.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell>{emp.role}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(emp.salary)}
                        </TableCell>
                        <TableCell className="text-right">
                          {emp.advances > 0 ? (
                            <span className="text-red-600">
                              {formatCurrency(emp.advances)} ({emp.advancesCount})
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {emp.payroll
                            ? formatCurrency(emp.payroll.netSalary)
                            : formatCurrency(emp.salary)}
                        </TableCell>
                        <TableCell>
                          {emp.payroll ? (
                            <Badge variant={emp.payroll.paid ? "default" : "outline"}>
                              {emp.payroll.paid ? "Pago" : "Pendente"}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Sem folha</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


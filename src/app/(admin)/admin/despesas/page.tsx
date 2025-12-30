"use client";

import { useState, useEffect } from "react";
import { AdminOnly } from "@/components/admin/AdminOnly";
import { getLocalDateString } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Loader2, Receipt, DollarSign, TrendingUp, TrendingDown, BarChart3, ShoppingCart, Zap, Home, Wrench, Calendar, CalendarDays, ArrowUpRight, ArrowDownRight, Search, X, Filter } from "lucide-react";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  notes: string | null;
}

const categories = [
  { value: "INGREDIENTS", label: "Ingredientes" },
  { value: "UTILITIES", label: "Água, Luz, Gás" },
  { value: "RENT", label: "Aluguel" },
  { value: "EQUIPMENT", label: "Equipamentos" },
  { value: "MAINTENANCE", label: "Manutenção" },
  { value: "MARKETING", label: "Marketing" },
  { value: "SUPPLIES", label: "Materiais" },
  { value: "OTHER", label: "Outros" },
];

export default function DespesasPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    description: "",
    amount: "",
    date: getLocalDateString(),
    notes: "",
  });

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/expenses?month=${selectedMonth}`);
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedMonth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchExpenses();
        setIsDialogOpen(false);
        setFormData({
          category: "",
          description: "",
          amount: "",
          date: getLocalDateString(),
          notes: "",
        });
      }
    } catch (error) {
      console.error("Erro ao criar despesa:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta despesa?")) return;

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchExpenses();
      }
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
    }
  };

  // Lógica de filtros
  const filteredExpenses = expenses.filter((expense) => {
    // Filtro por busca
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por categoria
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;

    // Filtro por valor mínimo
    const matchesMinValue = !minValue || Number(expense.amount) >= parseFloat(minValue);

    // Filtro por valor máximo
    const matchesMaxValue = !maxValue || Number(expense.amount) <= parseFloat(maxValue);

    return matchesSearch && matchesCategory && matchesMinValue && matchesMaxValue;
  });

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setMinValue("");
    setMaxValue("");
  };

  const hasActiveFilters = searchTerm || categoryFilter !== "all" || minValue || maxValue;

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const getCategoryLabel = (value: string) =>
    categories.find((c) => c.value === value)?.label || value;

  // Métricas
  const expenseCount = expenses.length;
  const avgExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;
  
  // Métricas de período
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo
  startOfWeek.setHours(0, 0, 0, 0);
  
  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
  
  // Despesas desta semana
  const thisWeekExpenses = expenses.filter(e => {
    const expDate = new Date(e.date);
    return expDate >= startOfWeek;
  });
  const thisWeekTotal = thisWeekExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  
  // Despesas da semana passada (do mês selecionado)
  const lastWeekExpenses = expenses.filter(e => {
    const expDate = new Date(e.date);
    return expDate >= startOfLastWeek && expDate < startOfWeek;
  });
  const lastWeekTotal = lastWeekExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  
  // Variação semanal
  const weeklyChange = lastWeekTotal > 0 
    ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100 
    : 0;

  // Média diária do mês
  const daysInMonth = new Date(
    parseInt(selectedMonth.split("-")[0]),
    parseInt(selectedMonth.split("-")[1]),
    0
  ).getDate();
  const currentDay = today.getMonth() + 1 === parseInt(selectedMonth.split("-")[1]) 
    ? today.getDate() 
    : daysInMonth;
  const dailyAvg = currentDay > 0 ? totalExpenses / currentDay : 0;
  
  // Projeção do mês
  const monthProjection = dailyAvg * daysInMonth;

  // Maior despesa
  const maxExpense = expenses.length > 0 
    ? expenses.reduce((max, e) => Number(e.amount) > Number(max.amount) ? e : max, expenses[0])
    : null;
  
  // Despesas por categoria
  const expensesByCategory = categories.map(cat => {
    const catExpenses = expenses.filter(e => e.category === cat.value);
    const total = catExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    return {
      ...cat,
      count: catExpenses.length,
      total,
      percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
    };
  }).filter(cat => cat.count > 0).sort((a, b) => b.total - a.total);

  // Top 3 categorias
  const topCategories = expensesByCategory.slice(0, 3);

  // Ícone por categoria
  const getCategoryIcon = (value: string) => {
    switch (value) {
      case "INGREDIENTS": return <ShoppingCart className="h-3.5 w-3.5" />;
      case "UTILITIES": return <Zap className="h-3.5 w-3.5" />;
      case "RENT": return <Home className="h-3.5 w-3.5" />;
      case "MAINTENANCE": return <Wrench className="h-3.5 w-3.5" />;
      default: return <Receipt className="h-3.5 w-3.5" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <AdminOnly>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Despesas</h1>
          <p className="text-muted-foreground">
            Controle de despesas da pizzaria
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-40"
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Despesa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Despesa</DialogTitle>
                <DialogDescription>
                  Registre uma nova despesa
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Input
                    id="description"
                    placeholder="Ex: Compra de queijo mussarela"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Data *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Input
                    id="notes"
                    placeholder="Observações adicionais"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !formData.category}>
                    {isSubmitting && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Registrar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total do Mês */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Total do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-red-600 mt-1">
              {selectedMonth.split("-").reverse().join("/")}
            </p>
          </CardContent>
        </Card>

        {/* Quantidade e Média */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quantidade</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenseCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Média: {formatCurrency(avgExpense)}
            </p>
          </CardContent>
        </Card>

        {/* Maior Despesa */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Maior Despesa</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {maxExpense ? formatCurrency(Number(maxExpense.amount)) : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {maxExpense ? getCategoryLabel(maxExpense.category) : "Nenhuma despesa"}
            </p>
          </CardContent>
        </Card>

        {/* Top Categorias */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Categorias</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {topCategories.length > 0 ? topCategories.map((cat, idx) => (
                <div key={cat.value} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    {getCategoryIcon(cat.value)}
                    <span className="truncate max-w-[80px]">{cat.label}</span>
                  </span>
                  <span className="font-medium">{cat.percentage.toFixed(0)}%</span>
                </div>
              )) : (
                <p className="text-xs text-muted-foreground">Nenhuma despesa</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Período */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Esta Semana */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(thisWeekTotal)}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {weeklyChange !== 0 && (
                <>
                  {weeklyChange > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-red-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-green-500" />
                  )}
                  <span className={weeklyChange > 0 ? "text-red-600" : "text-green-600"}>
                    {Math.abs(weeklyChange).toFixed(0)}% vs semana anterior
                  </span>
                </>
              )}
              {weeklyChange === 0 && lastWeekTotal === 0 && (
                <span className="text-muted-foreground">Sem dados anteriores</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Semana Passada */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Semana Passada</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{formatCurrency(lastWeekTotal)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lastWeekExpenses.length} despesas
            </p>
          </CardContent>
        </Card>

        {/* Média Diária */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Média Diária</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(dailyAvg)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Baseado em {currentDay} dias
            </p>
          </CardContent>
        </Card>

        {/* Projeção do Mês */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projeção Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(monthProjection)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimativa para {daysInMonth} dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento por Categoria */}
      {expensesByCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expensesByCategory.map((cat) => (
                <div key={cat.value} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      {getCategoryIcon(cat.value)}
                      <span className="font-medium">{cat.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {cat.count} {cat.count === 1 ? 'item' : 'itens'}
                      </Badge>
                    </span>
                    <span className="font-semibold">{formatCurrency(cat.total)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full transition-all"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle>Lista de Despesas</CardTitle>

            {/* Filtros */}
            {expenses.length > 0 && (
              <div className="flex flex-wrap gap-3 items-center">
                {/* Busca */}
                <div className="relative flex-1 min-w-[180px] max-w-[250px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9"
                  />
                </div>

                {/* Categoria */}
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Faixa de valor */}
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                    className="w-[80px] h-9"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                    className="w-[80px] h-9"
                  />
                </div>

                {/* Limpar */}
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 h-9">
                    <X className="h-4 w-4" />
                    Limpar
                  </Button>
                )}

                {/* Contador */}
                {hasActiveFilters && (
                  <span className="text-sm text-muted-foreground">
                    {filteredExpenses.length} de {expenses.length}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {expenses.length === 0 
                ? "Nenhuma despesa registrada neste mês" 
                : "Nenhuma despesa encontrada com os filtros atuais"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[12%]">Data</TableHead>
                    <TableHead className="w-[18%]">Categoria</TableHead>
                    <TableHead className="w-[35%]">Descrição</TableHead>
                    <TableHead className="w-[15%] text-right">Valor</TableHead>
                    <TableHead className="w-[20%] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getCategoryLabel(expense.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell className="font-semibold text-red-600">
                        R$ {Number(expense.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(expense.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </AdminOnly>
  );
}


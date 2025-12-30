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
import { Plus, Check, X, Loader2, Wallet, Clock, DollarSign, Users, TrendingUp, AlertCircle, CheckCircle2, XCircle, Ban, Calendar, CalendarDays, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
}

interface Advance {
  id: string;
  employeeId: string;
  employee: Employee;
  amount: number;
  requestDate: string;
  paymentDate: string | null;
  status: "PENDING" | "APPROVED" | "PAID" | "REJECTED" | "DISCOUNTED";
  notes: string | null;
}

const statusConfig: Record<string, { label: string; variant: "outline" | "secondary" | "default" | "destructive"; color: string }> = {
  PENDING: { label: "Pendente", variant: "outline", color: "text-amber-600" },
  APPROVED: { label: "Aprovado", variant: "secondary", color: "text-blue-600" },
  PAID: { label: "Pago", variant: "default", color: "text-green-600" },
  DISCOUNTED: { label: "Descontado", variant: "outline", color: "text-purple-600" },
  REJECTED: { label: "Rejeitado", variant: "destructive", color: "text-red-600" },
};

export default function AdiantamentosPage() {
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formData, setFormData] = useState({
    employeeId: "",
    amount: "",
    requestDate: getLocalDateString(),
    notes: "",
  });

  const fetchData = async () => {
    try {
      const [advancesRes, employeesRes] = await Promise.all([
        fetch("/api/advances"),
        fetch("/api/employees"),
      ]);

      if (advancesRes.ok) {
        const data = await advancesRes.json();
        setAdvances(data);
      }

      if (employeesRes.ok) {
        const data = await employeesRes.json();
        setEmployees(data.filter((e: Employee & { active?: boolean }) => e.active !== false));
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/advances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchData();
        setIsDialogOpen(false);
        setFormData({ employeeId: "", amount: "", requestDate: getLocalDateString(), notes: "" });
      }
    } catch (error) {
      console.error("Erro ao criar adiantamento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/advances/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const filteredAdvances = advances.filter(
    (a) => statusFilter === "all" || a.status === statusFilter
  );

  const stats = {
    pending: advances.filter((a) => a.status === "PENDING").length,
    pendingAmount: advances
      .filter((a) => a.status === "PENDING")
      .reduce((sum, a) => sum + Number(a.amount), 0),
    approved: advances.filter((a) => a.status === "APPROVED").length,
    approvedAmount: advances
      .filter((a) => a.status === "APPROVED")
      .reduce((sum, a) => sum + Number(a.amount), 0),
    paid: advances.filter((a) => a.status === "PAID").length,
    paidAmount: advances
      .filter((a) => a.status === "PAID")
      .reduce((sum, a) => sum + Number(a.amount), 0),
    discounted: advances.filter((a) => a.status === "DISCOUNTED").length,
    discountedAmount: advances
      .filter((a) => a.status === "DISCOUNTED")
      .reduce((sum, a) => sum + Number(a.amount), 0),
    rejected: advances.filter((a) => a.status === "REJECTED").length,
    rejectedAmount: advances
      .filter((a) => a.status === "REJECTED")
      .reduce((sum, a) => sum + Number(a.amount), 0),
    total: advances.length,
    totalAmount: advances.reduce((sum, a) => sum + Number(a.amount), 0),
  };

  // Média por adiantamento
  const avgAmount = stats.total > 0 ? stats.totalAmount / stats.total : 0;

  // Top funcionários com mais adiantamentos (pendentes + aprovados)
  const employeeAdvances = employees.map(emp => {
    const empAdvances = advances.filter(a => a.employeeId === emp.id && (a.status === "PENDING" || a.status === "APPROVED"));
    const total = empAdvances.reduce((sum, a) => sum + Number(a.amount), 0);
    return {
      ...emp,
      count: empAdvances.length,
      total,
    };
  }).filter(e => e.count > 0).sort((a, b) => b.total - a.total).slice(0, 5);

  // Total em aberto (pendente + aprovado)
  const totalOpen = stats.pendingAmount + stats.approvedAmount;

  // Métricas de período
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  // Adiantamentos desta semana
  const thisWeekAdvances = advances.filter(a => {
    const reqDate = new Date(a.requestDate);
    return reqDate >= startOfWeek;
  });
  const thisWeekTotal = thisWeekAdvances.reduce((sum, a) => sum + Number(a.amount), 0);

  // Adiantamentos da semana passada
  const lastWeekAdvances = advances.filter(a => {
    const reqDate = new Date(a.requestDate);
    return reqDate >= startOfLastWeek && reqDate < startOfWeek;
  });
  const lastWeekTotal = lastWeekAdvances.reduce((sum, a) => sum + Number(a.amount), 0);

  // Variação semanal
  const weeklyChange = lastWeekTotal > 0 
    ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100 
    : 0;

  // Adiantamentos deste mês
  const thisMonthAdvances = advances.filter(a => {
    const reqDate = new Date(a.requestDate);
    return reqDate >= startOfMonth;
  });
  const thisMonthTotal = thisMonthAdvances.reduce((sum, a) => sum + Number(a.amount), 0);

  // Adiantamentos do mês passado (para comparação)
  const lastMonthAdvances = advances.filter(a => {
    const reqDate = new Date(a.requestDate);
    return reqDate >= startOfLastMonth && reqDate <= endOfLastMonth;
  });
  const lastMonthTotal = lastMonthAdvances.reduce((sum, a) => sum + Number(a.amount), 0);

  // Variação mensal
  const monthlyChange = lastMonthTotal > 0 
    ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
    : 0;

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
          <h1 className="text-3xl font-bold">Adiantamentos</h1>
          <p className="text-muted-foreground">
            Controle de adiantamentos salariais
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Adiantamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Novo Adiantamento</DialogTitle>
              <DialogDescription>
                Registre um novo pedido de adiantamento
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Funcionário *</Label>
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, employeeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <Label htmlFor="requestDate">Data *</Label>
                  <Input
                    id="requestDate"
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) =>
                      setFormData({ ...formData, requestDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <textarea
                  id="notes"
                  placeholder="Motivo do adiantamento..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                <Button type="submit" disabled={isSubmitting || !formData.employeeId}>
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

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total em Aberto */}
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Em Aberto</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{formatCurrency(totalOpen)}</div>
            <div className="flex gap-2 text-xs text-amber-600 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {stats.pending} pendentes
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                {stats.approved} aprovados
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Pago (aguardando desconto) */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Pago (a descontar)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(stats.paidAmount)}</div>
            <p className="text-xs text-green-600 mt-1">
              {stats.paid} aguardando fechamento
            </p>
          </CardContent>
        </Card>

        {/* Resumo Geral */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resumo</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Média: {formatCurrency(avgAmount)}
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Por Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-amber-600">
                  <Clock className="h-3.5 w-3.5" />
                  Pendentes
                </span>
                <span className="font-semibold">{stats.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <Check className="h-3.5 w-3.5" />
                  Aprovados
                </span>
                <span className="font-semibold">{stats.approved}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-green-600">
                  <DollarSign className="h-3.5 w-3.5" />
                  Pagos
                </span>
                <span className="font-semibold">{stats.paid}</span>
              </div>
              {stats.discounted > 0 && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-purple-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Descontados
                  </span>
                  <span className="font-semibold">{stats.discounted}</span>
                </div>
              )}
              {stats.rejected > 0 && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-red-600">
                    <XCircle className="h-3.5 w-3.5" />
                    Rejeitados
                  </span>
                  <span className="font-semibold">{stats.rejected}</span>
                </div>
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
              <span className="text-muted-foreground">
                {thisWeekAdvances.length} solicitações
              </span>
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
            <div className="flex items-center gap-1 text-xs mt-1">
              {weeklyChange !== 0 && lastWeekTotal > 0 && (
                <>
                  {weeklyChange > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-red-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-green-500" />
                  )}
                  <span className={weeklyChange > 0 ? "text-red-600" : "text-green-600"}>
                    {Math.abs(weeklyChange).toFixed(0)}% variação
                  </span>
                </>
              )}
              {lastWeekTotal === 0 && (
                <span className="text-muted-foreground">{lastWeekAdvances.length} solicitações</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Este Mês */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(thisMonthTotal)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {thisMonthAdvances.length} solicitações
            </p>
          </CardContent>
        </Card>

        {/* Comparação Mensal */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mês Anterior</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(lastMonthTotal)}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {monthlyChange !== 0 && lastMonthTotal > 0 && (
                <>
                  {monthlyChange > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-red-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-green-500" />
                  )}
                  <span className={monthlyChange > 0 ? "text-red-600" : "text-green-600"}>
                    {Math.abs(monthlyChange).toFixed(0)}% vs atual
                  </span>
                </>
              )}
              {lastMonthTotal === 0 && (
                <span className="text-muted-foreground">{lastMonthAdvances.length} solicitações</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funcionários com Adiantamentos em Aberto */}
      {employeeAdvances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Funcionários com Adiantamentos em Aberto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employeeAdvances.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-medium text-sm">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {emp.count} {emp.count === 1 ? 'adiantamento' : 'adiantamentos'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-amber-700">{formatCurrency(emp.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Adiantamentos</CardTitle>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="PENDING">Pendentes</SelectItem>
              <SelectItem value="APPROVED">Aprovados</SelectItem>
              <SelectItem value="PAID">Pagos</SelectItem>
              <SelectItem value="DISCOUNTED">Descontados</SelectItem>
              <SelectItem value="REJECTED">Rejeitados</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredAdvances.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum adiantamento encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%]">Funcionário</TableHead>
                    <TableHead className="w-[12%] text-right">Valor</TableHead>
                    <TableHead className="w-[15%]">Data Solicitação</TableHead>
                    <TableHead className="w-[12%] text-center">Status</TableHead>
                    <TableHead className="w-[26%]">Observações</TableHead>
                    <TableHead className="w-[15%] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdvances.map((advance) => (
                    <TableRow key={advance.id}>
                      <TableCell className="font-medium">
                        {advance.employee.name}
                        <div className="text-xs text-muted-foreground">
                          {advance.employee.role}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        R$ {Number(advance.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        {new Date(advance.requestDate).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[advance.status].variant}>
                          {statusConfig[advance.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {advance.notes || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {advance.status === "PENDING" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600"
                              onClick={() => handleUpdateStatus(advance.id, "APPROVED")}
                              title="Aprovar"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600"
                              onClick={() => handleUpdateStatus(advance.id, "REJECTED")}
                              title="Rejeitar"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {advance.status === "APPROVED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(advance.id, "PAID")}
                          >
                            Marcar Pago
                          </Button>
                        )}
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


"use client";

import { useState, useEffect } from "react";
import { AdminOnly } from "@/components/admin/AdminOnly";
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
import { Plus, Pencil, Trash2, Loader2, Users, Sun, Moon, Clock, DollarSign, UserCheck, UserX, Search, X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  salary: number;
  phone: string | null;
  document: string | null;
  hireDate: string;
  active: boolean;
  worksLunch: boolean;
  lunchPaymentType: string;
  lunchValue: number;
  lunchStartTime: string | null;
  lunchEndTime: string | null;
  worksDinner: boolean;
  dinnerPaymentType: string;
  dinnerWeekdayValue: number;
  dinnerWeekendValue: number;
  dinnerStartTime: string | null;
  dinnerEndTime: string | null;
}

export default function FuncionariosPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [shiftFilter, setShiftFilter] = useState<"all" | "lunch" | "dinner" | "both">("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    phone: "",
    document: "",
    // Almoço
    worksLunch: false,
    lunchPaymentType: "SHIFT", // HOUR, SHIFT, DAY
    lunchValue: "50",
    lunchStartTime: "11:00",
    lunchEndTime: "17:00",
    // Jantar
    worksDinner: true,
    dinnerPaymentType: "SHIFT", // HOUR, SHIFT, DAY
    dinnerWeekdayValue: "60",
    dinnerWeekendValue: "80",
    dinnerStartTime: "17:00",
    dinnerEndTime: "00:00",
  });

  // Função para calcular horas entre dois horários (suporta meia-noite)
  const calculateHoursDisplay = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;
    
    // Se o horário de saída for menor/igual que entrada, cruzou meia-noite
    // Ex: 17:00 → 00:00 ou 18:00 → 00:00
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60; // Adiciona 24 horas
    }
    
    return Math.round((endMinutes - startMinutes) / 60 * 10) / 10;
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      phone: "",
      document: "",
      worksLunch: false,
      lunchPaymentType: "SHIFT",
      lunchValue: "50",
      lunchStartTime: "11:00",
      lunchEndTime: "17:00",
      worksDinner: true,
      dinnerPaymentType: "SHIFT",
      dinnerWeekdayValue: "60",
      dinnerWeekendValue: "80",
      dinnerStartTime: "17:00",
      dinnerEndTime: "00:00",
    });
    setEditingEmployee(null);
  };

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        role: employee.role,
        phone: employee.phone || "",
        document: employee.document || "",
        worksLunch: employee.worksLunch || false,
        lunchPaymentType: employee.lunchPaymentType || "SHIFT",
        lunchValue: String(employee.lunchValue || "50"),
        lunchStartTime: employee.lunchStartTime || "11:00",
        lunchEndTime: employee.lunchEndTime || "17:00",
        worksDinner: employee.worksDinner || false,
        dinnerPaymentType: employee.dinnerPaymentType || "SHIFT",
        dinnerWeekdayValue: String(employee.dinnerWeekdayValue || "60"),
        dinnerWeekendValue: String(employee.dinnerWeekendValue || "80"),
        dinnerStartTime: employee.dinnerStartTime || "17:00",
        dinnerEndTime: employee.dinnerEndTime || "00:00",
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingEmployee
        ? `/api/employees/${editingEmployee.id}`
        : "/api/employees";
      const method = editingEmployee ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          lunchValue: parseFloat(formData.lunchValue) || 0,
          dinnerWeekdayValue: parseFloat(formData.dinnerWeekdayValue) || 0,
          dinnerWeekendValue: parseFloat(formData.dinnerWeekendValue) || 0,
        }),
      });

      if (response.ok) {
        fetchEmployees();
        setIsDialogOpen(false);
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao salvar");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (employee: Employee) => {
    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !employee.active }),
      });

      if (response.ok) {
        fetchEmployees();
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este funcionário?")) return;

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchEmployees();
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Lógica de filtros
  const filteredEmployees = employees.filter((emp) => {
    // Filtro por busca
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por status
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && emp.active) ||
      (statusFilter === "inactive" && !emp.active);

    // Filtro por turno
    const matchesShift =
      shiftFilter === "all" ||
      (shiftFilter === "lunch" && emp.worksLunch && !emp.worksDinner) ||
      (shiftFilter === "dinner" && !emp.worksLunch && emp.worksDinner) ||
      (shiftFilter === "both" && emp.worksLunch && emp.worksDinner);

    // Filtro por função
    const matchesRole = roleFilter === "all" || emp.role === roleFilter;

    return matchesSearch && matchesStatus && matchesShift && matchesRole;
  });

  // Lista de funções únicas para o filtro
  const uniqueRoles = [...new Set(employees.map((e) => e.role).filter(Boolean))];

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setShiftFilter("all");
    setRoleFilter("all");
  };

  const hasActiveFilters = searchTerm || statusFilter !== "all" || shiftFilter !== "all" || roleFilter !== "all";

  // Métricas
  const activeEmployees = employees.filter(e => e.active);
  const inactiveEmployees = employees.filter(e => !e.active);
  
  const lunchOnlyEmployees = activeEmployees.filter(e => e.worksLunch && !e.worksDinner);
  const dinnerOnlyEmployees = activeEmployees.filter(e => !e.worksLunch && e.worksDinner);
  const bothShiftsEmployees = activeEmployees.filter(e => e.worksLunch && e.worksDinner);
  
  // Cálculo de custo diário estimado (média semana/fim de semana)
  const calculateDailyLunchCost = () => {
    return activeEmployees
      .filter(e => e.worksLunch)
      .reduce((sum, e) => {
        const value = Number(e.lunchValue) || 0;
        // Para pagamento por hora, estima 6 horas de trabalho
        if (e.lunchPaymentType === "HOUR") return sum + (value * 6);
        // Para pagamento semanal, divide por 6 dias
        if (e.lunchPaymentType === "WEEK") return sum + (value / 6);
        // Para pagamento mensal, divide por 26 dias
        if (e.lunchPaymentType === "MONTH") return sum + (value / 26);
        return sum + value;
      }, 0);
  };
  
  const calculateDailyDinnerCost = (isWeekend: boolean) => {
    return activeEmployees
      .filter(e => e.worksDinner)
      .reduce((sum, e) => {
        const value = isWeekend 
          ? (Number(e.dinnerWeekendValue) || 0)
          : (Number(e.dinnerWeekdayValue) || 0);
        // Para pagamento por hora, estima 7 horas de trabalho
        if (e.dinnerPaymentType === "HOUR") return sum + (value * 7);
        // Para pagamento semanal, divide por 6 dias
        if (e.dinnerPaymentType === "WEEK") return sum + (value / 6);
        // Para pagamento mensal, divide por 26 dias
        if (e.dinnerPaymentType === "MONTH") return sum + (value / 26);
        return sum + value;
      }, 0);
  };
  
  const dailyLunchCost = calculateDailyLunchCost();
  const dailyDinnerWeekdayCost = calculateDailyDinnerCost(false);
  const dailyDinnerWeekendCost = calculateDailyDinnerCost(true);
  const avgDailyDinnerCost = (dailyDinnerWeekdayCost * 5 + dailyDinnerWeekendCost * 2) / 7;
  const totalDailyCost = dailyLunchCost + avgDailyDinnerCost;
  const estimatedMonthlyCost = totalDailyCost * 26;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminOnly>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie os funcionários e seus valores por turno
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? "Editar Funcionário" : "Novo Funcionário"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados e configure os valores por turno
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados básicos */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Dados Básicos
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Função</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Ex: Garçom, Cozinheiro"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(13) 99999-9999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="document">CPF</Label>
                    <Input
                      id="document"
                      value={formData.document}
                      onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
              </div>

              {/* Turno Almoço */}
              <div className="space-y-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-amber-500" />
                    <h3 className="font-semibold">Turno Almoço</h3>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.worksLunch}
                      onChange={(e) => setFormData({ ...formData, worksLunch: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Trabalha neste turno</span>
                  </label>
                </div>
                
                {formData.worksLunch && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Tipo de Pagamento do Almoço</Label>
                      <Select
                        value={formData.lunchPaymentType}
                        onValueChange={(value) => setFormData({ ...formData, lunchPaymentType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HOUR">Por Hora</SelectItem>
                          <SelectItem value="SHIFT">Por Turno</SelectItem>
                          <SelectItem value="DAY">Por Dia</SelectItem>
                          <SelectItem value="WEEK">Por Semana</SelectItem>
                          <SelectItem value="MONTH">Por Mês (Fixo)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        💰 {formData.lunchPaymentType === "HOUR" ? "Taxa Horária (R$/hora)" : 
                           formData.lunchPaymentType === "DAY" ? "Valor por Dia (R$)" : 
                           formData.lunchPaymentType === "WEEK" ? "Valor por Semana (R$)" : 
                           formData.lunchPaymentType === "MONTH" ? "Salário Mensal (R$)" :
                           "Valor por Turno (R$)"}
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.lunchValue}
                        onChange={(e) => setFormData({ ...formData, lunchValue: e.target.value })}
                        placeholder={formData.lunchPaymentType === "HOUR" ? "Ex: 15.00" : "Ex: 50.00"}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>⏰ Entrada</Label>
                        <Input
                          type="time"
                          value={formData.lunchStartTime}
                          onChange={(e) => setFormData({ ...formData, lunchStartTime: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>⏰ Saída</Label>
                        <Input
                          type="time"
                          value={formData.lunchEndTime}
                          onChange={(e) => setFormData({ ...formData, lunchEndTime: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    {formData.lunchPaymentType === "HOUR" && formData.lunchStartTime && formData.lunchEndTime && (
                      <p className="text-xs text-muted-foreground bg-amber-100 dark:bg-amber-900/30 p-2 rounded">
                        📊 {calculateHoursDisplay(formData.lunchStartTime, formData.lunchEndTime)}h × R$ {formData.lunchValue || "0"} = <strong>R$ {(calculateHoursDisplay(formData.lunchStartTime, formData.lunchEndTime) * parseFloat(formData.lunchValue || "0")).toFixed(2)}</strong>/dia
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Turno Jantar */}
              <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold">Turno Jantar</h3>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.worksDinner}
                      onChange={(e) => setFormData({ ...formData, worksDinner: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Trabalha neste turno</span>
                  </label>
                </div>
                
                {formData.worksDinner && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Tipo de Pagamento do Jantar</Label>
                      <Select
                        value={formData.dinnerPaymentType}
                        onValueChange={(value) => setFormData({ ...formData, dinnerPaymentType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HOUR">Por Hora</SelectItem>
                          <SelectItem value="SHIFT">Por Turno</SelectItem>
                          <SelectItem value="DAY">Por Dia</SelectItem>
                          <SelectItem value="WEEK">Por Semana</SelectItem>
                          <SelectItem value="MONTH">Por Mês (Fixo)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          💰 {formData.dinnerPaymentType === "HOUR" ? "Taxa/h" : 
                             formData.dinnerPaymentType === "DAY" ? "Dia" : 
                             formData.dinnerPaymentType === "WEEK" ? "Semana" : 
                             formData.dinnerPaymentType === "MONTH" ? "Mês" :
                             "Turno"} {formData.dinnerPaymentType === "MONTH" ? "" : "Seg-Sex"}
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.dinnerWeekdayValue}
                          onChange={(e) => setFormData({ ...formData, dinnerWeekdayValue: e.target.value })}
                          placeholder={formData.dinnerPaymentType === "HOUR" ? "Ex: 12.00" : "Ex: 60.00"}
                        />
                      </div>
                      {formData.dinnerPaymentType !== "MONTH" && (
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          💰 {formData.dinnerPaymentType === "HOUR" ? "Taxa/h" : 
                             formData.dinnerPaymentType === "DAY" ? "Dia" : 
                             formData.dinnerPaymentType === "WEEK" ? "Semana" : 
                             "Turno"} Sáb-Dom
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.dinnerWeekendValue}
                          onChange={(e) => setFormData({ ...formData, dinnerWeekendValue: e.target.value })}
                          placeholder={formData.dinnerPaymentType === "HOUR" ? "Ex: 18.00" : "Ex: 80.00"}
                        />
                      </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>⏰ Entrada</Label>
                        <Input
                          type="time"
                          value={formData.dinnerStartTime}
                          onChange={(e) => setFormData({ ...formData, dinnerStartTime: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>⏰ Saída</Label>
                        <Input
                          type="time"
                          value={formData.dinnerEndTime}
                          onChange={(e) => setFormData({ ...formData, dinnerEndTime: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    {formData.dinnerPaymentType === "HOUR" && formData.dinnerStartTime && formData.dinnerEndTime && (
                      <div className="text-xs bg-blue-100 dark:bg-blue-900/30 p-2 rounded space-y-1">
                        <p>
                          📊 Seg-Sex: {calculateHoursDisplay(formData.dinnerStartTime, formData.dinnerEndTime)}h × R$ {formData.dinnerWeekdayValue || "0"} = <strong>R$ {(calculateHoursDisplay(formData.dinnerStartTime, formData.dinnerEndTime) * parseFloat(formData.dinnerWeekdayValue || "0")).toFixed(2)}</strong>
                        </p>
                        <p>
                          📊 Sáb-Dom: {calculateHoursDisplay(formData.dinnerStartTime, formData.dinnerEndTime)}h × R$ {formData.dinnerWeekendValue || "0"} = <strong>R$ {(calculateHoursDisplay(formData.dinnerStartTime, formData.dinnerEndTime) * parseFloat(formData.dinnerWeekendValue || "0")).toFixed(2)}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingEmployee ? "Salvar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats - Funcionários */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <UserCheck className="h-3 w-3 text-green-500" />
                {activeEmployees.length} ativos
              </span>
              <span className="flex items-center gap-1">
                <UserX className="h-3 w-3 text-red-500" />
                {inactiveEmployees.length} inativos
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Por Turno</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-amber-600">
                  <Sun className="h-3.5 w-3.5" />
                  Só Almoço
                </span>
                <span className="font-semibold">{lunchOnlyEmployees.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <Moon className="h-3.5 w-3.5" />
                  Só Jantar
                </span>
                <span className="font-semibold">{dinnerOnlyEmployees.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-purple-600">
                  <Users className="h-3.5 w-3.5" />
                  Ambos
                </span>
                <span className="font-semibold">{bothShiftsEmployees.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Custo Diário</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDailyCost)}</div>
            <div className="space-y-0.5 text-xs text-muted-foreground mt-1">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Sun className="h-3 w-3 text-amber-500" />
                  Almoço
                </span>
                <span>{formatCurrency(dailyLunchCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Moon className="h-3 w-3 text-blue-500" />
                  Jantar (média)
                </span>
                <span>{formatCurrency(avgDailyDinnerCost)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Custo Mensal Est.</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(estimatedMonthlyCost)}
            </div>
            <div className="space-y-0.5 text-xs text-muted-foreground mt-1">
              <div className="flex justify-between">
                <span>Dia útil (jantar)</span>
                <span>{formatCurrency(dailyLunchCost + dailyDinnerWeekdayCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fim de semana (jantar)</span>
                <span>{formatCurrency(dailyLunchCost + dailyDinnerWeekendCost)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3 items-center">
              {/* Busca */}
              <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou função..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status */}
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>

              {/* Turno */}
              <Select value={shiftFilter} onValueChange={(v) => setShiftFilter(v as typeof shiftFilter)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Turnos</SelectItem>
                  <SelectItem value="lunch">Só Almoço</SelectItem>
                  <SelectItem value="dinner">Só Jantar</SelectItem>
                  <SelectItem value="both">Ambos</SelectItem>
                </SelectContent>
              </Select>

              {/* Função */}
              {uniqueRoles.length > 0 && (
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Funções</SelectItem>
                    {uniqueRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Limpar filtros */}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                  <X className="h-4 w-4" />
                  Limpar
                </Button>
              )}
            </div>

            {/* Contador de resultados */}
            {hasActiveFilters && (
              <p className="text-sm text-muted-foreground">
                Exibindo {filteredEmployees.length} de {employees.length} funcionários
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredEmployees.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {employees.length === 0 ? "Nenhum funcionário cadastrado" : "Nenhum funcionário encontrado com os filtros atuais"}
            </p>
          ) : (
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">Nome</TableHead>
                  <TableHead className="w-[10%] text-center">Turnos</TableHead>
                  <TableHead className="w-[25%] text-right">Valores</TableHead>
                  <TableHead className="w-[18%] text-center">Horários</TableHead>
                  <TableHead className="w-[10%]">Status</TableHead>
                  <TableHead className="w-[12%] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className={!employee.active ? "opacity-50" : ""}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{employee.name}</span>
                        {employee.role && (
                          <p className="text-xs text-muted-foreground">{employee.role}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        {employee.worksLunch && (
                          <Sun className="h-4 w-4 text-amber-500" />
                        )}
                        {employee.worksDinner && (
                          <Moon className="h-4 w-4 text-blue-500" />
                        )}
                        {!employee.worksLunch && !employee.worksDinner && (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs whitespace-nowrap">
                      <div className="space-y-1">
                        {employee.worksLunch && (
                          <div className="flex items-center justify-end gap-1 text-amber-600">
                            <Sun className="h-3 w-3 shrink-0" />
                            <span className="font-medium">{formatCurrency(Number(employee.lunchValue))}</span>
                            <span className="text-muted-foreground text-[10px]">
                              {employee.lunchPaymentType === "HOUR" ? "/h" : 
                                employee.lunchPaymentType === "DAY" ? "/dia" : 
                                employee.lunchPaymentType === "WEEK" ? "/sem" : 
                                employee.lunchPaymentType === "MONTH" ? "/mês" :
                                "/turno"}
                            </span>
                          </div>
                        )}
                        {employee.worksDinner && (
                          <div className="flex items-center justify-end gap-1 text-blue-600">
                            <Moon className="h-3 w-3 shrink-0" />
                            <span className="font-medium">
                              {employee.dinnerPaymentType === "MONTH" 
                                ? formatCurrency(Number(employee.dinnerWeekdayValue))
                                : `${formatCurrency(Number(employee.dinnerWeekdayValue))}/${formatCurrency(Number(employee.dinnerWeekendValue))}`
                              }
                            </span>
                            <span className="text-muted-foreground text-[10px]">
                              {employee.dinnerPaymentType === "HOUR" ? "/h" : 
                                employee.dinnerPaymentType === "DAY" ? "/dia" : 
                                employee.dinnerPaymentType === "WEEK" ? "/sem" : 
                                employee.dinnerPaymentType === "MONTH" ? "/mês" :
                                "/turno"}
                            </span>
                          </div>
                        )}
                        {!employee.worksLunch && !employee.worksDinner && (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-xs whitespace-nowrap">
                      <div className="space-y-1">
                        {employee.worksLunch && employee.lunchStartTime && (
                          <div className="flex items-center justify-center gap-1 text-amber-600">
                            <Sun className="h-3 w-3 shrink-0" />
                            <span>{employee.lunchStartTime}-{employee.lunchEndTime}</span>
                          </div>
                        )}
                        {employee.worksDinner && employee.dinnerStartTime && (
                          <div className="flex items-center justify-center gap-1 text-blue-600">
                            <Moon className="h-3 w-3 shrink-0" />
                            <span>{employee.dinnerStartTime}-{employee.dinnerEndTime}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={employee.active ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => handleToggleActive(employee)}
                      >
                        {employee.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(employee)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(employee.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
    </AdminOnly>
  );
}

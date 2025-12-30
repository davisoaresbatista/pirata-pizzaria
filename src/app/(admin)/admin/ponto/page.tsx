"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getLocalDateString } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { 
  Plus, Pencil, Trash2, Loader2, Sun, Moon, Clock, 
  LogIn, LogOut, AlertCircle, CheckCircle2, Search, X, Filter
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  worksLunch: boolean;
  worksDinner: boolean;
}

interface TimeEntry {
  id: string;
  employeeId: string;
  employee: Employee;
  date: string;
  workedLunch: boolean;
  workedDinner: boolean;
  clockInLunch: string | null;
  clockOutLunch: string | null;
  clockInDinner: string | null;
  clockOutDinner: string | null;
  status: string;
  notes: string | null;
  lunchValue: number;
  dinnerValue: number;
  totalValue: number;
}

// Verifica se pode editar baseado no papel e data
function canEdit(role: string, entryDate: string): boolean {
  if (role === "ADMIN") return true;
  
  const entry = new Date(entryDate);
  const today = new Date();
  entry.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - entry.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= 2;
}

export default function PontoPage() {
  const { data: session } = useSession();
  const userRole = (session?.user?.role as string) || "MANAGER";
  const isAdmin = userRole === "ADMIN";

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [errorMessage, setErrorMessage] = useState("");

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [shiftFilter, setShiftFilter] = useState<"all" | "lunch" | "dinner">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "complete" | "pending">("all");

  const [formData, setFormData] = useState({
    employeeId: "",
    date: getLocalDateString(),
    workedLunch: false,
    workedDinner: false,
    clockInLunch: "",
    clockOutLunch: "",
    clockInDinner: "",
    clockOutDinner: "",
    status: "PRESENT",
    notes: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const [entriesRes, employeesRes] = await Promise.all([
        fetch(`/api/time-entries?date=${selectedDate}`),
        fetch("/api/employees"),
      ]);

      if (entriesRes.ok) {
        const data = await entriesRes.json();
        setTimeEntries(data);
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
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const url = editingEntry
        ? `/api/time-entries/${editingEntry.id}`
        : "/api/time-entries";
      const method = editingEntry ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchData();
        setIsDialogOpen(false);
        setEditingEntry(null);
        resetForm();
      } else {
        const error = await response.json();
        setErrorMessage(error.error || "Erro ao salvar registro");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setErrorMessage("Erro ao salvar registro");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setFormData({
      employeeId: entry.employeeId,
      date: entry.date.split("T")[0],
      workedLunch: entry.workedLunch,
      workedDinner: entry.workedDinner,
      clockInLunch: entry.clockInLunch || "",
      clockOutLunch: entry.clockOutLunch || "",
      clockInDinner: entry.clockInDinner || "",
      clockOutDinner: entry.clockOutDinner || "",
      status: entry.status,
      notes: entry.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir este registro de ponto?")) return;

    try {
      const response = await fetch(`/api/time-entries/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao excluir registro");
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: "",
      date: selectedDate,
      workedLunch: false,
      workedDinner: false,
      clockInLunch: "",
      clockOutLunch: "",
      clockInDinner: "",
      clockOutDinner: "",
      status: "PRESENT",
      notes: "",
    });
    setErrorMessage("");
  };

  // Bater ponto rápido (entrada)
  const handleClockIn = async (employeeId: string, shift: 'lunch' | 'dinner') => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Verificar se já tem registro hoje
    const existingEntry = timeEntries.find(e => e.employeeId === employeeId);
    
    if (existingEntry) {
      // Atualizar registro existente
      const updateData = shift === 'lunch' 
        ? { clockInLunch: timeStr, workedLunch: true }
        : { clockInDinner: timeStr, workedDinner: true };
      
      try {
        const response = await fetch(`/api/time-entries/${existingEntry.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
        
        if (response.ok) {
          fetchData();
        } else {
          const error = await response.json();
          alert(error.error || "Erro ao registrar entrada");
        }
      } catch (error) {
        console.error("Erro:", error);
      }
    } else {
      // Criar novo registro
      const newData = {
        employeeId,
        date: selectedDate,
        workedLunch: shift === 'lunch',
        workedDinner: shift === 'dinner',
        clockInLunch: shift === 'lunch' ? timeStr : "",
        clockInDinner: shift === 'dinner' ? timeStr : "",
        status: "PRESENT",
      };
      
      try {
        const response = await fetch("/api/time-entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newData),
        });
        
        if (response.ok) {
          fetchData();
        } else {
          const error = await response.json();
          alert(error.error || "Erro ao registrar entrada");
        }
      } catch (error) {
        console.error("Erro:", error);
      }
    }
  };

  // Bater ponto rápido (saída)
  const handleClockOut = async (entryId: string, shift: 'lunch' | 'dinner') => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const updateData = shift === 'lunch' 
      ? { clockOutLunch: timeStr }
      : { clockOutDinner: timeStr };
    
    try {
      const response = await fetch(`/api/time-entries/${entryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      
      if (response.ok) {
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao registrar saída");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatTime = (time: string | null) => {
    if (!time) return "-";
    return time;
  };

  // Lógica de filtros
  const filteredEntries = timeEntries.filter((entry) => {
    // Filtro por busca
    const matchesSearch = entry.employee.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por turno
    const matchesShift =
      shiftFilter === "all" ||
      (shiftFilter === "lunch" && entry.workedLunch) ||
      (shiftFilter === "dinner" && entry.workedDinner);

    // Filtro por status (ponto completo ou pendente)
    const lunchComplete = !entry.workedLunch || (entry.clockInLunch && entry.clockOutLunch);
    const dinnerComplete = !entry.workedDinner || (entry.clockInDinner && entry.clockOutDinner);
    const isComplete = lunchComplete && dinnerComplete;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "complete" && isComplete) ||
      (statusFilter === "pending" && !isComplete);

    return matchesSearch && matchesShift && matchesStatus;
  });

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setShiftFilter("all");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchTerm || shiftFilter !== "all" || statusFilter !== "all";

  // Funcionários sem registro hoje
  const employeesWithoutEntry = employees.filter(
    emp => !timeEntries.some(entry => entry.employeeId === emp.id)
  );

  // Total do dia (baseado nos filtrados para exibição, mas o resumo usa todos)
  const totalDay = timeEntries.reduce((sum, e) => sum + Number(e.totalValue), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Controle de Ponto</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Administrador" : "Gerente"} - {isAdmin ? "Acesso total" : "Edição até 2 dias"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label>Data:</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingEntry(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => { setFormData({ ...formData, date: selectedDate }); }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Registro
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingEntry ? "Editar Registro" : "Novo Registro de Ponto"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do registro de ponto
                </DialogDescription>
              </DialogHeader>

              {errorMessage && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Funcionário</Label>
                    <Select
                      value={formData.employeeId}
                      onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                      disabled={!!editingEntry}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      disabled={!!editingEntry}
                    />
                  </div>
                </div>

                {/* Turno Almoço */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="workedLunch"
                      checked={formData.workedLunch}
                      onCheckedChange={(checked) => setFormData({ ...formData, workedLunch: !!checked })}
                    />
                    <Label htmlFor="workedLunch" className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-amber-500" />
                      Trabalhou no Almoço
                    </Label>
                  </div>

                  {formData.workedLunch && (
                    <div className="grid grid-cols-2 gap-4 pl-6">
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center gap-1">
                          <LogIn className="h-3 w-3" /> Entrada
                        </Label>
                        <Input
                          type="time"
                          value={formData.clockInLunch}
                          onChange={(e) => setFormData({ ...formData, clockInLunch: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center gap-1">
                          <LogOut className="h-3 w-3" /> Saída
                        </Label>
                        <Input
                          type="time"
                          value={formData.clockOutLunch}
                          onChange={(e) => setFormData({ ...formData, clockOutLunch: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Turno Jantar */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="workedDinner"
                      checked={formData.workedDinner}
                      onCheckedChange={(checked) => setFormData({ ...formData, workedDinner: !!checked })}
                    />
                    <Label htmlFor="workedDinner" className="flex items-center gap-2">
                      <Moon className="h-4 w-4 text-blue-500" />
                      Trabalhou no Jantar
                    </Label>
                  </div>

                  {formData.workedDinner && (
                    <div className="grid grid-cols-2 gap-4 pl-6">
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center gap-1">
                          <LogIn className="h-3 w-3" /> Entrada
                        </Label>
                        <Input
                          type="time"
                          value={formData.clockInDinner}
                          onChange={(e) => setFormData({ ...formData, clockInDinner: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center gap-1">
                          <LogOut className="h-3 w-3" /> Saída
                        </Label>
                        <Input
                          type="time"
                          value={formData.clockOutDinner}
                          onChange={(e) => setFormData({ ...formData, clockOutDinner: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Anotações opcionais..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingEntry ? "Salvar" : "Registrar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Cards de resumo - apenas para admin */}
      <div className={`grid grid-cols-1 gap-4 ${isAdmin ? 'md:grid-cols-4' : 'md:grid-cols-2'}`}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Registros Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{timeEntries.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Sem Registro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{employeesWithoutEntry.length}</p>
          </CardContent>
        </Card>
        
        {isAdmin && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Almoço</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-amber-600">
                  {formatCurrency(timeEntries.reduce((sum, e) => sum + Number(e.lunchValue), 0))}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Jantar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(timeEntries.reduce((sum, e) => sum + Number(e.dinnerValue), 0))}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Bater ponto rápido */}
      {employeesWithoutEntry.length > 0 && selectedDate === getLocalDateString() && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Bater Ponto Rápido
            </CardTitle>
            <CardDescription>
              Clique para registrar entrada do funcionário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {employeesWithoutEntry.slice(0, 10).map((emp) => (
                <div key={emp.id} className="flex items-center gap-1">
                  <span className="text-sm font-medium">{emp.name}</span>
                  {emp.worksLunch && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-amber-600"
                      onClick={() => handleClockIn(emp.id, 'lunch')}
                    >
                      <Sun className="h-3 w-3 mr-1" />
                      Almoço
                    </Button>
                  )}
                  {emp.worksDinner && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-blue-600"
                      onClick={() => handleClockIn(emp.id, 'dinner')}
                    >
                      <Moon className="h-3 w-3 mr-1" />
                      Jantar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabela de registros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <CardTitle>Registros do Dia</CardTitle>
              {isAdmin && (
                <Badge variant="outline" className="text-lg px-3 py-1">
                  Total: {formatCurrency(totalDay)}
                </Badge>
              )}
            </div>

            {/* Filtros */}
            {timeEntries.length > 0 && (
              <div className="flex flex-wrap gap-3 items-center">
                {/* Busca */}
                <div className="relative flex-1 min-w-[180px] max-w-[250px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar funcionário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9"
                  />
                </div>

                {/* Filtro por turno */}
                <Select value={shiftFilter} onValueChange={(v) => setShiftFilter(v as typeof shiftFilter)}>
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue placeholder="Turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="lunch">
                      <span className="flex items-center gap-1">
                        <Sun className="h-3 w-3 text-amber-500" />
                        Almoço
                      </span>
                    </SelectItem>
                    <SelectItem value="dinner">
                      <span className="flex items-center gap-1">
                        <Moon className="h-3 w-3 text-blue-500" />
                        Jantar
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Filtro por status */}
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Status</SelectItem>
                    <SelectItem value="complete">Ponto Completo</SelectItem>
                    <SelectItem value="pending">Saída Pendente</SelectItem>
                  </SelectContent>
                </Select>

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
                    {filteredEntries.length} de {timeEntries.length}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {timeEntries.length === 0 
                ? "Nenhum registro de ponto para esta data" 
                : "Nenhum registro encontrado com os filtros atuais"}
            </div>
          ) : (
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">Funcionário</TableHead>
                  <TableHead className="w-[25%] text-center">
                    <Sun className="h-4 w-4 inline mr-1 text-amber-500" />
                    Almoço
                  </TableHead>
                  <TableHead className="w-[25%] text-center">
                    <Moon className="h-4 w-4 inline mr-1 text-blue-500" />
                    Jantar
                  </TableHead>
                  {isAdmin && <TableHead className="w-[12%] text-right">Valor</TableHead>}
                  <TableHead className="w-[13%] text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => {
                  const entryCanEdit = canEdit(userRole, entry.date);
                  
                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {entry.employee.name}
                        {entry.notes && (
                          <p className="text-xs text-muted-foreground">{entry.notes}</p>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-center">
                        {entry.workedLunch ? (
                          <div className="space-y-1">
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {formatTime(entry.clockInLunch)} - {formatTime(entry.clockOutLunch)}
                            </Badge>
                            {entry.clockInLunch && !entry.clockOutLunch && entryCanEdit && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 text-xs"
                                onClick={() => handleClockOut(entry.id, 'lunch')}
                              >
                                <LogOut className="h-3 w-3 mr-1" />
                                Saída
                              </Button>
                            )}
                            {isAdmin && (
                              <p className="text-xs text-muted-foreground">
                                {formatCurrency(Number(entry.lunchValue))}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-center">
                        {entry.workedDinner ? (
                          <div className="space-y-1">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {formatTime(entry.clockInDinner)} - {formatTime(entry.clockOutDinner)}
                            </Badge>
                            {entry.clockInDinner && !entry.clockOutDinner && entryCanEdit && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 text-xs"
                                onClick={() => handleClockOut(entry.id, 'dinner')}
                              >
                                <LogOut className="h-3 w-3 mr-1" />
                                Saída
                              </Button>
                            )}
                            {isAdmin && (
                              <p className="text-xs text-muted-foreground">
                                {formatCurrency(Number(entry.dinnerValue))}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      
                      {isAdmin && (
                        <TableCell className="text-right font-bold">
                          {formatCurrency(Number(entry.totalValue))}
                        </TableCell>
                      )}
                      
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          {entryCanEdit ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(entry)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Bloqueado
                            </Badge>
                          )}
                          
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => handleDelete(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

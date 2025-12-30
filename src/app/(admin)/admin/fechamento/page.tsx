"use client";

import { useState, useEffect } from "react";
import { AdminOnly } from "@/components/admin/AdminOnly";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Loader2, Calendar, DollarSign, Users, FileText, Sun, Moon, Wallet, TrendingDown, Printer, Download, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Payment {
  id: string;
  employeeName: string;
  daysWorked: number;
  lunchShifts: number;
  dinnerShifts: number;
  fixedSalary: number;
  lunchTotal: number;
  dinnerTotal: number;
  grossAmount: number;
  advances: number;
  deductions: number;
  netAmount: number;
  paid: boolean;
}

interface Period {
  id: string;
  startDate: string;
  endDate: string;
  periodType: string;
  status: string;
  totalAmount: number;
  payments: Payment[];
  createdAt: string;
}

// Helper para garantir conversão de valores Decimal do Prisma para number
const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
};

export default function FechamentoPage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    periodType: "WEEKLY",
    startDate: "",
    endDate: "",
  });

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    if (selectedPeriod) {
      setExpandedRows(new Set(selectedPeriod.payments.map(p => p.id)));
    }
  };

  const collapseAll = () => {
    setExpandedRows(new Set());
  };

  // Calcular datas baseado no tipo de período
  const calculateDates = (type: string) => {
    const today = new Date();
    let start: Date;
    let end: Date;

    switch (type) {
      case "WEEKLY":
        // Última semana (segunda a domingo)
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        start = new Date(today);
        start.setDate(today.getDate() - diff - 7);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      case "BIWEEKLY":
        // Últimas 2 semanas
        start = new Date(today);
        start.setDate(today.getDate() - 14);
        end = new Date(today);
        end.setDate(today.getDate() - 1);
        break;
      case "MONTHLY":
        // Mês anterior
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        start = new Date();
        end = new Date();
    }

    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  };

  const fetchPeriods = async () => {
    try {
      const response = await fetch("/api/payroll-period");
      if (response.ok) {
        const data = await response.json();
        setPeriods(data);
      }
    } catch (error) {
      console.error("Erro ao buscar períodos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
    // Inicializar datas
    const dates = calculateDates("WEEKLY");
    setFormData((prev) => ({ ...prev, ...dates }));
  }, []);

  const handlePeriodTypeChange = (type: string) => {
    const dates = calculateDates(type);
    setFormData({ periodType: type, ...dates });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/payroll-period", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newPeriod = await response.json();
        fetchPeriods();
        setIsDialogOpen(false);
        setSelectedPeriod(newPeriod);
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao criar fechamento");
      }
    } catch (error) {
      console.error("Erro ao criar:", error);
      alert("Erro ao criar fechamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: unknown) => {
    const num = toNumber(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  const getPeriodTypeName = (type: string) => {
    const names: Record<string, string> = {
      WEEKLY: "Semanal",
      BIWEEKLY: "Quinzenal",
      MONTHLY: "Mensal",
      CUSTOM: "Personalizado",
    };
    return names[type] || type;
  };

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
          <h1 className="text-3xl font-bold">Fechamento de Período</h1>
          <p className="text-muted-foreground">
            Calcule os valores a pagar por período
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calculator className="mr-2 h-4 w-4" />
              Novo Fechamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Novo Fechamento</DialogTitle>
              <DialogDescription>
                Selecione o período para calcular os valores
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Período</Label>
                <Select
                  value={formData.periodType}
                  onValueChange={handlePeriodTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEEKLY">Semanal</SelectItem>
                    <SelectItem value="BIWEEKLY">Quinzenal</SelectItem>
                    <SelectItem value="MONTHLY">Mensal</SelectItem>
                    <SelectItem value="CUSTOM">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Calcular
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          {selectedPeriod ? (
            <>
              {/* Cabeçalho do período */}
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span className="text-lg font-bold">
                          {formatDate(selectedPeriod.startDate)} até {formatDate(selectedPeriod.endDate)}
                        </span>
                        <Badge variant="secondary">
                          {getPeriodTypeName(selectedPeriod.periodType)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Fechamento realizado em {formatDate(selectedPeriod.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => window.print()}>
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resumo do período */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedPeriod.payments.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedPeriod.payments.reduce((s, p) => s + toNumber(p.daysWorked), 0)} dias trabalhados
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bruto</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(
                        selectedPeriod.payments.reduce((sum, p) => sum + toNumber(p.grossAmount), 0)
                      )}
                    </div>
                    <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Sun className="h-3 w-3 text-amber-500" />
                        {formatCurrency(selectedPeriod.payments.reduce((s, p) => s + toNumber(p.lunchTotal), 0))}
                      </span>
                      <span className="flex items-center gap-1">
                        <Moon className="h-3 w-3 text-blue-500" />
                        {formatCurrency(selectedPeriod.payments.reduce((s, p) => s + toNumber(p.dinnerTotal), 0))}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-red-700">Adiantamentos</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-700">
                      -{formatCurrency(selectedPeriod.payments.reduce((s, p) => s + toNumber(p.advances), 0))}
                    </div>
                    <p className="text-xs text-red-600">
                      {selectedPeriod.payments.filter(p => p.advances > 0).length} funcionários com desconto
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-700">Total a Pagar</CardTitle>
                    <Wallet className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-700">
                      {formatCurrency(selectedPeriod.totalAmount)}
                    </div>
                    <p className="text-xs text-green-600">
                      Líquido após descontos
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Cards de turnos */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <Sun className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-base">Almoço</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-amber-600">
                          {selectedPeriod.payments.reduce((s, p) => s + toNumber(p.lunchShifts), 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">turnos trabalhados</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {formatCurrency(selectedPeriod.payments.reduce((s, p) => s + toNumber(p.lunchTotal), 0))}
                        </p>
                        <p className="text-xs text-muted-foreground">valor total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <Moon className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-base">Jantar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedPeriod.payments.reduce((s, p) => s + toNumber(p.dinnerShifts), 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">turnos trabalhados</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {formatCurrency(selectedPeriod.payments.reduce((s, p) => s + toNumber(p.dinnerTotal), 0))}
                        </p>
                        <p className="text-xs text-muted-foreground">valor total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabela de pagamentos */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Espelho de Pagamento
                      </CardTitle>
                      <CardDescription>
                        Total Bruto - Adiantamentos = Líquido a Pagar
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={showDetails ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowDetails(!showDetails)}
                      >
                        {showDetails ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Resumido
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Detalhado
                          </>
                        )}
                      </Button>
                      {showDetails && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={expandedRows.size > 0 ? collapseAll : expandAll}
                        >
                          {expandedRows.size > 0 ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Recolher
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Expandir
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Visão Resumida */}
                  {!showDetails ? (
                    <div className="space-y-2">
                      {selectedPeriod.payments
                        .sort((a, b) => b.netAmount - a.netAmount)
                        .map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <span className="font-medium">{payment.employeeName}</span>
                              <div className="flex gap-2 text-xs text-muted-foreground">
                                <span>{payment.daysWorked} dias</span>
                                {payment.lunchShifts > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Sun className="h-3 w-3 text-amber-500" />
                                    {payment.lunchShifts}
                                  </span>
                                )}
                                {payment.dinnerShifts > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Moon className="h-3 w-3 text-blue-500" />
                                    {payment.dinnerShifts}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {payment.advances > 0 && (
                              <span className="text-sm text-red-600">
                                -{formatCurrency(payment.advances)}
                              </span>
                            )}
                            <span className="font-bold text-green-700 text-lg">
                              {formatCurrency(payment.netAmount)}
                            </span>
                          </div>
                        </div>
                      ))}
                      {/* Total */}
                      <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border-2 border-primary/20 mt-4">
                        <span className="font-bold text-lg">TOTAL A PAGAR</span>
                        <span className="font-bold text-green-700 text-2xl">
                          {formatCurrency(selectedPeriod.totalAmount)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Visão Detalhada com expansão */
                    <div className="space-y-2">
                      {selectedPeriod.payments
                        .sort((a, b) => b.netAmount - a.netAmount)
                        .map((payment) => (
                        <Collapsible
                          key={payment.id}
                          open={expandedRows.has(payment.id)}
                          onOpenChange={() => toggleRow(payment.id)}
                        >
                          <div className="border rounded-lg overflow-hidden">
                            <CollapsibleTrigger asChild>
                              <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                  {expandedRows.has(payment.id) ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <div className="flex flex-col">
                                    <span className="font-medium">{payment.employeeName}</span>
                                    <div className="flex gap-2 text-xs text-muted-foreground">
                                      <span>{payment.daysWorked} dias</span>
                                      {payment.lunchShifts > 0 && (
                                        <Badge variant="outline" className="text-[10px] py-0 px-1 bg-amber-50 text-amber-700 border-amber-200">
                                          <Sun className="h-2 w-2 mr-0.5" />
                                          {payment.lunchShifts}
                                        </Badge>
                                      )}
                                      {payment.dinnerShifts > 0 && (
                                        <Badge variant="outline" className="text-[10px] py-0 px-1 bg-blue-50 text-blue-700 border-blue-200">
                                          <Moon className="h-2 w-2 mr-0.5" />
                                          {payment.dinnerShifts}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  {payment.advances > 0 && (
                                    <span className="text-sm text-red-600">
                                      -{formatCurrency(payment.advances)}
                                    </span>
                                  )}
                                  <span className="font-bold text-green-700 text-lg">
                                    {formatCurrency(payment.netAmount)}
                                  </span>
                                </div>
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="bg-muted/30 p-4 border-t">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  {/* Almoço */}
                                  <div className="space-y-1">
                                    <p className="text-muted-foreground flex items-center gap-1">
                                      <Sun className="h-3 w-3 text-amber-500" />
                                      Almoço
                                    </p>
                                    <p className="font-medium">
                                      {payment.lunchShifts} turnos
                                    </p>
                                    <p className="text-amber-700 font-bold">
                                      {formatCurrency(payment.lunchTotal)}
                                    </p>
                                  </div>
                                  {/* Jantar */}
                                  <div className="space-y-1">
                                    <p className="text-muted-foreground flex items-center gap-1">
                                      <Moon className="h-3 w-3 text-blue-500" />
                                      Jantar
                                    </p>
                                    <p className="font-medium">
                                      {payment.dinnerShifts} turnos
                                    </p>
                                    <p className="text-blue-700 font-bold">
                                      {formatCurrency(payment.dinnerTotal)}
                                    </p>
                                  </div>
                                  {/* Bruto */}
                                  <div className="space-y-1">
                                    <p className="text-muted-foreground">Total Bruto</p>
                                    <p className="font-bold text-lg">
                                      {formatCurrency(payment.grossAmount)}
                                    </p>
                                  </div>
                                  {/* Cálculo */}
                                  <div className="space-y-1 bg-white/50 p-2 rounded-lg">
                                    <p className="text-muted-foreground text-xs">Cálculo</p>
                                    <div className="text-xs space-y-0.5">
                                      <p>{formatCurrency(payment.grossAmount)} (bruto)</p>
                                      {payment.advances > 0 && (
                                        <p className="text-red-600">
                                          - {formatCurrency(payment.advances)} (adiant.)
                                        </p>
                                      )}
                                      <div className="border-t pt-1 mt-1">
                                        <p className="font-bold text-green-700">
                                          = {formatCurrency(payment.netAmount)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      ))}
                      
                      {/* Resumo Total */}
                      <div className="border-2 border-primary/20 rounded-lg p-4 bg-primary/5 mt-4">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Funcionários</p>
                            <p className="font-bold text-lg">{selectedPeriod.payments.length}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <Sun className="h-3 w-3 text-amber-500" /> Almoço
                            </p>
                            <p className="font-bold text-amber-700">
                              {formatCurrency(selectedPeriod.payments.reduce((s, p) => s + toNumber(p.lunchTotal), 0))}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <Moon className="h-3 w-3 text-blue-500" /> Jantar
                            </p>
                            <p className="font-bold text-blue-700">
                              {formatCurrency(selectedPeriod.payments.reduce((s, p) => s + toNumber(p.dinnerTotal), 0))}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Adiantamentos</p>
                            <p className="font-bold text-red-600">
                              -{formatCurrency(selectedPeriod.payments.reduce((s, p) => s + toNumber(p.advances), 0))}
                            </p>
                          </div>
                          <div className="bg-green-100 -m-2 p-2 rounded-lg">
                            <p className="text-green-700 text-xs">Total a Pagar</p>
                            <p className="font-bold text-green-700 text-xl">
                              {formatCurrency(selectedPeriod.totalAmount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Selecione um período no histórico ou crie um novo fechamento
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Fechamentos</CardTitle>
              <CardDescription>
                Clique em um período para ver os detalhes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {periods.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum fechamento realizado ainda
                </p>
              ) : (
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%]">Período</TableHead>
                      <TableHead className="w-[15%]">Tipo</TableHead>
                      <TableHead className="w-[15%] text-center">Funcionários</TableHead>
                      <TableHead className="w-[20%] text-right">Total</TableHead>
                      <TableHead className="w-[20%]">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {periods.map((period) => (
                      <TableRow
                        key={period.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedPeriod(period)}
                      >
                        <TableCell className="font-medium">
                          {formatDate(period.startDate)} - {formatDate(period.endDate)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getPeriodTypeName(period.periodType)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {period.payments.length}
                        </TableCell>
                        <TableCell className="text-right font-bold text-green-600">
                          {formatCurrency(period.totalAmount)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(period.createdAt)}
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
    </AdminOnly>
  );
}


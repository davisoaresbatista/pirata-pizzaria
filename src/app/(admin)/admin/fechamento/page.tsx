"use client";

import { useState, useEffect } from "react";
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
import { Calculator, Loader2, Calendar, DollarSign, Users, FileText } from "lucide-react";

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

export default function FechamentoPage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);

  const [formData, setFormData] = useState({
    periodType: "WEEKLY",
    startDate: "",
    endDate: "",
  });

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
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
              {/* Resumo do período */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Período</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">
                      {formatDate(selectedPeriod.startDate)} - {formatDate(selectedPeriod.endDate)}
                    </div>
                    <Badge variant="secondary">
                      {getPeriodTypeName(selectedPeriod.periodType)}
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedPeriod.payments.length}
                    </div>
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
                        selectedPeriod.payments.reduce((sum, p) => sum + p.grossAmount, 0)
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Líquido</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(selectedPeriod.totalAmount)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabela de pagamentos */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalhamento por Funcionário</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Funcionário</TableHead>
                        <TableHead className="text-center">Dias</TableHead>
                        <TableHead className="text-center">Almoço</TableHead>
                        <TableHead className="text-center">Jantar</TableHead>
                        <TableHead className="text-right">Fixo</TableHead>
                        <TableHead className="text-right">Turnos</TableHead>
                        <TableHead className="text-right">Bruto</TableHead>
                        <TableHead className="text-right">Adiant.</TableHead>
                        <TableHead className="text-right">Líquido</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPeriod.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {payment.employeeName}
                          </TableCell>
                          <TableCell className="text-center">{payment.daysWorked}</TableCell>
                          <TableCell className="text-center">{payment.lunchShifts}</TableCell>
                          <TableCell className="text-center">{payment.dinnerShifts}</TableCell>
                          <TableCell className="text-right">
                            {payment.fixedSalary > 0 ? formatCurrency(payment.fixedSalary) : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(payment.lunchTotal + payment.dinnerTotal)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(payment.grossAmount)}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {payment.advances > 0 ? `-${formatCurrency(payment.advances)}` : "-"}
                          </TableCell>
                          <TableCell className="text-right font-bold text-green-600">
                            {formatCurrency(payment.netAmount)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-bold">
                        <TableCell>TOTAL</TableCell>
                        <TableCell className="text-center">
                          {selectedPeriod.payments.reduce((s, p) => s + p.daysWorked, 0)}
                        </TableCell>
                        <TableCell className="text-center">
                          {selectedPeriod.payments.reduce((s, p) => s + p.lunchShifts, 0)}
                        </TableCell>
                        <TableCell className="text-center">
                          {selectedPeriod.payments.reduce((s, p) => s + p.dinnerShifts, 0)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(selectedPeriod.payments.reduce((s, p) => s + p.fixedSalary, 0))}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(
                            selectedPeriod.payments.reduce((s, p) => s + p.lunchTotal + p.dinnerTotal, 0)
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(selectedPeriod.payments.reduce((s, p) => s + p.grossAmount, 0))}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          -{formatCurrency(selectedPeriod.payments.reduce((s, p) => s + p.advances, 0))}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(selectedPeriod.totalAmount)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-center">Funcionários</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Data</TableHead>
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
  );
}


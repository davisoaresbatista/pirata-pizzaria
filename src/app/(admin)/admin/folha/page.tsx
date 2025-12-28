"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, FileText, RefreshCw, DollarSign } from "lucide-react";

interface PayrollEntry {
  id: string;
  employeeId: string;
  employee: {
    id: string;
    name: string;
    role: string;
  };
  month: string;
  baseSalary: number;
  advances: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  paid: boolean;
  paymentDate: string | null;
}

export default function FolhaPage() {
  const [payroll, setPayroll] = useState<PayrollEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const fetchPayroll = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/payroll?month=${selectedMonth}`);
      if (response.ok) {
        const data = await response.json();
        setPayroll(data);
      }
    } catch (error) {
      console.error("Erro ao buscar folha:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [selectedMonth]);

  const handleGeneratePayroll = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/payroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: selectedMonth }),
      });

      if (response.ok) {
        fetchPayroll();
      }
    } catch (error) {
      console.error("Erro ao gerar folha:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      const response = await fetch(`/api/payroll/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid: true }),
      });

      if (response.ok) {
        fetchPayroll();
      }
    } catch (error) {
      console.error("Erro ao marcar como pago:", error);
    }
  };

  const totalSalaries = payroll.reduce((sum, p) => sum + Number(p.netSalary), 0);
  const totalPaid = payroll.filter((p) => p.paid).reduce((sum, p) => sum + Number(p.netSalary), 0);
  const totalPending = totalSalaries - totalPaid;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Folha de Pagamento</h1>
          <p className="text-muted-foreground">
            Gerencie os pagamentos dos funcionários
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-40"
          />
          <Button onClick={handleGeneratePayroll} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Gerar/Atualizar Folha
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total da Folha</p>
                <p className="text-2xl font-bold">
                  R$ {totalSalaries.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600">Total Pago</p>
                <p className="text-2xl font-bold text-green-700">
                  R$ {totalPaid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-amber-600">Total Pendente</p>
                <p className="text-2xl font-bold text-amber-700">
                  R$ {totalPending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Folha de {selectedMonth.split("-").reverse().join("/")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : payroll.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Nenhuma folha gerada para este mês
              </p>
              <Button onClick={handleGeneratePayroll} disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Gerar Folha de Pagamento
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead className="text-right">Salário Base</TableHead>
                    <TableHead className="text-right">Adiantamentos</TableHead>
                    <TableHead className="text-right">Bônus</TableHead>
                    <TableHead className="text-right">Descontos</TableHead>
                    <TableHead className="text-right">Salário Líquido</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payroll.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {entry.employee.name}
                      </TableCell>
                      <TableCell>{entry.employee.role}</TableCell>
                      <TableCell className="text-right">
                        R$ {Number(entry.baseSalary).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {Number(entry.advances) > 0 ? (
                          `- R$ ${Number(entry.advances).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {Number(entry.bonuses) > 0 ? (
                          `+ R$ ${Number(entry.bonuses).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {Number(entry.deductions) > 0 ? (
                          `- R$ ${Number(entry.deductions).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        R$ {Number(entry.netSalary).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={entry.paid ? "default" : "outline"}>
                          {entry.paid ? "Pago" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {!entry.paid && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkPaid(entry.id)}
                          >
                            Marcar Pago
                          </Button>
                        )}
                        {entry.paid && entry.paymentDate && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.paymentDate).toLocaleDateString("pt-BR")}
                          </span>
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
  );
}


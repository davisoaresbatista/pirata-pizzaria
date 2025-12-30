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
import { Plus, Trash2, Loader2, TrendingUp } from "lucide-react";

interface Revenue {
  id: string;
  source: string;
  description: string | null;
  amount: number;
  date: string;
  notes: string | null;
}

const sources = [
  { value: "SALES", label: "Vendas" },
  { value: "DELIVERY", label: "Delivery" },
  { value: "EVENTS", label: "Eventos" },
  { value: "OTHER", label: "Outros" },
];

export default function ReceitasPage() {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [formData, setFormData] = useState({
    source: "",
    description: "",
    amount: "",
    date: getLocalDateString(),
    notes: "",
  });

  const fetchRevenues = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/revenues?month=${selectedMonth}`);
      if (response.ok) {
        const data = await response.json();
        setRevenues(data);
      }
    } catch (error) {
      console.error("Erro ao buscar receitas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenues();
  }, [selectedMonth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/revenues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchRevenues();
        setIsDialogOpen(false);
        setFormData({
          source: "",
          description: "",
          amount: "",
          date: getLocalDateString(),
          notes: "",
        });
      }
    } catch (error) {
      console.error("Erro ao criar receita:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta receita?")) return;

    try {
      const response = await fetch(`/api/revenues/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchRevenues();
      }
    } catch (error) {
      console.error("Erro ao excluir receita:", error);
    }
  };

  const totalRevenue = revenues.reduce((sum, r) => sum + Number(r.amount), 0);
  const getSourceLabel = (value: string) =>
    sources.find((s) => s.value === value)?.label || value;

  return (
    <AdminOnly>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Receitas</h1>
          <p className="text-muted-foreground">
            Controle de faturamento da pizzaria
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
                Nova Receita
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Receita</DialogTitle>
                <DialogDescription>
                  Registre uma nova entrada de receita
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Fonte *</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) =>
                      setFormData({ ...formData, source: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map((src) => (
                        <SelectItem key={src.value} value={src.value}>
                          {src.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    placeholder="Ex: Vendas do dia"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
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
                  <Button type="submit" disabled={isSubmitting || !formData.source}>
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

      {/* Total */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">
                Total de Receitas ({selectedMonth.split("-").reverse().join("/")})
              </p>
              <p className="text-3xl font-bold text-green-700">
                R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Receitas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : revenues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma receita registrada neste mês
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[15%]">Data</TableHead>
                    <TableHead className="w-[20%]">Fonte</TableHead>
                    <TableHead className="w-[35%]">Descrição</TableHead>
                    <TableHead className="w-[18%] text-right">Valor</TableHead>
                    <TableHead className="w-[12%] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenues.map((revenue) => (
                    <TableRow key={revenue.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(revenue.date).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getSourceLabel(revenue.source)}
                        </Badge>
                      </TableCell>
                      <TableCell className="truncate">{revenue.description || "-"}</TableCell>
                      <TableCell className="font-semibold text-green-600 text-right whitespace-nowrap">
                        R$ {Number(revenue.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(revenue.id)}
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


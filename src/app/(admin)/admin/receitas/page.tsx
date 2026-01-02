"use client";

import { useState, useEffect } from "react";
import { AdminOnly } from "@/components/admin/AdminOnly";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Clock,
  Users,
  BarChart3,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Store,
  Utensils,
  Package,
  AlertCircle,
  CheckCircle,
  Search,
  X,
  RefreshCw,
  Info,
} from "lucide-react";

interface SalesOrder {
  id: string;
  externalId: string;
  origin: string;
  orderType: string;
  itemsCount: number;
  amount: number;
  status: string;
  paymentStatus: string;
  openedAt: string;
  closedAt: string | null;
  duration: number | null;
  unit: string;
  tableNumber: number | null;
  isCounter: boolean;
  isDelivery: boolean;
  paymentMethod: string | null;
}

interface SalesStats {
  period: {
    startDate: string;
    endDate: string;
    daysInMonth: number;
    currentDay: number;
  };
  summary: {
    totalOrders: number;
    totalAmount: number;
    totalItems: number;
    avgOrderValue: number;
    avgItemsPerOrder: number;
    dailyAvg: number;
    monthProjection: number;
  };
  payment: {
    paidOrders: number;
    paidAmount: number;
    pendingOrders: number;
    pendingAmount: number;
    paidPercentage: number;
  };
  orderTypes: {
    counter: { count: number; amount: number; percentage: number };
    table: { count: number; amount: number; percentage: number };
    delivery: { count: number; amount: number; percentage: number };
  };
  timing: {
    avgDuration: number;
    avgDurationFormatted: string;
  };
  distribution: {
    byWeekday: {
      labels: string[];
      orders: number[];
      amounts: number[];
    };
    byHour: {
      labels: string[];
      orders: number[];
      amounts: number[];
    };
    byDay: Record<string, { count: number; amount: number }>;
  };
  topTables: { table: number; count: number; amount: number }[];
  comparison: {
    totalAmount: number;
    totalOrders: number;
    avgOrderValue: number;
    amountChange: number;
    ordersChange: number;
  } | null;
}

export default function ReceitasPage() {
  const [sales, setSales] = useState<SalesOrder[]>([]);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    // Se estamos nos primeiros 5 dias do mês, mostrar mês anterior por padrão
    // para ter dados mais completos
    if (now.getDate() <= 5) {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;
    }
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/sales?month=${selectedMonth}&limit=100`);
      if (response.ok) {
        const data = await response.json();
        setSales(data);
      }
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const response = await fetch(`/api/sales/stats?month=${selectedMonth}&compare=true`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchStats();
  }, [selectedMonth]);

  // Filtros
  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.externalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.orderType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.origin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || sale.paymentStatus === statusFilter;

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "COUNTER" && sale.isCounter) ||
      (typeFilter === "TABLE" && !sale.isCounter && !sale.isDelivery) ||
      (typeFilter === "DELIVERY" && sale.isDelivery);

    return matchesSearch && matchesStatus && matchesType;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const hasActiveFilters = searchTerm || statusFilter !== "all" || typeFilter !== "all";

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "-";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "PAID":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Pago
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Fiado
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <X className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return <Badge variant="secondary">{paymentStatus}</Badge>;
    }
  };

  const getTypeBadge = (sale: SalesOrder) => {
    if (sale.isCounter) {
      return (
        <Badge variant="outline" className="gap-1">
          <Store className="h-3 w-3" />
          Balcão
        </Badge>
      );
    }
    if (sale.isDelivery) {
      return (
        <Badge variant="outline" className="gap-1">
          <Package className="h-3 w-3" />
          Delivery
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1">
        <Utensils className="h-3 w-3" />
        Mesa {sale.tableNumber || ""}
      </Badge>
    );
  };

  // Dados para mini charts (barras de distribuição)
  const weekdayData = stats?.distribution?.byWeekday;
  const maxWeekdayAmount = weekdayData ? Math.max(...weekdayData.amounts) : 0;

  return (
    <AdminOnly>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Receitas</h1>
            <p className="text-muted-foreground">
              Dados de vendas do Consumer Connect
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                fetchSales();
                fetchStats();
              }}
              disabled={isLoading || isLoadingStats}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading || isLoadingStats ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Aviso de Pipeline */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Dados sincronizados automaticamente
                </p>
                <p className="text-sm text-blue-700 mt-0.5">
                  As receitas são carregadas via pipeline do Consumer Connect. 
                  Os dados exibidos refletem as vendas registradas na plataforma.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Big Numbers - Principais */}
        {isLoadingStats ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-20 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Faturamento Total */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">
                    Faturamento Total
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-800">
                    {formatCurrency(stats?.summary?.totalAmount || 0)}
                  </div>
                  {stats?.comparison && (
                    <div className="flex items-center gap-1 text-xs mt-1">
                      {stats.comparison.amountChange >= 0 ? (
                        <>
                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">
                            +{stats.comparison.amountChange.toFixed(1)}% vs mês anterior
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3 w-3 text-red-500" />
                          <span className="text-red-500">
                            {stats.comparison.amountChange.toFixed(1)}% vs mês anterior
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Total de Pedidos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Pedidos
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.summary?.totalOrders || 0}
                  </div>
                  {stats?.comparison && (
                    <div className="flex items-center gap-1 text-xs mt-1">
                      {stats.comparison.ordersChange >= 0 ? (
                        <>
                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">
                            +{stats.comparison.ordersChange.toFixed(1)}%
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3 w-3 text-red-500" />
                          <span className="text-red-500">
                            {stats.comparison.ordersChange.toFixed(1)}%
                          </span>
                        </>
                      )}
                      <span className="text-muted-foreground">vs anterior</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ticket Médio */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ticket Médio
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats?.summary?.avgOrderValue || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ~{stats?.summary?.avgItemsPerOrder?.toFixed(1) || 0} itens/pedido
                  </p>
                </CardContent>
              </Card>

              {/* Tempo Médio */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tempo Médio
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.timing?.avgDurationFormatted || "-"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Do pedido ao fechamento
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Segunda linha de métricas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Projeção Mensal */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Projeção Mensal
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(stats?.summary?.monthProjection || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Baseado em {stats?.period?.currentDay || 0} dias
                  </p>
                </CardContent>
              </Card>

              {/* Média Diária */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Média Diária
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(stats?.summary?.dailyAvg || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((stats?.summary?.totalOrders || 0) / (stats?.period?.currentDay || 1))} pedidos/dia
                  </p>
                </CardContent>
              </Card>

              {/* Recebido */}
              <Card className="bg-green-50/50 border-green-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">
                    Recebido
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrency(stats?.payment?.paidAmount || 0)}
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {stats?.payment?.paidOrders || 0} pedidos pagos ({stats?.payment?.paidPercentage?.toFixed(0) || 0}%)
                  </p>
                </CardContent>
              </Card>

              {/* Pendente (Fiado) */}
              <Card className="bg-yellow-50/50 border-yellow-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-700">
                    Pendente (Fiado)
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-700">
                    {formatCurrency(stats?.payment?.pendingAmount || 0)}
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">
                    {stats?.payment?.pendingOrders || 0} pedidos pendentes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Distribuição por Tipo e Dia da Semana */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Por Tipo de Atendimento */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Por Tipo de Atendimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Balcão */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">Balcão</span>
                          <Badge variant="secondary" className="text-xs">
                            {stats?.orderTypes?.counter?.count || 0} pedidos
                          </Badge>
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(stats?.orderTypes?.counter?.amount || 0)}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full transition-all"
                          style={{ width: `${stats?.orderTypes?.counter?.percentage || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Mesa */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">Mesa</span>
                          <Badge variant="secondary" className="text-xs">
                            {stats?.orderTypes?.table?.count || 0} pedidos
                          </Badge>
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(stats?.orderTypes?.table?.amount || 0)}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${stats?.orderTypes?.table?.percentage || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Delivery */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-green-500" />
                          <span className="font-medium">Delivery</span>
                          <Badge variant="secondary" className="text-xs">
                            {stats?.orderTypes?.delivery?.count || 0} pedidos
                          </Badge>
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(stats?.orderTypes?.delivery?.amount || 0)}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: `${stats?.orderTypes?.delivery?.percentage || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Por Dia da Semana */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Vendas por Dia da Semana</span>
                    {maxWeekdayAmount > 0 && (
                      <span className="text-xs font-normal text-muted-foreground">
                        Maior: {formatCurrency(maxWeekdayAmount)}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-1">
                    {/* Escala Y */}
                    <div className="flex flex-col justify-between text-[10px] text-muted-foreground pr-2 h-48">
                      <span>{maxWeekdayAmount > 0 ? formatCurrency(maxWeekdayAmount).replace("R$", "").trim() : "0"}</span>
                      <span>{maxWeekdayAmount > 0 ? formatCurrency(maxWeekdayAmount * 0.75).replace("R$", "").trim() : "0"}</span>
                      <span>{maxWeekdayAmount > 0 ? formatCurrency(maxWeekdayAmount * 0.5).replace("R$", "").trim() : "0"}</span>
                      <span>{maxWeekdayAmount > 0 ? formatCurrency(maxWeekdayAmount * 0.25).replace("R$", "").trim() : "0"}</span>
                      <span>0</span>
                    </div>
                    
                    {/* Gráfico */}
                    <div className="flex-1 flex items-end gap-2 h-48 border-l border-b border-muted pt-2">
                      {weekdayData?.labels.map((day, index) => {
                        const amount = weekdayData.amounts[index] || 0;
                        const height = maxWeekdayAmount > 0 ? (amount / maxWeekdayAmount) * 100 : 0;
                        const orders = weekdayData.orders[index] || 0;
                        const isWeekend = index === 0 || index === 6;

                        return (
                          <div
                            key={day}
                            className="flex-1 flex flex-col items-center"
                          >
                            {/* Valor acima da barra */}
                            <div className="text-[10px] font-medium text-muted-foreground mb-1 h-8 flex flex-col items-center justify-end">
                              <span className="text-green-600 font-semibold">
                                {amount > 0 ? `${(amount / 1000).toFixed(1)}k` : "0"}
                              </span>
                              <span className="text-[9px]">{orders}x</span>
                            </div>
                            
                            {/* Barra */}
                            <div className="w-full h-[calc(100%-40px)] relative group flex items-end">
                              <div
                                className={`w-full rounded-t-sm transition-all cursor-default ${
                                  isWeekend 
                                    ? "bg-gradient-to-t from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500" 
                                    : "bg-gradient-to-t from-green-500 to-green-300 hover:from-green-600 hover:to-green-400"
                                }`}
                                style={{ 
                                  height: `${Math.max(height, 2)}%`,
                                  minHeight: amount > 0 ? "8px" : "2px"
                                }}
                              />
                              {/* Tooltip */}
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                                <div className="font-semibold text-green-400">{formatCurrency(amount)}</div>
                                <div className="text-neutral-300">{orders} pedidos</div>
                                <div className="text-neutral-400 text-[10px]">
                                  Ticket: {orders > 0 ? formatCurrency(amount / orders) : "R$ 0"}
                                </div>
                              </div>
                            </div>
                            
                            {/* Label do dia */}
                            <span className={`text-xs font-medium mt-2 ${
                              isWeekend ? "text-emerald-600" : "text-muted-foreground"
                            }`}>
                              {day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Legenda */}
                  <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-green-500 to-green-300" />
                      <span>Dias úteis</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-emerald-600 to-emerald-400" />
                      <span>Fim de semana</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Mesas */}
            {stats?.topTables && stats.topTables.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Top Mesas do Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {stats.topTables.map((table, index) => (
                      <div
                        key={table.table}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? "bg-yellow-400 text-yellow-900" :
                          index === 1 ? "bg-gray-300 text-gray-700" :
                          index === 2 ? "bg-amber-600 text-white" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">Mesa {table.table}</p>
                          <p className="text-xs text-muted-foreground">
                            {table.count} pedidos
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {formatCurrency(table.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Tabela de Vendas */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <CardTitle>Últimos Pedidos</CardTitle>

              {/* Filtros */}
              {sales.length > 0 && (
                <div className="flex flex-wrap gap-3 items-center">
                  {/* Busca */}
                  <div className="relative flex-1 min-w-[180px] max-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar código, tipo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-9"
                    />
                  </div>

                  {/* Status */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px] h-9">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="PAID">Pago</SelectItem>
                      <SelectItem value="PENDING">Fiado</SelectItem>
                      <SelectItem value="CANCELLED">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Tipo */}
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[130px] h-9">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="COUNTER">Balcão</SelectItem>
                      <SelectItem value="TABLE">Mesa</SelectItem>
                      <SelectItem value="DELIVERY">Delivery</SelectItem>
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
                      {filteredSales.length} de {sales.length}
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
            ) : filteredSales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {sales.length === 0
                  ? "Nenhuma venda registrada neste mês. Os dados serão sincronizados via pipeline."
                  : "Nenhuma venda encontrada com os filtros atuais"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Código</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-center">Itens</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Abertura</TableHead>
                      <TableHead className="text-right">Duração</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-mono text-sm">
                          #{sale.externalId}
                        </TableCell>
                        <TableCell>{getTypeBadge(sale)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{sale.itemsCount}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600 text-right">
                          {formatCurrency(Number(sale.amount))}
                        </TableCell>
                        <TableCell>{getStatusBadge(sale.paymentStatus)}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(sale.openedAt).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {formatDuration(sale.duration)}
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

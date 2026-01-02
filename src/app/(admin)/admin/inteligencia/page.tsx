"use client";

import { useState, useEffect } from "react";
import { AdminOnly } from "@/components/admin/AdminOnly";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Brain,
  Calendar,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Sparkles,
  Target,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  Clock,
  Users,
  Flame,
  Snowflake,
  PartyPopper,
  Heart,
  Gift,
  Utensils,
  RefreshCw,
  ChevronRight,
  Zap,
  PieChart,
  LineChart,
  Thermometer,
  Droplets,
  CalendarDays,
} from "lucide-react";

interface WeatherForecast {
  date: string;
  tempMin: number;
  tempMax: number;
  precipitation: number;
  condition: string;
  conditionCode: number;
}

interface CalendarEvent {
  date: string;
  name: string;
  eventType: string;
  scope: string;
  impactExpected: string | null;
}

interface Prediction {
  date: string;
  dayOfWeek: number;
  predictedOrders: number;
  predictedRevenue: number;
  confidence: number;
}

interface Insight {
  type: "success" | "warning" | "info" | "opportunity";
  title: string;
  description: string;
  action?: string;
  priority: number;
}

interface Metrics {
  currentMonth: { orders: number; revenue: number; avgTicket: number };
  lastMonth: { orders: number; revenue: number };
  projection: { revenue: number; orders: number };
  growth: { revenue: number; orders: number };
}

interface IntelligenceData {
  weather?: {
    current: WeatherForecast | null;
    history: WeatherForecast[];
    forecast: WeatherForecast[];
  };
  calendar?: {
    upcoming: CalendarEvent[];
    nextHoliday: CalendarEvent | null;
    nextCommercial: CalendarEvent | null;
  };
  predictions?: {
    source: string;
    data: Prediction[];
  };
  insights?: Insight[];
  metrics?: Metrics;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function InteligenciaPage() {
  const [data, setData] = useState<IntelligenceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/intelligence");
      if (response.ok) {
        const result = await response.json();
        console.log("Dados de inteligência recebidos:", result);
        setData(result);
        setLastUpdate(new Date());
      } else {
        const errorData = await response.json();
        console.error("Erro na API:", response.status, errorData);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getWeatherIcon = (conditionCode: number) => {
    if (conditionCode >= 61 && conditionCode <= 99) return CloudRain;
    if (conditionCode >= 45 && conditionCode <= 57) return Cloud;
    return Sun;
  };

  const getDaysUntil = (dateInput: string | Date) => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "HOLIDAY":
        return Calendar;
      case "COMMERCIAL":
        return Gift;
      case "SEASONAL":
        return Sun;
      default:
        return PartyPopper;
    }
  };

  const InsightIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "opportunity":
        return <Sparkles className="h-5 w-5 text-purple-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
    }
  };

  // Calcular totais de previsão
  const predictionTotals = data?.predictions?.data?.reduce(
    (acc, p) => ({
      orders: acc.orders + p.predictedOrders,
      revenue: acc.revenue + p.predictedRevenue,
    }),
    { orders: 0, revenue: 0 }
  ) || { orders: 0, revenue: 0 };

  return (
    <AdminOnly>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8 text-purple-500" />
              Inteligência de Mercado
            </h1>
            <p className="text-muted-foreground">
              Previsões, insights e análises para tomada de decisão
              {lastUpdate && (
                <span className="ml-2 text-xs">
                  (Atualizado: {lastUpdate.toLocaleTimeString("pt-BR")})
                </span>
              )}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchData}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        {isLoading && !data ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto" />
              <p className="text-muted-foreground">Carregando inteligência...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="predictions" className="space-y-6">
            <TabsList className="grid w-full max-w-lg grid-cols-4">
              <TabsTrigger value="predictions" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Previsões
              </TabsTrigger>
              <TabsTrigger value="insights" className="gap-2">
                <Lightbulb className="h-4 w-4" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="weather" className="gap-2">
                <Sun className="h-4 w-4" />
                Clima
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2">
                <Calendar className="h-4 w-4" />
                Calendário
              </TabsTrigger>
            </TabsList>

            {/* Tab: Previsões */}
            <TabsContent value="predictions" className="space-y-6">
              {/* Métricas do Mês */}
              {data?.metrics && (
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-blue-500" />
                        Receita do Mês
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(data.metrics.currentMonth.revenue)}
                      </div>
                      <div className="flex items-center gap-1 text-sm mt-1">
                        {data.metrics.growth.revenue >= 0 ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">
                              +{data.metrics.growth.revenue.toFixed(1)}%
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">
                              {data.metrics.growth.revenue.toFixed(1)}%
                            </span>
                          </>
                        )}
                        <span className="text-muted-foreground">vs mês anterior</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-green-500" />
                        Pedidos do Mês
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {data.metrics.currentMonth.orders.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-sm mt-1">
                        {data.metrics.growth.orders >= 0 ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">
                              +{data.metrics.growth.orders.toFixed(1)}%
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">
                              {data.metrics.growth.orders.toFixed(1)}%
                            </span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-500" />
                        Ticket Médio
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(data.metrics.currentMonth.avgTicket)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Por pedido
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-700">
                        <Sparkles className="h-4 w-4" />
                        Projeção Mensal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-800">
                        {formatCurrency(data.metrics.projection.revenue)}
                      </div>
                      <p className="text-sm text-purple-600 mt-1">
                        ~{Math.round(data.metrics.projection.orders)} pedidos
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Previsões para os próximos dias */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-blue-500" />
                        Previsão de Demanda
                      </CardTitle>
                      <CardDescription>
                        Próximos 14 dias baseado em dados históricos e ML
                        {data?.predictions?.source === "historical_average" && (
                          <Badge variant="outline" className="ml-2">
                            Média Histórica
                          </Badge>
                        )}
                        {data?.predictions?.source === "ml_model" && (
                          <Badge className="ml-2 bg-purple-100 text-purple-700">
                            Modelo ML
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Previsto</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(predictionTotals.revenue)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ~{Math.round(predictionTotals.orders)} pedidos
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
                    {data?.predictions?.data?.slice(0, 14).map((pred, idx) => {
                      // Lidar com diferentes formatos de data
                      let date: Date;
                      if (typeof pred.date === 'string') {
                        // Se for string ISO completa, usar diretamente
                        // Se for apenas data (YYYY-MM-DD), adicionar horário
                        date = pred.date.includes('T') 
                          ? new Date(pred.date) 
                          : new Date(pred.date + "T12:00:00");
                      } else {
                        date = new Date(pred.date);
                      }
                      
                      const dayOfWeek = date.getDay();
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                      
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border text-center ${
                            isWeekend
                              ? "bg-orange-50 border-orange-200"
                              : "bg-muted/30"
                          }`}
                        >
                          <p className="text-xs text-muted-foreground">
                            {date.toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                            })}
                          </p>
                          <p className={`text-sm font-medium ${isWeekend ? "text-orange-600" : ""}`}>
                            {WEEKDAYS[dayOfWeek]}
                          </p>
                          <p className="text-lg font-bold mt-1">
                            {Math.round(pred.predictedOrders)}
                          </p>
                          <p className="text-xs text-muted-foreground">pedidos</p>
                          <p className="text-sm font-medium text-green-600 mt-1">
                            {formatCurrency(pred.predictedRevenue)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recomendações baseadas na previsão */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-500" />
                    Recomendações de Operação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">Escala de Equipe</h4>
                      </div>
                      <p className="text-sm text-blue-800">
                        Baseado na previsão, reforce a equipe nos fins de semana e sextas-feiras.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Utensils className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold text-green-900">Estoque</h4>
                      </div>
                      <p className="text-sm text-green-800">
                        Preveja ~{Math.round(predictionTotals.orders)} pedidos. Ajuste compras proporcionalmente.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold text-purple-900">Promoções</h4>
                      </div>
                      <p className="text-sm text-purple-800">
                        Considere promoções para dias de menor movimento durante a semana.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Insights */}
            <TabsContent value="insights" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Insights Automáticos
                  </CardTitle>
                  <CardDescription>
                    Análises geradas automaticamente com base nos seus dados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!data?.insights || data.insights.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum insight disponível no momento.</p>
                      <p className="text-sm">Continue coletando dados para gerar insights.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {data.insights.map((insight, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            insight.type === "success"
                              ? "bg-green-50 border-green-200"
                              : insight.type === "warning"
                              ? "bg-yellow-50 border-yellow-200"
                              : insight.type === "opportunity"
                              ? "bg-purple-50 border-purple-200"
                              : "bg-blue-50 border-blue-200"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <InsightIcon type={insight.type} />
                            <div className="flex-1">
                              <h4 className="font-semibold">{insight.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {insight.description}
                              </p>
                              {insight.action && (
                                <p className="text-sm font-medium mt-2 flex items-center gap-1">
                                  <ChevronRight className="h-3 w-3" />
                                  {insight.action}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Padrões identificados */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Padrões por Turno
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                        <Sun className="h-8 w-8 text-orange-500" />
                        <div className="flex-1">
                          <h4 className="font-medium">Almoço (11h-14h)</h4>
                          <p className="text-sm text-muted-foreground">
                            Geralmente mais rápido e tickets menores
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                        <Moon className="h-8 w-8 text-indigo-500" />
                        <div className="flex-1">
                          <h4 className="font-medium">Jantar (18h-22h)</h4>
                          <p className="text-sm text-muted-foreground">
                            Maior volume e tickets mais altos
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Melhores Dias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 rounded bg-yellow-50">
                        <span className="font-medium">🥇 Sexta-feira</span>
                        <Badge className="bg-yellow-100 text-yellow-700">Alto movimento</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <span className="font-medium">🥈 Sábado</span>
                        <Badge variant="outline">Pico</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-orange-50">
                        <span className="font-medium">🥉 Domingo</span>
                        <Badge variant="outline">Bom movimento</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab: Clima */}
            <TabsContent value="weather" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-orange-500" />
                    Previsão do Tempo - Bertioga
                  </CardTitle>
                  <CardDescription>
                    O clima impacta diretamente o movimento do estabelecimento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.weather?.forecast && data.weather.forecast.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-7">
                      {data.weather.forecast.map((day, idx) => {
                        const WeatherIcon = getWeatherIcon(day.conditionCode);
                        const dateStr = typeof day.date === 'string' && !day.date.includes('T') 
                          ? day.date + "T12:00:00" 
                          : day.date;
                        const date = new Date(dateStr);
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                        const isRainy = day.precipitation > 5;

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg border text-center ${
                              isRainy
                                ? "bg-blue-50 border-blue-200"
                                : isWeekend
                                ? "bg-orange-50 border-orange-200"
                                : "bg-muted/30"
                            }`}
                          >
                            <p className="text-xs text-muted-foreground">
                              {date.toLocaleDateString("pt-BR", {
                                weekday: "short",
                              })}
                            </p>
                            <p className="text-sm font-medium">
                              {date.toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                              })}
                            </p>
                            <WeatherIcon
                              className={`h-8 w-8 mx-auto my-2 ${
                                isRainy ? "text-blue-500" : "text-orange-500"
                              }`}
                            />
                            <div className="flex items-center justify-center gap-1 text-sm">
                              <Thermometer className="h-3 w-3" />
                              <span className="text-blue-600">{Math.round(day.tempMin)}°</span>
                              <span>/</span>
                              <span className="text-red-600">{Math.round(day.tempMax)}°</span>
                            </div>
                            {day.precipitation > 0 && (
                              <div className="flex items-center justify-center gap-1 text-xs text-blue-600 mt-1">
                                <Droplets className="h-3 w-3" />
                                {Math.round(day.precipitation)}mm
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Cloud className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Dados de clima não disponíveis</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Impacto do clima */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-500" />
                    Impacto do Clima nas Vendas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="h-5 w-5 text-orange-600" />
                        <h4 className="font-semibold text-orange-900">Dia Ensolarado</h4>
                      </div>
                      <p className="text-sm text-orange-800">
                        ↑ +20% no movimento. Turistas vão à praia e buscam alimentação.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CloudRain className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">Dia Chuvoso</h4>
                      </div>
                      <p className="text-sm text-blue-800">
                        ↓ -15% no movimento presencial. Considere promoções de delivery.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="h-5 w-5 text-red-600" />
                        <h4 className="font-semibold text-red-900">Calor Intenso (&gt;35°)</h4>
                      </div>
                      <p className="text-sm text-red-800">
                        ↑ Demanda por bebidas geladas. Prepare estoque adequado.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Calendário */}
            <TabsContent value="calendar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Próximos Eventos
                  </CardTitle>
                  <CardDescription>
                    Datas que podem impactar suas vendas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.calendar?.upcoming && data.calendar.upcoming.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {data.calendar.upcoming.map((event, idx) => {
                        const EventIcon = getEventIcon(event.eventType);
                        const dateStr = typeof event.date === 'string' && !event.date.includes('T') 
                          ? event.date + "T12:00:00" 
                          : event.date;
                        const date = new Date(dateStr);
                        const daysUntil = getDaysUntil(date);

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg border ${
                              event.impactExpected === "HIGH"
                                ? "bg-red-50 border-red-200"
                                : event.impactExpected === "MEDIUM"
                                ? "bg-yellow-50 border-yellow-200"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  event.impactExpected === "HIGH"
                                    ? "bg-red-100"
                                    : event.impactExpected === "MEDIUM"
                                    ? "bg-yellow-100"
                                    : "bg-gray-100"
                                }`}
                              >
                                <EventIcon
                                  className={`h-5 w-5 ${
                                    event.impactExpected === "HIGH"
                                      ? "text-red-600"
                                      : event.impactExpected === "MEDIUM"
                                      ? "text-yellow-600"
                                      : "text-gray-600"
                                  }`}
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold">{event.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {date.toLocaleDateString("pt-BR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                  })}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge
                                    variant="outline"
                                    className={
                                      event.impactExpected === "HIGH"
                                        ? "border-red-300 text-red-700"
                                        : event.impactExpected === "MEDIUM"
                                        ? "border-yellow-300 text-yellow-700"
                                        : "border-gray-300 text-gray-700"
                                    }
                                  >
                                    {daysUntil === 0
                                      ? "Hoje!"
                                      : daysUntil === 1
                                      ? "Amanhã"
                                      : `Em ${daysUntil} dias`}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {event.scope === "NATIONAL"
                                      ? "Nacional"
                                      : event.scope === "STATE"
                                      ? "Estadual"
                                      : "Municipal"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum evento próximo encontrado</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Estratégias por data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Estratégias por Data Comemorativa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-5 w-5 text-pink-500" />
                        <h4 className="font-semibold text-pink-900">Dia dos Namorados</h4>
                      </div>
                      <ul className="text-sm text-pink-800 space-y-1">
                        <li>• Combos para casais</li>
                        <li>• Decoração temática</li>
                        <li>• Sobremesas especiais</li>
                        <li>• Reservas antecipadas</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="h-5 w-5 text-blue-500" />
                        <h4 className="font-semibold text-blue-900">Dia das Mães/Pais</h4>
                      </div>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Promoções para famílias</li>
                        <li>• Menu especial</li>
                        <li>• Brindes para homenageados</li>
                        <li>• Escala reforçada</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="h-5 w-5 text-orange-500" />
                        <h4 className="font-semibold text-orange-900">Alta Temporada</h4>
                      </div>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>• Reforço de equipe</li>
                        <li>• Estoque ampliado</li>
                        <li>• Horário estendido</li>
                        <li>• Promoções específicas</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-purple-500" />
                        <h4 className="font-semibold text-purple-900">Black Friday</h4>
                      </div>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Descontos agressivos</li>
                        <li>• Combos exclusivos</li>
                        <li>• Divulgação antecipada</li>
                        <li>• Estoque reforçado</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminOnly>
  );
}

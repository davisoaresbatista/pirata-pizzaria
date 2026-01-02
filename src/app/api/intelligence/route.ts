import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface WeatherData {
  date: Date;
  tempMin: number;
  tempMax: number;
  tempAvg: number;
  precipitation: number;
  condition: string | null;
}

interface CalendarEvent {
  date: Date;
  name: string;
  eventType: string;
  scope: string;
  impactExpected: string | null;
}

interface DailySales {
  date: string;
  orders: number;
  revenue: number;
  avgTicket: number;
}

// GET - Retorna dados de inteligência (clima, feriados, previsões)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const response: Record<string, unknown> = {};

    // Dados meteorológicos
    if (type === "all" || type === "weather") {
      const weatherData = await prisma.weatherData.findMany({
        where: {
          date: {
            gte: thirtyDaysAgo,
          },
        },
        orderBy: {
          date: "desc",
        },
        take: 30,
        select: {
          id: true,
          date: true,
          tempMin: true,
          tempMax: true,
          tempAvg: true,
          precipitation: true,
          condition: true,
          conditionCode: true,
        },
      });

      response.weather = {
        current: weatherData[0] || null,
        history: weatherData,
        forecast: await getWeatherForecast(),
      };
    }

    // Feriados e eventos
    if (type === "all" || type === "calendar") {
      const upcomingEvents = await prisma.calendarEvent.findMany({
        where: {
          date: {
            gte: today,
          },
        },
        orderBy: {
          date: "asc",
        },
        take: 15,
      });

      response.calendar = {
        upcoming: upcomingEvents,
        nextHoliday: upcomingEvents.find((e) => e.eventType === "HOLIDAY"),
        nextCommercial: upcomingEvents.find((e) => e.eventType === "COMMERCIAL"),
      };
    }

    // Previsões do modelo (se existirem)
    if (type === "all" || type === "predictions") {
      const predictions = await prisma.prediction.findMany({
        where: {
          date: {
            gte: today,
          },
        },
        orderBy: {
          date: "asc",
        },
        take: 14,
      });

      // Se não há previsões do modelo, gerar previsões simples baseadas em histórico
      if (predictions.length === 0) {
        response.predictions = await generateSimplePredictions();
      } else {
        response.predictions = {
          source: "ml_model",
          data: predictions.map((p) => ({
            date: p.date,
            predictedOrders: p.predictedOrders,
            predictedRevenue: Number(p.predictedRevenue),
            confidence: p.confidence,
          })),
        };
      }
    }

    // Insights baseados em dados reais
    if (type === "all" || type === "insights") {
      response.insights = await generateInsights();
    }

    // Métricas de performance
    if (type === "all" || type === "metrics") {
      response.metrics = await getPerformanceMetrics();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro ao buscar dados de inteligência:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// Buscar previsão do tempo (Open-Meteo API)
async function getWeatherForecast() {
  try {
    const params = new URLSearchParams({
      latitude: "-23.8544",
      longitude: "-46.1389",
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
      timezone: "America/Sao_Paulo",
      forecast_days: "7",
    });

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params}`,
      { next: { revalidate: 3600 } } // Cache por 1 hora
    );

    if (!response.ok) return [];

    const data = await response.json();
    const daily = data.daily || {};

    const WMO_CODES: Record<number, string> = {
      0: "Céu limpo",
      1: "Predominantemente limpo",
      2: "Parcialmente nublado",
      3: "Nublado",
      45: "Neblina",
      51: "Garoa leve",
      61: "Chuva leve",
      63: "Chuva moderada",
      65: "Chuva forte",
      80: "Pancadas leves",
      81: "Pancadas moderadas",
      95: "Tempestade",
    };

    return (daily.time || []).map((date: string, idx: number) => ({
      date,
      tempMin: daily.temperature_2m_min?.[idx],
      tempMax: daily.temperature_2m_max?.[idx],
      precipitation: daily.precipitation_sum?.[idx] || 0,
      condition: WMO_CODES[daily.weathercode?.[idx]] || "Desconhecido",
      conditionCode: daily.weathercode?.[idx],
    }));
  } catch (error) {
    console.error("Erro ao buscar previsão:", error);
    return [];
  }
}

// Gerar previsões simples baseadas em histórico
async function generateSimplePredictions() {
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const recentOrders = await prisma.salesOrder.findMany({
    where: {
      deletedAt: null,
      openedAt: {
        gte: sixtyDaysAgo,
      },
    },
    select: {
      openedAt: true,
      amount: true,
    },
  });

  // Agrupar por dia da semana
  const ordersByDow: Record<number, { orders: number; revenue: number; days: Set<string> }> = {};
  
  recentOrders.forEach((order) => {
    const orderDate = new Date(order.openedAt);
    const dow = orderDate.getDay();
    const dateStr = orderDate.toISOString().split("T")[0];
    
    if (!ordersByDow[dow]) {
      ordersByDow[dow] = { orders: 0, revenue: 0, days: new Set() };
    }
    ordersByDow[dow].orders++;
    ordersByDow[dow].revenue += Number(order.amount);
    ordersByDow[dow].days.add(dateStr);
  });

  // Calcular média por dia da semana
  const avgByDow: Record<number, { orders: number; revenue: number }> = {};
  Object.entries(ordersByDow).forEach(([dow, data]) => {
    const numDays = data.days.size || 1;
    avgByDow[parseInt(dow)] = {
      orders: Math.round(data.orders / numDays),
      revenue: data.revenue / numDays,
    };
  });

  // Gerar previsão para próximos 14 dias
  const predictions = [];
  const today = new Date();

  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dow = date.getDay();

    const avg = avgByDow[dow] || { orders: 50, revenue: 5000 };

    predictions.push({
      date: date.toISOString().split("T")[0],
      dayOfWeek: dow,
      predictedOrders: avg.orders,
      predictedRevenue: avg.revenue,
      confidence: 0.7, // 70% confiança para previsão simples
    });
  }

  return {
    source: "historical_average",
    data: predictions,
  };
}

// Gerar insights automáticos
async function generateInsights() {
  const insights: Array<{
    type: "success" | "warning" | "info" | "opportunity";
    title: string;
    description: string;
    action?: string;
    priority: number;
  }> = [];

  // Buscar dados recentes - últimos 14 dias de vendas
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  
  const recentOrders = await prisma.salesOrder.findMany({
    where: {
      deletedAt: null,
      openedAt: {
        gte: fourteenDaysAgo,
      },
    },
    select: {
      openedAt: true,
      amount: true,
    },
  });

  // Agrupar por dia
  const salesByDate: Record<string, { orders: number; revenue: number }> = {};
  recentOrders.forEach((order) => {
    const dateStr = new Date(order.openedAt).toISOString().split("T")[0];
    if (!salesByDate[dateStr]) {
      salesByDate[dateStr] = { orders: 0, revenue: 0 };
    }
    salesByDate[dateStr].orders++;
    salesByDate[dateStr].revenue += Number(order.amount);
  });

  const recentSales = Object.entries(salesByDate)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => b.date.localeCompare(a.date));

  if (recentSales.length >= 7) {
    const lastWeek = recentSales.slice(0, 7);
    const previousWeek = recentSales.slice(7, 14);

    const lastWeekRevenue = lastWeek.reduce((s, d) => s + d.revenue, 0);
    const previousWeekRevenue = previousWeek.reduce((s, d) => s + d.revenue, 0);

    if (previousWeekRevenue > 0) {
      const change =
        ((lastWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100;

      if (change > 15) {
        insights.push({
          type: "success",
          title: "Crescimento expressivo!",
          description: `Vendas subiram ${change.toFixed(1)}% na última semana.`,
          priority: 1,
        });
      } else if (change < -15) {
        insights.push({
          type: "warning",
          title: "Queda nas vendas",
          description: `Vendas caíram ${Math.abs(change).toFixed(1)}% na última semana.`,
          action: "Analise os fatores e considere ações promocionais.",
          priority: 1,
        });
      }
    }
  }

  // Verificar próximos feriados
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const nextHoliday = await prisma.calendarEvent.findMany({
    where: {
      date: {
        gte: today,
        lte: nextWeek,
      },
      eventType: {
        in: ["HOLIDAY", "COMMERCIAL"],
      },
    },
    orderBy: {
      date: "asc",
    },
    take: 1,
  });

  if (nextHoliday.length > 0) {
    const holiday = nextHoliday[0];
    const daysUntil = Math.ceil(
      (new Date(holiday.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    insights.push({
      type: "info",
      title: `${holiday.name} em ${daysUntil} dia(s)`,
      description:
        holiday.impactExpected === "HIGH"
          ? "Prepare estoque e equipe para alta demanda!"
          : "Demanda esperada acima do normal.",
      action: "Verifique escala de funcionários e estoque.",
      priority: 2,
    });
  }

  // Verificar clima
  const forecast = await getWeatherForecast();
  const weekendForecast = forecast.filter((f: { date: string }) => {
    const date = new Date(f.date);
    return date.getDay() === 0 || date.getDay() === 6;
  });

  if (weekendForecast.length > 0) {
    const rainyWeekend = weekendForecast.some(
      (f: { precipitation: number }) => f.precipitation > 10
    );
    if (rainyWeekend) {
      insights.push({
        type: "warning",
        title: "Chuva prevista no fim de semana",
        description:
          "Previsão de chuva pode impactar movimento. Considere promoções de delivery.",
        priority: 3,
      });
    } else if (
      weekendForecast.some((f: { tempMax: number }) => f.tempMax > 30)
    ) {
      insights.push({
        type: "opportunity",
        title: "Fim de semana com calor!",
        description:
          "Tempo bom para praia. Prepare-se para movimento intenso!",
        priority: 3,
      });
    }
  }

  return insights.sort((a, b) => a.priority - b.priority);
}

// Métricas de performance
async function getPerformanceMetrics() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  endOfLastMonth.setHours(23, 59, 59, 999);

  // Vendas do mês atual
  const currentMonthOrders = await prisma.salesOrder.findMany({
    where: {
      deletedAt: null,
      openedAt: {
        gte: startOfMonth,
      },
    },
    select: {
      amount: true,
    },
  });

  // Vendas do mês passado
  const lastMonthOrders = await prisma.salesOrder.findMany({
    where: {
      deletedAt: null,
      openedAt: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
    select: {
      amount: true,
    },
  });

  const currentOrders = currentMonthOrders.length;
  const currentRevenue = currentMonthOrders.reduce((sum, o) => sum + Number(o.amount), 0);
  const lastOrders = lastMonthOrders.length;
  const lastRevenue = lastMonthOrders.reduce((sum, o) => sum + Number(o.amount), 0);

  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();
  const currentDay = now.getDate();
  const projectedRevenue = currentDay > 0 ? (currentRevenue / currentDay) * daysInMonth : 0;

  return {
    currentMonth: {
      orders: currentOrders,
      revenue: currentRevenue,
      avgTicket: currentOrders > 0 ? currentRevenue / currentOrders : 0,
    },
    lastMonth: {
      orders: lastOrders,
      revenue: lastRevenue,
    },
    projection: {
      revenue: projectedRevenue,
      orders: currentDay > 0 ? (currentOrders / currentDay) * daysInMonth : 0,
    },
    growth: {
      revenue: lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0,
      orders: lastOrders > 0 ? ((currentOrders - lastOrders) / lastOrders) * 100 : 0,
    },
  };
}


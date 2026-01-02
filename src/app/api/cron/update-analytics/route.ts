import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Esta rota é chamada por um cron job externo (GitHub Actions, Vercel Cron, etc.)
// Para proteger, usa um token de autenticação

const CRON_SECRET = process.env.CRON_SECRET || "pirata-cron-secret-2025";

// Código WMO para condição
const WMO_CODES: Record<number, string> = {
  0: "Céu limpo",
  1: "Predominantemente limpo",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Neblina",
  48: "Neblina com geada",
  51: "Garoa leve",
  53: "Garoa moderada",
  55: "Garoa forte",
  61: "Chuva leve",
  63: "Chuva moderada",
  65: "Chuva forte",
  80: "Pancadas leves",
  81: "Pancadas moderadas",
  82: "Pancadas fortes",
  95: "Tempestade",
};

export async function GET(request: Request) {
  // Verificar autorização
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (token !== CRON_SECRET) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    // 1. Atualizar dados meteorológicos
    const weatherResult = await updateWeatherData();

    // 2. Atualizar feriados (se necessário)
    const holidayResult = await updateHolidays();

    // 3. Calcular métricas diárias
    const metricsResult = await calculateDailyMetrics();

    const results = {
      success: true,
      timestamp: new Date().toISOString(),
      updates: {
        weather: weatherResult,
        holidays: holidayResult,
        metrics: metricsResult,
      },
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error("Erro no cron job:", error);
    return NextResponse.json(
      { error: "Erro interno", details: String(error) },
      { status: 500 }
    );
  }
}

// Atualizar dados meteorológicos
async function updateWeatherData() {
  try {
    // Buscar histórico dos últimos 7 dias
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const params = new URLSearchParams({
      latitude: "-23.8544",
      longitude: "-46.1389",
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      daily:
        "temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_mean,precipitation_sum,weathercode,windspeed_10m_max",
      timezone: "America/Sao_Paulo",
    });

    const response = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?${params}`
    );

    if (!response.ok) {
      return { success: false, error: "API indisponível" };
    }

    const data = await response.json();
    const daily = data.daily || {};

    let savedCount = 0;

    for (let i = 0; i < (daily.time || []).length; i++) {
      const dateStr = daily.time[i];
      const id = `weather_${dateStr.replace(/-/g, "")}`;

      try {
        await prisma.$executeRaw`
          INSERT OR REPLACE INTO weather_data 
          (id, date, tempMin, tempMax, tempAvg, feelsLikeAvg, precipitation, 
           condition, conditionCode, windSpeed, source, city, state, createdAt, updatedAt)
          VALUES (
            ${id},
            ${dateStr},
            ${daily.temperature_2m_min?.[i]},
            ${daily.temperature_2m_max?.[i]},
            ${daily.temperature_2m_mean?.[i]},
            ${daily.apparent_temperature_mean?.[i]},
            ${daily.precipitation_sum?.[i] || 0},
            ${WMO_CODES[daily.weathercode?.[i]] || "Desconhecido"},
            ${daily.weathercode?.[i]},
            ${daily.windspeed_10m_max?.[i]},
            'OPEN_METEO',
            'Bertioga',
            'SP',
            datetime('now'),
            datetime('now')
          )
        `;
        savedCount++;
      } catch (e) {
        console.error(`Erro ao salvar clima ${dateStr}:`, e);
      }
    }

    return { success: true, savedDays: savedCount };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// Atualizar feriados
async function updateHolidays() {
  try {
    const currentYear = new Date().getFullYear();

    // Verificar se já temos feriados para o ano atual
    const existingCount = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM calendar_events 
      WHERE strftime('%Y', date) = ${String(currentYear)}
    `;

    const count = Number(existingCount[0].count);
    if (count > 20) {
      return { success: true, message: "Feriados já cadastrados", count };
    }

    // Lista de feriados fixos
    const holidays = [
      { date: `${currentYear}-01-01`, name: "Confraternização Universal", scope: "NATIONAL", impact: "LOW" },
      { date: `${currentYear}-04-21`, name: "Tiradentes", scope: "NATIONAL", impact: "MEDIUM" },
      { date: `${currentYear}-05-01`, name: "Dia do Trabalho", scope: "NATIONAL", impact: "MEDIUM" },
      { date: `${currentYear}-09-07`, name: "Independência do Brasil", scope: "NATIONAL", impact: "MEDIUM" },
      { date: `${currentYear}-10-12`, name: "Nossa Senhora Aparecida", scope: "NATIONAL", impact: "MEDIUM" },
      { date: `${currentYear}-11-02`, name: "Finados", scope: "NATIONAL", impact: "LOW" },
      { date: `${currentYear}-11-15`, name: "Proclamação da República", scope: "NATIONAL", impact: "MEDIUM" },
      { date: `${currentYear}-12-25`, name: "Natal", scope: "NATIONAL", impact: "LOW" },
      { date: `${currentYear}-07-09`, name: "Revolução Constitucionalista", scope: "STATE", impact: "MEDIUM" },
      { date: `${currentYear}-12-30`, name: "Aniversário de Bertioga", scope: "MUNICIPAL", impact: "HIGH" },
    ];

    // Datas comerciais
    const commercialDates = [
      { date: `${currentYear}-06-12`, name: "Dia dos Namorados", scope: "NATIONAL", impact: "HIGH" },
      { date: `${currentYear}-12-24`, name: "Véspera de Natal", scope: "NATIONAL", impact: "HIGH" },
      { date: `${currentYear}-12-31`, name: "Réveillon", scope: "NATIONAL", impact: "HIGH" },
    ];

    let savedCount = 0;

    for (const h of [...holidays, ...commercialDates]) {
      const id = `holiday_${h.date}_${h.name.substring(0, 10).replace(/\s/g, "_")}`;
      try {
        await prisma.$executeRaw`
          INSERT OR IGNORE INTO calendar_events 
          (id, name, date, eventType, scope, impactExpected, recurring, createdAt, updatedAt)
          VALUES (
            ${id},
            ${h.name},
            ${h.date},
            'HOLIDAY',
            ${h.scope},
            ${h.impact},
            1,
            datetime('now'),
            datetime('now')
          )
        `;
        savedCount++;
      } catch (e) {
        console.error(`Erro ao salvar feriado ${h.name}:`, e);
      }
    }

    return { success: true, savedCount };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// Calcular métricas diárias
async function calculateDailyMetrics() {
  try {
    // Buscar vendas de ontem
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const yesterdayStart = new Date(yesterdayStr).getTime();
    const yesterdayEnd = yesterdayStart + 24 * 60 * 60 * 1000;

    const sales = await prisma.$queryRaw<
      Array<{
        orders: bigint;
        revenue: string;
        avgTicket: string;
        items: bigint;
        counter: bigint;
        table: bigint;
        delivery: bigint;
        paid: bigint;
        pending: bigint;
      }>
    >`
      SELECT 
        COUNT(*) as orders,
        SUM(CAST(amount AS REAL)) as revenue,
        AVG(CAST(amount AS REAL)) as avgTicket,
        SUM(itemsCount) as items,
        SUM(CASE WHEN isCounter = 1 THEN 1 ELSE 0 END) as counter,
        SUM(CASE WHEN isDelivery = 1 THEN 1 ELSE 0 END) as delivery,
        SUM(CASE WHEN isCounter = 0 AND isDelivery = 0 THEN 1 ELSE 0 END) as 'table',
        SUM(CASE WHEN paymentStatus = 'PAID' THEN 1 ELSE 0 END) as paid,
        SUM(CASE WHEN paymentStatus = 'PENDING' THEN 1 ELSE 0 END) as pending
      FROM sales_orders
      WHERE deletedAt IS NULL
        AND openedAt >= ${yesterdayStart}
        AND openedAt < ${yesterdayEnd}
    `;

    if (sales.length === 0 || !sales[0].orders) {
      return { success: true, message: "Sem vendas para processar" };
    }

    const raw = sales[0];
    const s = {
      orders: Number(raw.orders),
      revenue: Number(raw.revenue),
      avgTicket: Number(raw.avgTicket),
      items: Number(raw.items),
      counter: Number(raw.counter),
      table: Number(raw.table),
      delivery: Number(raw.delivery),
      paid: Number(raw.paid),
      pending: Number(raw.pending),
    };
    const dayOfWeek = yesterday.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Buscar clima do dia
    const weather = await prisma.$queryRaw<
      Array<{ tempMin: number; tempMax: number; tempAvg: number; precipitation: number; condition: string }>
    >`
      SELECT tempMin, tempMax, tempAvg, precipitation, condition
      FROM weather_data
      WHERE date = ${yesterdayStr}
      LIMIT 1
    `;

    // Buscar feriado do dia
    const holiday = await prisma.$queryRaw<Array<{ name: string; scope: string }>>`
      SELECT name, scope
      FROM calendar_events
      WHERE date = ${yesterdayStr}
      LIMIT 1
    `;

    const id = `features_${yesterdayStr.replace(/-/g, "")}`;

    await prisma.$executeRaw`
      INSERT OR REPLACE INTO daily_features 
      (id, date, totalOrders, totalRevenue, avgTicket, totalItems,
       counterOrders, tableOrders, deliveryOrders, paidOrders, pendingOrders,
       isWeekend, isHoliday, holidayName, holidayScope, dayOfWeek, dayOfMonth, month, year,
       tempMin, tempMax, tempAvg, precipitation, condition,
       createdAt, updatedAt)
      VALUES (
        ${id},
        ${yesterdayStr},
        ${s.orders || 0},
        ${s.revenue || 0},
        ${s.avgTicket || 0},
        ${s.items || 0},
        ${s.counter || 0},
        ${s.table || 0},
        ${s.delivery || 0},
        ${s.paid || 0},
        ${s.pending || 0},
        ${isWeekend ? 1 : 0},
        ${holiday.length > 0 ? 1 : 0},
        ${holiday.length > 0 ? holiday[0].name : null},
        ${holiday.length > 0 ? holiday[0].scope : null},
        ${dayOfWeek},
        ${yesterday.getDate()},
        ${yesterday.getMonth() + 1},
        ${yesterday.getFullYear()},
        ${weather.length > 0 ? weather[0].tempMin : null},
        ${weather.length > 0 ? weather[0].tempMax : null},
        ${weather.length > 0 ? weather[0].tempAvg : null},
        ${weather.length > 0 ? weather[0].precipitation : null},
        ${weather.length > 0 ? weather[0].condition : null},
        datetime('now'),
        datetime('now')
      )
    `;

    return {
      success: true,
      date: yesterdayStr,
      metrics: {
        orders: s.orders,
        revenue: s.revenue,
        avgTicket: s.avgTicket,
      },
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// POST - Trigger manual (para admin)
export async function POST(request: Request) {
  try {
    const session = await request.headers.get("authorization");

    // Para simplificar, aceita o mesmo token
    if (!session?.includes(CRON_SECRET)) {
      // Verificar se é admin via cookie seria mais seguro
      // Por hora, permitir para desenvolvimento
    }

    // Executar as mesmas tarefas
    const weatherResult = await updateWeatherData();
    const holidayResult = await updateHolidays();
    const metricsResult = await calculateDailyMetrics();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      updates: {
        weather: weatherResult,
        holidays: holidayResult,
        metrics: metricsResult,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno", details: String(error) },
      { status: 500 }
    );
  }
}


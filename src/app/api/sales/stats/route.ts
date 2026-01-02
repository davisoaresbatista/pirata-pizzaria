import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Estatísticas de vendas agregadas
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const compareWithPrevious = searchParams.get("compare") === "true";

    // Datas do período atual
    let startDate: Date;
    let endDate: Date;
    
    if (month) {
      const [year, monthNum] = month.split("-");
      startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);
    } else {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    // Buscar vendas do período
    const sales = await prisma.salesOrder.findMany({
      where: {
        openedAt: {
          gte: startDate,
          lte: endDate,
        },
        deletedAt: null,
      },
    });

    // Calcular estatísticas
    const totalOrders = sales.length;
    const totalAmount = sales.reduce((sum, s) => sum + Number(s.amount), 0);
    const totalItems = sales.reduce((sum, s) => sum + s.itemsCount, 0);
    const avgOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;
    const avgItemsPerOrder = totalOrders > 0 ? totalItems / totalOrders : 0;

    // Por status de pagamento
    const paidOrders = sales.filter(s => s.paymentStatus === "PAID");
    const pendingOrders = sales.filter(s => s.paymentStatus === "PENDING");
    const paidAmount = paidOrders.reduce((sum, s) => sum + Number(s.amount), 0);
    const pendingAmount = pendingOrders.reduce((sum, s) => sum + Number(s.amount), 0);

    // Por tipo
    const counterOrders = sales.filter(s => s.isCounter);
    const tableOrders = sales.filter(s => !s.isCounter && !s.isDelivery);
    const deliveryOrders = sales.filter(s => s.isDelivery);

    // Tempo médio de atendimento (em segundos)
    const ordersWithDuration = sales.filter(s => s.duration && s.duration > 0);
    const avgDuration = ordersWithDuration.length > 0 
      ? ordersWithDuration.reduce((sum, s) => sum + (s.duration || 0), 0) / ordersWithDuration.length 
      : 0;

    // Vendas por dia da semana
    const salesByWeekday = [0, 0, 0, 0, 0, 0, 0]; // Dom a Sáb
    const amountByWeekday = [0, 0, 0, 0, 0, 0, 0];
    sales.forEach(s => {
      const day = new Date(s.openedAt).getDay();
      salesByWeekday[day]++;
      amountByWeekday[day] += Number(s.amount);
    });

    // Vendas por hora do dia
    const salesByHour = new Array(24).fill(0);
    const amountByHour = new Array(24).fill(0);
    sales.forEach(s => {
      const hour = new Date(s.openedAt).getHours();
      salesByHour[hour]++;
      amountByHour[hour] += Number(s.amount);
    });

    // Top mesas (por quantidade de pedidos)
    const tableStats = sales
      .filter(s => s.tableNumber)
      .reduce((acc, s) => {
        const table = s.tableNumber!;
        if (!acc[table]) {
          acc[table] = { count: 0, amount: 0 };
        }
        acc[table].count++;
        acc[table].amount += Number(s.amount);
        return acc;
      }, {} as Record<number, { count: number; amount: number }>);

    const topTables = Object.entries(tableStats)
      .map(([table, stats]) => ({
        table: parseInt(table),
        ...stats,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Vendas por dia do mês
    const salesByDay: Record<string, { count: number; amount: number }> = {};
    sales.forEach(s => {
      const day = new Date(s.openedAt).toISOString().split('T')[0];
      if (!salesByDay[day]) {
        salesByDay[day] = { count: 0, amount: 0 };
      }
      salesByDay[day].count++;
      salesByDay[day].amount += Number(s.amount);
    });

    // Comparação com período anterior
    let previousStats = null;
    if (compareWithPrevious) {
      const prevMonth = new Date(startDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const prevEndDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0, 23, 59, 59);

      const prevSales = await prisma.salesOrder.findMany({
        where: {
          openedAt: {
            gte: prevMonth,
            lte: prevEndDate,
          },
          deletedAt: null,
        },
      });

      const prevTotal = prevSales.reduce((sum, s) => sum + Number(s.amount), 0);
      const prevOrders = prevSales.length;

      previousStats = {
        totalAmount: prevTotal,
        totalOrders: prevOrders,
        avgOrderValue: prevOrders > 0 ? prevTotal / prevOrders : 0,
        amountChange: prevTotal > 0 ? ((totalAmount - prevTotal) / prevTotal) * 100 : 0,
        ordersChange: prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0,
      };
    }

    // Dias restantes do mês e projeção
    const today = new Date();
    const daysInMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
    const currentDay = today.getMonth() === startDate.getMonth() ? today.getDate() : daysInMonth;
    const dailyAvg = currentDay > 0 ? totalAmount / currentDay : 0;
    const monthProjection = dailyAvg * daysInMonth;

    return NextResponse.json({
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        daysInMonth,
        currentDay,
      },
      summary: {
        totalOrders,
        totalAmount,
        totalItems,
        avgOrderValue,
        avgItemsPerOrder,
        dailyAvg,
        monthProjection,
      },
      payment: {
        paidOrders: paidOrders.length,
        paidAmount,
        pendingOrders: pendingOrders.length,
        pendingAmount,
        paidPercentage: totalOrders > 0 ? (paidOrders.length / totalOrders) * 100 : 0,
      },
      orderTypes: {
        counter: {
          count: counterOrders.length,
          amount: counterOrders.reduce((sum, s) => sum + Number(s.amount), 0),
          percentage: totalOrders > 0 ? (counterOrders.length / totalOrders) * 100 : 0,
        },
        table: {
          count: tableOrders.length,
          amount: tableOrders.reduce((sum, s) => sum + Number(s.amount), 0),
          percentage: totalOrders > 0 ? (tableOrders.length / totalOrders) * 100 : 0,
        },
        delivery: {
          count: deliveryOrders.length,
          amount: deliveryOrders.reduce((sum, s) => sum + Number(s.amount), 0),
          percentage: totalOrders > 0 ? (deliveryOrders.length / totalOrders) * 100 : 0,
        },
      },
      timing: {
        avgDuration,
        avgDurationFormatted: formatDuration(avgDuration),
      },
      distribution: {
        byWeekday: {
          labels: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
          orders: salesByWeekday,
          amounts: amountByWeekday,
        },
        byHour: {
          labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
          orders: salesByHour,
          amounts: amountByHour,
        },
        byDay: salesByDay,
      },
      topTables,
      comparison: previousStats,
    });
  } catch (error) {
    console.error("Erro ao calcular estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao calcular estatísticas" },
      { status: 500 }
    );
  }
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}


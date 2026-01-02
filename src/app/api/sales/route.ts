import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Listar vendas com filtros
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const month = searchParams.get("month");
    const status = searchParams.get("status");
    const orderType = searchParams.get("orderType");
    const limit = searchParams.get("limit");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      deletedAt: null, // Exclui registros soft-deleted
    };

    // Filtro por mês (formato YYYY-MM)
    if (month) {
      const [year, monthNum] = month.split("-");
      const start = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const end = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);
      where.openedAt = {
        gte: start,
        lte: end,
      };
    }
    
    // Filtro por range de datas
    if (startDate && endDate) {
      where.openedAt = {
        gte: new Date(startDate),
        lte: new Date(endDate + "T23:59:59"),
      };
    }

    // Filtro por status
    if (status && status !== "all") {
      where.status = status;
    }

    // Filtro por tipo de pedido
    if (orderType && orderType !== "all") {
      if (orderType === "COUNTER") {
        where.isCounter = true;
      } else if (orderType === "TABLE") {
        where.isCounter = false;
        where.isDelivery = false;
      } else if (orderType === "DELIVERY") {
        where.isDelivery = true;
      }
    }

    const sales = await prisma.salesOrder.findMany({
      where,
      orderBy: { openedAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Erro ao buscar vendas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar vendas" },
      { status: 500 }
    );
  }
}

// POST - Criar/Sincronizar vendas (usado pelo pipeline)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    
    // Suporta envio único ou em lote
    const orders = Array.isArray(body) ? body : [body];
    
    const results = await Promise.all(
      orders.map(async (order) => {
        const {
          externalId,
          origin,
          orderType,
          itemsCount,
          amount,
          status,
          openedAt,
          closedAt,
          duration,
          unit,
          paymentMethod,
        } = order;

        // Parse do tipo para extrair número da mesa e flags
        const isCounter = orderType?.toLowerCase().includes("balcão") || false;
        const isDelivery = orderType?.toLowerCase().includes("delivery") || false;
        
        // Extrai número da mesa (ex: "Mesas/Comandas 3" -> 3)
        let tableNumber = null;
        const tableMatch = orderType?.match(/(\d+)$/);
        if (tableMatch) {
          tableNumber = parseInt(tableMatch[1]);
        }

        // Parse de duração (ex: "6h 4m 24s" -> segundos)
        let durationSeconds = null;
        if (duration) {
          if (typeof duration === "number") {
            durationSeconds = duration;
          } else if (typeof duration === "string") {
            const hours = duration.match(/(\d+)h/)?.[1] || "0";
            const minutes = duration.match(/(\d+)m/)?.[1] || "0";
            const seconds = duration.match(/(\d+)s/)?.[1] || "0";
            durationSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
          }
        }

        // Determina status de pagamento
        let paymentStatus = "PAID";
        if (status?.toLowerCase().includes("fiado") || status?.toLowerCase().includes("pendente")) {
          paymentStatus = "PENDING";
        } else if (status?.toLowerCase().includes("cancel")) {
          paymentStatus = "CANCELLED";
        }

        // Upsert - atualiza se já existe (baseado no externalId)
        return prisma.salesOrder.upsert({
          where: { externalId: String(externalId) },
          update: {
            origin: origin || "Desconhecido",
            orderType: orderType || "Outros",
            itemsCount: parseInt(itemsCount) || 0,
            amount: parseFloat(amount) || 0,
            status: status || "Desconhecido",
            paymentStatus,
            openedAt: new Date(openedAt),
            closedAt: closedAt ? new Date(closedAt) : null,
            duration: durationSeconds,
            unit: unit || "PIRATA PIZZARIA",
            tableNumber,
            isCounter,
            isDelivery,
            paymentMethod: paymentMethod || null,
            syncedAt: new Date(),
          },
          create: {
            externalId: String(externalId),
            origin: origin || "Desconhecido",
            orderType: orderType || "Outros",
            itemsCount: parseInt(itemsCount) || 0,
            amount: parseFloat(amount) || 0,
            status: status || "Desconhecido",
            paymentStatus,
            openedAt: new Date(openedAt),
            closedAt: closedAt ? new Date(closedAt) : null,
            duration: durationSeconds,
            unit: unit || "PIRATA PIZZARIA",
            tableNumber,
            isCounter,
            isDelivery,
            paymentMethod: paymentMethod || null,
          },
        });
      })
    );

    return NextResponse.json(
      { 
        message: `${results.length} registro(s) sincronizado(s)`,
        count: results.length,
        orders: results,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao sincronizar vendas:", error);
    return NextResponse.json(
      { error: "Erro ao sincronizar vendas" },
      { status: 500 }
    );
  }
}


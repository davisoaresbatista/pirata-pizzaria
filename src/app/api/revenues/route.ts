import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    const where: Record<string, unknown> = {};
    
    if (month) {
      const [year, monthNum] = month.split("-");
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const revenues = await prisma.revenue.findMany({
      where,
      orderBy: { date: "desc" },
    });

    return NextResponse.json(revenues);
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar receitas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { source, description, amount, date, notes } = body;

    if (!source || !amount || !date) {
      return NextResponse.json(
        { error: "Fonte, valor e data são obrigatórios" },
        { status: 400 }
      );
    }

    const revenue = await prisma.revenue.create({
      data: {
        source,
        description: description || null,
        amount: parseFloat(amount),
        date: new Date(date),
        notes: notes || null,
      },
    });

    return NextResponse.json(revenue, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar receita:", error);
    return NextResponse.json(
      { error: "Erro ao criar receita" },
      { status: 500 }
    );
  }
}


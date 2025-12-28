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
    const status = searchParams.get("status");
    const employeeId = searchParams.get("employeeId");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (employeeId) where.employeeId = employeeId;

    const advances = await prisma.advance.findMany({
      where,
      orderBy: { requestDate: "desc" },
      include: {
        employee: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    return NextResponse.json(advances);
  } catch (error) {
    console.error("Erro ao buscar adiantamentos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar adiantamentos" },
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
    const { employeeId, amount, requestDate, notes } = body;

    if (!employeeId || !amount) {
      return NextResponse.json(
        { error: "Funcionário e valor são obrigatórios" },
        { status: 400 }
      );
    }

    const advance = await prisma.advance.create({
      data: {
        employeeId,
        amount: parseFloat(amount),
        requestDate: requestDate ? new Date(requestDate) : new Date(),
        notes: notes || null,
        status: "PENDING",
      },
      include: {
        employee: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(advance, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar adiantamento:", error);
    return NextResponse.json(
      { error: "Erro ao criar adiantamento" },
      { status: 500 }
    );
  }
}


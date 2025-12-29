import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const employees = await prisma.employee.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { advances: true },
        },
      },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar funcionários" },
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
    const { 
      name, role, phone, document, hireDate,
      worksLunch, lunchPaymentType, lunchValue, lunchStartTime, lunchEndTime,
      worksDinner, dinnerPaymentType, dinnerWeekdayValue, dinnerWeekendValue, dinnerStartTime, dinnerEndTime
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        role: role || "Funcionário",
        phone: phone || null,
        document: document || null,
        hireDate: hireDate ? new Date(hireDate) : new Date(),
        worksLunch: worksLunch || false,
        lunchPaymentType: lunchPaymentType || "SHIFT",
        lunchValue: parseFloat(lunchValue) || 0,
        lunchStartTime: lunchStartTime || null,
        lunchEndTime: lunchEndTime || null,
        worksDinner: worksDinner !== false,
        dinnerPaymentType: dinnerPaymentType || "SHIFT",
        dinnerWeekdayValue: parseFloat(dinnerWeekdayValue) || 0,
        dinnerWeekendValue: parseFloat(dinnerWeekendValue) || 0,
        dinnerStartTime: dinnerStartTime || null,
        dinnerEndTime: dinnerEndTime || null,
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar funcionário:", error);
    return NextResponse.json(
      { error: "Erro ao criar funcionário" },
      { status: 500 }
    );
  }
}


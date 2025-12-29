import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessTimeEntries, canCreateRetroactiveEntry, type UserRole } from "@/lib/permissions";

// Função para verificar se é fim de semana
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Domingo, 6 = Sábado
}

interface EmployeeWithValues {
  lunchPaymentType: string;
  lunchValue: unknown;
  lunchStartTime: string | null;
  lunchEndTime: string | null;
  dinnerPaymentType: string;
  dinnerWeekdayValue: unknown;
  dinnerWeekendValue: unknown;
  dinnerStartTime: string | null;
  dinnerEndTime: string | null;
}

// Função para calcular horas entre dois horários
function calculateHours(startTime: string | null, endTime: string | null): number {
  if (!startTime || !endTime) return 0;
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;
  
  // Se o horário de saída for menor que entrada, significa que cruzou meia-noite
  // Ex: 17:00 → 00:00 (ou 17:00 → 24:00)
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60; // Adiciona 24 horas
  }
  
  return (endMinutes - startMinutes) / 60;
}

// Função para calcular valores do turno usando tipo de pagamento ESPECÍFICO de cada turno
function calculateShiftValuesFromEmployee(
  date: Date, 
  workedLunch: boolean, 
  workedDinner: boolean,
  employee: EmployeeWithValues
) {
  let lunchValue = 0;
  let dinnerValue = 0;
  
  // Calcular valor do ALMOÇO baseado no tipo específico do almoço
  if (workedLunch) {
    const lunchType = employee.lunchPaymentType || "SHIFT";
    
    if (lunchType === "HOUR") {
      const hours = calculateHours(employee.lunchStartTime, employee.lunchEndTime);
      lunchValue = hours * (Number(employee.lunchValue) || 0);
    } else if (lunchType === "WEEK") {
      // Valor semanal dividido por dias (considera 6 dias por semana)
      lunchValue = (Number(employee.lunchValue) || 0) / 6;
    } else if (lunchType === "MONTH") {
      // Valor mensal dividido por dias (considera 26 dias úteis por mês)
      lunchValue = (Number(employee.lunchValue) || 0) / 26;
    } else if (lunchType === "DAY" || lunchType === "SHIFT") {
      lunchValue = Number(employee.lunchValue) || 0;
    }
  }
  
  // Calcular valor do JANTAR baseado no tipo específico do jantar
  if (workedDinner) {
    const dinnerType = employee.dinnerPaymentType || "SHIFT";
    const weekend = isWeekend(date);
    // Para MONTH, usa o valor de weekday como salário mensal
    const baseValue = dinnerType === "MONTH"
      ? Number(employee.dinnerWeekdayValue) || 0
      : (weekend 
          ? Number(employee.dinnerWeekendValue) || 0
          : Number(employee.dinnerWeekdayValue) || 0);
    
    if (dinnerType === "HOUR") {
      const hours = calculateHours(employee.dinnerStartTime, employee.dinnerEndTime);
      dinnerValue = hours * baseValue;
    } else if (dinnerType === "WEEK") {
      // Valor semanal dividido por dias (considera 6 dias por semana)
      dinnerValue = baseValue / 6;
    } else if (dinnerType === "MONTH") {
      // Valor mensal dividido por dias (considera 26 dias por mês)
      dinnerValue = baseValue / 26;
    } else if (dinnerType === "DAY" || dinnerType === "SHIFT") {
      dinnerValue = baseValue;
    }
  }
  
  return { lunchValue, dinnerValue, totalValue: lunchValue + dinnerValue };
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const userRole = (session.user?.role as UserRole) || "MANAGER";
  
  if (!canAccessTimeEntries(userRole)) {
    return NextResponse.json({ error: "Sem permissão para acessar registros de ponto" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const employeeId = searchParams.get("employeeId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Record<string, unknown> = {};

    if (date) {
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);
      where.date = {
        gte: dateStart,
        lte: dateEnd,
      };
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.date = {
        gte: start,
        lte: end,
      };
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            role: true,
            worksLunch: true,
            worksDinner: true,
          },
        },
      },
      orderBy: [{ date: "desc" }, { employee: { name: "asc" } }],
    });

    return NextResponse.json(timeEntries);
  } catch (error) {
    console.error("Erro ao buscar registros de ponto:", error);
    return NextResponse.json(
      { error: "Erro ao buscar registros de ponto" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const userRole = (session.user?.role as UserRole) || "MANAGER";
  const userId = session.user?.id;

  if (!canAccessTimeEntries(userRole)) {
    return NextResponse.json({ error: "Sem permissão para registrar ponto" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { 
      employeeId, date, workedLunch, workedDinner, status, notes,
      clockInLunch, clockOutLunch, clockInDinner, clockOutDinner
    } = body;

    if (!employeeId || !date) {
      return NextResponse.json(
        { error: "Funcionário e data são obrigatórios" },
        { status: 400 }
      );
    }

    const entryDate = new Date(date);
    entryDate.setHours(12, 0, 0, 0); // Normaliza para meio-dia

    // Verificar permissão para criar registro retroativo
    const permission = canCreateRetroactiveEntry(userRole, entryDate);
    if (!permission.allowed) {
      return NextResponse.json({ error: permission.reason }, { status: 403 });
    }

    // Verificar se já existe registro para este funcionário nesta data
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    const existingEntry = await prisma.timeEntry.findFirst({
      where: {
        employeeId,
        date: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: "Já existe um registro de ponto para este funcionário nesta data" },
        { status: 400 }
      );
    }

    // Buscar funcionário para verificar tipo de pagamento e valores
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Funcionário não encontrado" },
        { status: 404 }
      );
    }

    // Calcular valores usando os valores específicos do funcionário
    const values = calculateShiftValuesFromEmployee(
      entryDate, 
      workedLunch || false, 
      workedDinner || false,
      employee
    );

    const timeEntry = await prisma.timeEntry.create({
      data: {
        employeeId,
        date: entryDate,
        workedLunch: workedLunch || false,
        workedDinner: workedDinner || false,
        clockInLunch: clockInLunch || null,
        clockOutLunch: clockOutLunch || null,
        clockInDinner: clockInDinner || null,
        clockOutDinner: clockOutDinner || null,
        status: status || "PRESENT",
        notes: notes || null,
        lunchValue: values.lunchValue,
        dinnerValue: values.dinnerValue,
        totalValue: values.totalValue,
        createdById: userId,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            role: true,
            worksLunch: true,
            worksDinner: true,
          },
        },
      },
    });

    return NextResponse.json(timeEntry, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar registro de ponto:", error);
    return NextResponse.json(
      { error: "Erro ao criar registro de ponto" },
      { status: 500 }
    );
  }
}

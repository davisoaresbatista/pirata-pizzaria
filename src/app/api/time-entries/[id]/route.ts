import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessTimeEntries, canEditTimeEntry, canDeleteTimeEntry, type UserRole } from "@/lib/permissions";

// Função para verificar se é fim de semana
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
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

// Função para calcular valores do turno
function calculateShiftValuesFromEmployee(
  date: Date, 
  workedLunch: boolean, 
  workedDinner: boolean,
  employee: EmployeeWithValues
) {
  let lunchValue = 0;
  let dinnerValue = 0;
  
  if (workedLunch) {
    const lunchType = employee.lunchPaymentType || "SHIFT";
    
    if (lunchType === "HOUR") {
      const hours = calculateHours(employee.lunchStartTime, employee.lunchEndTime);
      lunchValue = hours * (Number(employee.lunchValue) || 0);
    } else if (lunchType === "WEEK") {
      lunchValue = (Number(employee.lunchValue) || 0) / 6;
    } else if (lunchType === "MONTH") {
      lunchValue = (Number(employee.lunchValue) || 0) / 26;
    } else {
      lunchValue = Number(employee.lunchValue) || 0;
    }
  }
  
  if (workedDinner) {
    const dinnerType = employee.dinnerPaymentType || "SHIFT";
    const weekend = isWeekend(date);
    const baseValue = dinnerType === "MONTH"
      ? Number(employee.dinnerWeekdayValue) || 0
      : (weekend 
          ? Number(employee.dinnerWeekendValue) || 0
          : Number(employee.dinnerWeekdayValue) || 0);
    
    if (dinnerType === "HOUR") {
      const hours = calculateHours(employee.dinnerStartTime, employee.dinnerEndTime);
      dinnerValue = hours * baseValue;
    } else if (dinnerType === "WEEK") {
      dinnerValue = baseValue / 6;
    } else if (dinnerType === "MONTH") {
      dinnerValue = baseValue / 26;
    } else {
      dinnerValue = baseValue;
    }
  }
  
  // Arredondar para 2 casas decimais
  lunchValue = Math.round(lunchValue * 100) / 100;
  dinnerValue = Math.round(dinnerValue * 100) / 100;
  
  return { lunchValue, dinnerValue, totalValue: lunchValue + dinnerValue };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const userRole = (session.user?.role as UserRole) || "MANAGER";
  
  if (!canAccessTimeEntries(userRole)) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  try {
    const { id } = await params;

    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id },
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

    if (!timeEntry) {
      return NextResponse.json({ error: "Registro não encontrado" }, { status: 404 });
    }

    return NextResponse.json(timeEntry);
  } catch (error) {
    console.error("Erro ao buscar registro de ponto:", error);
    return NextResponse.json({ error: "Erro ao buscar registro de ponto" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const userRole = (session.user?.role as UserRole) || "MANAGER";
  const userId = session.user?.id;

  if (!canAccessTimeEntries(userRole)) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      workedLunch, workedDinner, status, notes,
      clockInLunch, clockOutLunch, clockInDinner, clockOutDinner
    } = body;

    // Buscar registro existente
    const existing = await prisma.timeEntry.findUnique({
      where: { id },
      include: { employee: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Registro não encontrado" }, { status: 404 });
    }

    // Verificar permissão de edição baseada na data
    const permission = canEditTimeEntry(userRole, existing.date);
    if (!permission.allowed) {
      return NextResponse.json({ error: permission.reason }, { status: 403 });
    }

    // Calcular valores
    const values = calculateShiftValuesFromEmployee(
      existing.date, 
      workedLunch ?? existing.workedLunch, 
      workedDinner ?? existing.workedDinner,
      existing.employee
    );

    const timeEntry = await prisma.timeEntry.update({
      where: { id },
      data: {
        workedLunch: workedLunch ?? existing.workedLunch,
        workedDinner: workedDinner ?? existing.workedDinner,
        clockInLunch: clockInLunch ?? existing.clockInLunch,
        clockOutLunch: clockOutLunch ?? existing.clockOutLunch,
        clockInDinner: clockInDinner ?? existing.clockInDinner,
        clockOutDinner: clockOutDinner ?? existing.clockOutDinner,
        status: status || existing.status,
        notes: notes ?? existing.notes,
        lunchValue: values.lunchValue,
        dinnerValue: values.dinnerValue,
        totalValue: values.totalValue,
        updatedById: userId,
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

    return NextResponse.json(timeEntry);
  } catch (error) {
    console.error("Erro ao atualizar registro de ponto:", error);
    return NextResponse.json({ error: "Erro ao atualizar registro de ponto" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const userRole = (session.user?.role as UserRole) || "MANAGER";

  // Somente admin pode deletar
  if (!canDeleteTimeEntry(userRole)) {
    return NextResponse.json({ error: "Somente administradores podem excluir registros de ponto" }, { status: 403 });
  }

  try {
    const { id } = await params;

    await prisma.timeEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir registro de ponto:", error);
    return NextResponse.json({ error: "Erro ao excluir registro de ponto" }, { status: 500 });
  }
}

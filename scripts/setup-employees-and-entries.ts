import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configurações de funcionários com turnos e valores
const employeeConfigs: Record<string, {
  worksLunch: boolean;
  worksDinner: boolean;
  lunchPaymentType: string;
  lunchValue: number;
  dinnerPaymentType: string;
  dinnerWeekdayValue: number;
  dinnerWeekendValue: number;
}> = {
  // Funcionários que trabalham só no almoço
  "Henry": { worksLunch: true, worksDinner: false, lunchPaymentType: "MONTH", lunchValue: 2000, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 0, dinnerWeekendValue: 0 },
  "Cleia": { worksLunch: true, worksDinner: false, lunchPaymentType: "SHIFT", lunchValue: 60, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 0, dinnerWeekendValue: 0 },
  "Lais": { worksLunch: true, worksDinner: false, lunchPaymentType: "SHIFT", lunchValue: 55, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 0, dinnerWeekendValue: 0 },
  
  // Funcionários que trabalham só no jantar
  "Rebeca": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 12, dinnerWeekendValue: 15 },
  "Vinicius": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 70, dinnerWeekendValue: 90 },
  "Nayara": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 65, dinnerWeekendValue: 85 },
  "Stephanie": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 60, dinnerWeekendValue: 80 },
  "Ligia": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 65, dinnerWeekendValue: 85 },
  "Marina": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 60, dinnerWeekendValue: 80 },
  "Vitoria": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 55, dinnerWeekendValue: 75 },
  "Duda": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 55, dinnerWeekendValue: 75 },
  "Duda Loira": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 55, dinnerWeekendValue: 75 },
  "Lara": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 55, dinnerWeekendValue: 75 },
  "Gil": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 80, dinnerWeekendValue: 100 },
  "Felipe": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 75, dinnerWeekendValue: 95 },
  "Cleber": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 80, dinnerWeekendValue: 100 },
  "Silva": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 70, dinnerWeekendValue: 90 },
  "Mudinho": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 60, dinnerWeekendValue: 80 },
  "Miguel": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 65, dinnerWeekendValue: 85 },
  
  // Motoboys - só jantar
  "Miqueias Moto": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 50, dinnerWeekendValue: 70 },
  "Valdeir Moto": { worksLunch: false, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 0, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 50, dinnerWeekendValue: 70 },
  
  // Funcionários que trabalham nos dois turnos
  "Isaias": { worksLunch: true, worksDinner: true, lunchPaymentType: "HOUR", lunchValue: 10, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 12, dinnerWeekendValue: 15 },
  "Kaio": { worksLunch: true, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 50, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 60, dinnerWeekendValue: 80 },
  "Caio": { worksLunch: true, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 50, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 60, dinnerWeekendValue: 80 },
  "Andressa": { worksLunch: true, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 55, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 65, dinnerWeekendValue: 85 },
  "Bianca": { worksLunch: true, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 55, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 65, dinnerWeekendValue: 85 },
  "Catia": { worksLunch: true, worksDinner: true, lunchPaymentType: "SHIFT", lunchValue: 60, dinnerPaymentType: "SHIFT", dinnerWeekdayValue: 70, dinnerWeekendValue: 90 },
};

// Função para verificar se é fim de semana
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// Função para verificar se é segunda-feira (almoço fechado)
function isMonday(date: Date): boolean {
  return date.getDay() === 1;
}

// Função para calcular horas trabalhadas
function calculateHours(startTime: string, endTime: string): number {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  let startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;

  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }
  return (endMinutes - startMinutes) / 60;
}

// Função para calcular valor do turno
function calculateShiftValue(paymentType: string, value: number, hours: number): number {
  switch (paymentType) {
    case "HOUR":
      return value * hours;
    case "WEEK":
      return value / 6;
    case "MONTH":
      return value / 26;
    default:
      return value;
  }
}

async function main() {
  console.log("🏴‍☠️ Configurando funcionários e gerando registros de ponto...\n");

  // 1. Atualizar configurações dos funcionários
  console.log("📋 Atualizando configurações dos funcionários...\n");

  const employees = await prisma.employee.findMany();
  
  for (const employee of employees) {
    const config = employeeConfigs[employee.name];
    if (config) {
      await prisma.employee.update({
        where: { id: employee.id },
        data: {
          worksLunch: config.worksLunch,
          worksDinner: config.worksDinner,
          lunchPaymentType: config.lunchPaymentType,
          lunchValue: config.lunchValue,
          lunchStartTime: "11:00",
          lunchEndTime: "17:00",
          dinnerPaymentType: config.dinnerPaymentType,
          dinnerWeekdayValue: config.dinnerWeekdayValue,
          dinnerWeekendValue: config.dinnerWeekendValue,
          dinnerStartTime: "17:00",
          dinnerEndTime: "00:00",
        },
      });
      console.log(`  ✅ ${employee.name} - Configurado`);
    } else {
      // Configuração padrão: só jantar
      await prisma.employee.update({
        where: { id: employee.id },
        data: {
          worksLunch: false,
          worksDinner: true,
          lunchPaymentType: "SHIFT",
          lunchValue: 50,
          lunchStartTime: "11:00",
          lunchEndTime: "17:00",
          dinnerPaymentType: "SHIFT",
          dinnerWeekdayValue: 60,
          dinnerWeekendValue: 80,
          dinnerStartTime: "17:00",
          dinnerEndTime: "00:00",
        },
      });
      console.log(`  ⚠️  ${employee.name} - Configuração padrão aplicada`);
    }
  }

  // 2. Limpar registros de ponto antigos
  console.log("\n🗑️  Limpando registros antigos...");
  const deleted = await prisma.timeEntry.deleteMany({});
  console.log(`   ${deleted.count} registros removidos\n`);

  // 3. Gerar registros de ponto para as últimas 4 semanas
  console.log("📊 Gerando registros de ponto históricos...\n");

  const updatedEmployees = await prisma.employee.findMany({
    where: { active: true },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 28);

  let totalEntries = 0;
  const employeeTotals: Record<string, { days: number; total: number }> = {};

  for (let d = new Date(startDate); d < today; d.setDate(d.getDate() + 1)) {
    const currentDate = new Date(d);
    const dayOfWeek = currentDate.getDay();
    const dayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][dayOfWeek];
    const isWeekendDay = isWeekend(currentDate);
    const isMondayDay = isMonday(currentDate);

    for (const employee of updatedEmployees) {
      const worksLunchToday = employee.worksLunch && !isMondayDay;
      const worksDinnerToday = employee.worksDinner;

      if (!worksLunchToday && !worksDinnerToday) continue;

      // 90% de chance de estar presente
      const isPresent = Math.random() > 0.1;

      if (!isPresent) {
        await prisma.timeEntry.create({
          data: {
            employeeId: employee.id,
            date: currentDate,
            workedLunch: false,
            workedDinner: false,
            status: "ABSENT",
            notes: "Falta",
            lunchValue: 0,
            dinnerValue: 0,
            totalValue: 0,
          },
        });
        totalEntries++;
        continue;
      }

      let clockInLunch: string | null = null;
      let clockOutLunch: string | null = null;
      let clockInDinner: string | null = null;
      let clockOutDinner: string | null = null;
      let lunchValue = 0;
      let dinnerValue = 0;

      // Função helper para formatar hora com variação
      const formatTimeWithVariation = (baseTime: string, variation: number): string => {
        const [h, m] = baseTime.split(':').map(Number);
        let totalMinutes = h * 60 + m + variation;
        if (totalMinutes < 0) totalMinutes += 24 * 60;
        if (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;
        const newH = Math.floor(totalMinutes / 60);
        const newM = totalMinutes % 60;
        return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
      };

      // Almoço
      if (worksLunchToday) {
        const lunchStart = employee.lunchStartTime || "11:00";
        const lunchEnd = employee.lunchEndTime || "17:00";
        
        const startVariation = Math.floor(Math.random() * 20) - 10;
        const endVariation = Math.floor(Math.random() * 20) - 10;
        
        clockInLunch = formatTimeWithVariation(lunchStart, startVariation);
        clockOutLunch = formatTimeWithVariation(lunchEnd, endVariation);

        const hours = calculateHours(lunchStart, lunchEnd);
        lunchValue = calculateShiftValue(
          employee.lunchPaymentType || "SHIFT",
          Number(employee.lunchValue) || 50,
          hours
        );
      }

      // Jantar
      if (worksDinnerToday) {
        const dinnerStart = employee.dinnerStartTime || "17:00";
        const dinnerEnd = employee.dinnerEndTime || "00:00";
        
        const startVariation = Math.floor(Math.random() * 20) - 10;
        const endVariation = Math.floor(Math.random() * 20) - 10;
        
        clockInDinner = formatTimeWithVariation(dinnerStart, startVariation);
        clockOutDinner = formatTimeWithVariation(dinnerEnd, endVariation);

        const hours = calculateHours(dinnerStart, dinnerEnd);
        const dinnerRate = isWeekendDay 
          ? (Number(employee.dinnerWeekendValue) || 80)
          : (Number(employee.dinnerWeekdayValue) || 60);
        
        dinnerValue = calculateShiftValue(
          employee.dinnerPaymentType || "SHIFT",
          dinnerRate,
          hours
        );
      }

      const totalValue = lunchValue + dinnerValue;

      await prisma.timeEntry.create({
        data: {
          employeeId: employee.id,
          date: currentDate,
          workedLunch: worksLunchToday,
          workedDinner: worksDinnerToday,
          clockInLunch,
          clockOutLunch,
          clockInDinner,
          clockOutDinner,
          status: "PRESENT",
          lunchValue,
          dinnerValue,
          totalValue,
        },
      });

      totalEntries++;

      // Acumular totais
      if (!employeeTotals[employee.name]) {
        employeeTotals[employee.name] = { days: 0, total: 0 };
      }
      employeeTotals[employee.name].days++;
      employeeTotals[employee.name].total += totalValue;
    }

    console.log(`  ${dayName} ${currentDate.toLocaleDateString('pt-BR')} - OK`);
  }

  console.log("\n" + "=".repeat(60));
  console.log(`✅ ${totalEntries} registros de ponto criados`);
  console.log("=".repeat(60));

  // Resumo
  console.log("\n📊 Resumo por funcionário (últimas 4 semanas):\n");
  
  const sortedEmployees = Object.entries(employeeTotals)
    .sort((a, b) => b[1].total - a[1].total);

  let grandTotal = 0;
  for (const [name, data] of sortedEmployees) {
    console.log(`  ${name.padEnd(20)} | ${data.days.toString().padStart(2)} dias | R$ ${data.total.toFixed(2).padStart(10)}`);
    grandTotal += data.total;
  }

  console.log("\n" + "-".repeat(50));
  console.log(`  ${"TOTAL".padEnd(20)} |         | R$ ${grandTotal.toFixed(2).padStart(10)}`);
  console.log("-".repeat(50));

  console.log("\n🏴‍☠️ Pronto! Dados configurados com sucesso!\n");
}

main()
  .catch((e) => {
    console.error("Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


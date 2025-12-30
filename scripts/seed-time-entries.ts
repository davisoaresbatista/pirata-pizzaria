import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Função para verificar se é fim de semana
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Domingo, 6 = Sábado
}

// Função para verificar se é segunda-feira (almoço fechado)
function isMonday(date: Date): boolean {
  return date.getDay() === 1;
}

// Função para calcular horas trabalhadas
function calculateHours(startTime: string | null, endTime: string | null): number {
  if (!startTime || !endTime) return 0;
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  let startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;

  // Handle overnight shifts (e.g., 17:00 to 00:00)
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }
  return (endMinutes - startMinutes) / 60;
}

// Função para calcular valor do turno baseado no tipo de pagamento
function calculateShiftValue(
  paymentType: string,
  value: number,
  hours: number
): number {
  switch (paymentType) {
    case "HOUR":
      return value * hours;
    case "SHIFT":
    case "DAY":
      return value;
    case "WEEK":
      return value / 6; // 6 dias de trabalho por semana
    case "MONTH":
      return value / 26; // ~26 dias de trabalho por mês
    default:
      return value;
  }
}

// Função para criar data com horário específico
function createDateTime(baseDate: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

async function seedTimeEntries() {
  console.log("🏴‍☠️ Gerando registros de ponto históricos...\n");

  // Limpar registros antigos
  const deleted = await prisma.timeEntry.deleteMany({});
  console.log(`🗑️  ${deleted.count} registros antigos removidos\n`);

  // Buscar funcionários ativos
  const employees = await prisma.employee.findMany({
    where: { active: true },
  });

  console.log(`📋 Encontrados ${employees.length} funcionários ativos\n`);

  // Período: últimas 4 semanas
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 28); // 4 semanas atrás

  let totalEntries = 0;
  let skippedEntries = 0;

  // Para cada dia no período
  for (let d = new Date(startDate); d < today; d.setDate(d.getDate() + 1)) {
    const currentDate = new Date(d);
    const dayOfWeek = currentDate.getDay();
    const dayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][dayOfWeek];
    const isWeekendDay = isWeekend(currentDate);
    const isMondayDay = isMonday(currentDate);

    // Para cada funcionário
    for (const employee of employees) {
      // Verificar se o funcionário trabalha no almoço e se não é segunda
      const worksLunchToday = employee.worksLunch && !isMondayDay;
      const worksDinnerToday = employee.worksDinner;

      // Se não trabalha em nenhum turno neste dia, pula
      if (!worksLunchToday && !worksDinnerToday) {
        continue;
      }

      // Simular presença (90% de chance de estar presente)
      const isPresent = Math.random() > 0.1;
      
      // Se ausente, registra como falta
      if (!isPresent) {
        try {
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
        } catch (e) {
          skippedEntries++;
        }
        continue;
      }

      // Calcular horários e valores
      let clockInLunch: string | null = null;
      let clockOutLunch: string | null = null;
      let clockInDinner: string | null = null;
      let clockOutDinner: string | null = null;
      let lunchValue = 0;
      let dinnerValue = 0;

      // Almoço
      if (worksLunchToday) {
        const lunchStart = employee.lunchStartTime || "11:00";
        const lunchEnd = employee.lunchEndTime || "17:00";
        
        // Adicionar pequena variação nos horários (+/- 15 min)
        const startVariation = Math.floor(Math.random() * 30) - 15;
        const endVariation = Math.floor(Math.random() * 30) - 15;
        
        const [startH, startM] = lunchStart.split(':').map(Number);
        const [endH, endM] = lunchEnd.split(':').map(Number);
        
        const inDate = new Date(currentDate);
        inDate.setHours(startH, startM + startVariation, 0, 0);
        clockInLunch = `${String(inDate.getHours()).padStart(2, '0')}:${String(inDate.getMinutes()).padStart(2, '0')}`;
        
        const outDate = new Date(currentDate);
        outDate.setHours(endH, endM + endVariation, 0, 0);
        clockOutLunch = `${String(outDate.getHours()).padStart(2, '0')}:${String(outDate.getMinutes()).padStart(2, '0')}`;

        // Calcular valor - usar valor padrão se não configurado
        const hours = calculateHours(lunchStart, lunchEnd);
        const lunchRate = Number(employee.lunchValue) || 50; // R$ 50 padrão
        lunchValue = calculateShiftValue(
          employee.lunchPaymentType || "SHIFT",
          lunchRate,
          hours
        );
      }

      // Jantar
      if (worksDinnerToday) {
        const dinnerStart = employee.dinnerStartTime || "17:00";
        const dinnerEnd = employee.dinnerEndTime || "00:00";
        
        // Adicionar pequena variação nos horários (+/- 15 min)
        const startVariation = Math.floor(Math.random() * 30) - 15;
        const endVariation = Math.floor(Math.random() * 30) - 15;
        
        const [startH, startM] = dinnerStart.split(':').map(Number);
        const [endH, endM] = dinnerEnd.split(':').map(Number);
        
        const inDinnerDate = new Date(currentDate);
        inDinnerDate.setHours(startH, startM + startVariation, 0, 0);
        clockInDinner = `${String(inDinnerDate.getHours()).padStart(2, '0')}:${String(inDinnerDate.getMinutes()).padStart(2, '0')}`;
        
        // Se termina à meia-noite ou depois, é no dia seguinte
        const outDinnerDate = new Date(currentDate);
        if (endH === 0 || (endH < startH && endH < 6)) {
          outDinnerDate.setDate(outDinnerDate.getDate() + 1);
        }
        outDinnerDate.setHours(endH, endM + endVariation, 0, 0);
        clockOutDinner = `${String(outDinnerDate.getHours()).padStart(2, '0')}:${String(outDinnerDate.getMinutes()).padStart(2, '0')}`;

        // Calcular valor (considera fim de semana) - usar valores padrão se não configurado
        const hours = calculateHours(dinnerStart, dinnerEnd);
        const dinnerRate = isWeekendDay 
          ? (Number(employee.dinnerWeekendValue) || 80) // R$ 80 padrão fim de semana
          : (Number(employee.dinnerWeekdayValue) || 60); // R$ 60 padrão dia útil
        
        dinnerValue = calculateShiftValue(
          employee.dinnerPaymentType || "SHIFT",
          dinnerRate,
          hours
        );
      }

      const totalValue = lunchValue + dinnerValue;

      try {
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
      } catch (e) {
        // Registro já existe, pula
        skippedEntries++;
      }
    }

    console.log(`  ${dayName} ${currentDate.toLocaleDateString('pt-BR')} - Processado`);
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ ${totalEntries} registros criados`);
  console.log(`⏭️  ${skippedEntries} registros já existiam (ignorados)`);
  console.log("=".repeat(50));

  // Resumo por funcionário
  console.log("\n📊 Resumo por funcionário (últimas 4 semanas):\n");

  const summary = await prisma.timeEntry.groupBy({
    by: ['employeeId'],
    where: {
      date: {
        gte: startDate,
        lt: today,
      },
    },
    _sum: {
      totalValue: true,
    },
    _count: {
      id: true,
    },
  });

  for (const item of summary) {
    const employee = employees.find(e => e.id === item.employeeId);
    if (employee) {
      const total = Number(item._sum.totalValue) || 0;
      console.log(`  ${employee.name.padEnd(20)} | ${item._count.id.toString().padStart(2)} dias | R$ ${total.toFixed(2)}`);
    }
  }

  console.log("\n🏴‍☠️ Pronto! Dados históricos gerados com sucesso!\n");
}

seedTimeEntries()
  .catch((e) => {
    console.error("Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


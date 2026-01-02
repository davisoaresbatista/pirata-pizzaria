/**
 * Script para seed de dados de vendas de exemplo
 * Baseado na amostra do Consumer Connect
 * 
 * Execute com: npx ts-node scripts/seed-sales.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Dados de exemplo baseados na amostra do Consumer Connect
const sampleSales = [
  {
    externalId: "185586",
    origin: "Comanda Mobile",
    orderType: "Balcão",
    itemsCount: 2,
    amount: 126.00,
    status: "Finalizado Fiado",
    openedAt: "2025-09-01T17:56:06",
    duration: "6h 4m 24s",
    unit: "PIRATA PIZZARIA",
  },
  {
    externalId: "185587",
    origin: "Comanda Mobile",
    orderType: "Mesas/Comandas 3",
    itemsCount: 2,
    amount: 93.30,
    status: "Finalizado Pago",
    openedAt: "2025-09-01T18:30:19",
    duration: "55m 34s",
    unit: "PIRATA PIZZARIA",
  },
  {
    externalId: "185588",
    origin: "Comanda Mobile",
    orderType: "Mesas/Comandas 4",
    itemsCount: 1,
    amount: 44.00,
    status: "Finalizado Pago",
    openedAt: "2025-09-01T18:32:23",
    duration: "53m 48s",
    unit: "PIRATA PIZZARIA",
  },
  {
    externalId: "185589",
    origin: "Comanda Mobile",
    orderType: "Mesas/Comandas 22",
    itemsCount: 1,
    amount: 39.99,
    status: "Finalizado Pago",
    openedAt: "2025-09-01T18:46:20",
    duration: "13m 11s",
    unit: "PIRATA PIZZARIA",
  },
  {
    externalId: "185590",
    origin: "Comanda Mobile",
    orderType: "Mesas/Comandas 15",
    itemsCount: 2,
    amount: 113.30,
    status: "Finalizado Pago",
    openedAt: "2025-09-01T19:01:13",
    duration: "48m 6s",
    unit: "PIRATA PIZZARIA",
  },
];

// Gerar dados extras para simular um mês completo
function generateMoreSales(): typeof sampleSales {
  const sales: typeof sampleSales = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Gerar vendas para cada dia do mês atual até hoje
  const daysInMonth = today.getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    // Quantidade aleatória de vendas por dia (entre 5 e 20)
    const salesPerDay = Math.floor(Math.random() * 16) + 5;
    
    for (let i = 0; i < salesPerDay; i++) {
      const isCounter = Math.random() < 0.3; // 30% balcão
      const isDelivery = !isCounter && Math.random() < 0.1; // 10% delivery
      const tableNumber = !isCounter && !isDelivery ? Math.floor(Math.random() * 30) + 1 : null;
      
      const hour = Math.random() < 0.4 
        ? Math.floor(Math.random() * 4) + 11 // Almoço (11-14)
        : Math.floor(Math.random() * 5) + 18; // Jantar (18-22)
      
      const minute = Math.floor(Math.random() * 60);
      const duration = Math.floor(Math.random() * 3600) + 600; // 10min a 1h10min
      
      const amount = Math.round((Math.random() * 150 + 30) * 100) / 100; // R$30 a R$180
      const itemsCount = Math.floor(Math.random() * 5) + 1;
      
      const isPaid = Math.random() < 0.92; // 92% pago, 8% fiado
      
      sales.push({
        externalId: `${currentYear}${String(currentMonth + 1).padStart(2, "0")}${String(day).padStart(2, "0")}${String(i).padStart(3, "0")}`,
        origin: "Comanda Mobile",
        orderType: isCounter 
          ? "Balcão" 
          : isDelivery 
            ? "Delivery"
            : `Mesas/Comandas ${tableNumber}`,
        itemsCount,
        amount,
        status: isPaid ? "Finalizado Pago" : "Finalizado Fiado",
        openedAt: new Date(currentYear, currentMonth, day, hour, minute).toISOString(),
        duration: formatDuration(duration),
        unit: "PIRATA PIZZARIA",
      });
    }
  }
  
  return sales;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);
  
  return parts.join(" ") || "0s";
}

function parseDuration(duration: string): number {
  const hours = parseInt(duration.match(/(\d+)h/)?.[1] || "0");
  const minutes = parseInt(duration.match(/(\d+)m/)?.[1] || "0");
  const seconds = parseInt(duration.match(/(\d+)s/)?.[1] || "0");
  return hours * 3600 + minutes * 60 + seconds;
}

async function seedSales() {
  console.log("🌱 Iniciando seed de vendas...");
  
  // Combinar dados de exemplo com dados gerados
  const allSales = [...sampleSales, ...generateMoreSales()];
  
  console.log(`📦 Total de vendas a inserir: ${allSales.length}`);
  
  let created = 0;
  let updated = 0;
  
  for (const sale of allSales) {
    const isCounter = sale.orderType.toLowerCase().includes("balcão");
    const isDelivery = sale.orderType.toLowerCase().includes("delivery");
    
    let tableNumber: number | null = null;
    const tableMatch = sale.orderType.match(/(\d+)$/);
    if (tableMatch) {
      tableNumber = parseInt(tableMatch[1]);
    }
    
    const durationSeconds = parseDuration(sale.duration);
    
    const paymentStatus = sale.status.toLowerCase().includes("fiado") 
      ? "PENDING" 
      : sale.status.toLowerCase().includes("cancel") 
        ? "CANCELLED" 
        : "PAID";
    
    try {
      await prisma.salesOrder.upsert({
        where: { externalId: sale.externalId },
        update: {
          origin: sale.origin,
          orderType: sale.orderType,
          itemsCount: sale.itemsCount,
          amount: sale.amount,
          status: sale.status,
          paymentStatus,
          openedAt: new Date(sale.openedAt),
          duration: durationSeconds,
          unit: sale.unit,
          tableNumber,
          isCounter,
          isDelivery,
          syncedAt: new Date(),
        },
        create: {
          externalId: sale.externalId,
          origin: sale.origin,
          orderType: sale.orderType,
          itemsCount: sale.itemsCount,
          amount: sale.amount,
          status: sale.status,
          paymentStatus,
          openedAt: new Date(sale.openedAt),
          duration: durationSeconds,
          unit: sale.unit,
          tableNumber,
          isCounter,
          isDelivery,
        },
      });
      created++;
    } catch (error) {
      console.error(`❌ Erro ao inserir venda ${sale.externalId}:`, error);
    }
  }
  
  console.log(`✅ Seed concluído!`);
  console.log(`   - ${created} vendas inseridas/atualizadas`);
  
  // Estatísticas
  const stats = await prisma.salesOrder.aggregate({
    _count: true,
    _sum: { amount: true },
    _avg: { amount: true },
  });
  
  console.log(`\n📊 Estatísticas:`);
  console.log(`   - Total de vendas: ${stats._count}`);
  console.log(`   - Valor total: R$ ${Number(stats._sum.amount).toFixed(2)}`);
  console.log(`   - Ticket médio: R$ ${Number(stats._avg.amount).toFixed(2)}`);
}

seedSales()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


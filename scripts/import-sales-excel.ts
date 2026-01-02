/**
 * Script para importar vendas dos arquivos Excel do Consumer Connect
 * 
 * Execute com: npx ts-node scripts/import-sales-excel.ts
 */

import XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

// Diretório com os arquivos Excel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UTILS_DIR = path.join(__dirname, "..", "utils");

// Mapeamento de colunas do Excel para o modelo
interface ExcelRow {
  "Cód."?: string | number;
  "Código"?: string | number;
  "Cod"?: string | number;
  "Origem"?: string;
  "Tipo"?: string;
  "Qtd. Itens"?: number;
  "Qtd Itens"?: number;
  "QuantidadeItens"?: number;
  "Valor Final"?: number | string;
  "ValorFinal"?: number | string;
  "Valor"?: number | string;
  "Status"?: string;
  "Abertura"?: string | number | Date;
  "Data Abertura"?: string | number | Date;
  "DataAbertura"?: string | number | Date;
  "Tempo"?: string;
  "Duração"?: string;
  "Duracao"?: string;
  "Unidade"?: string;
  "Exclusão"?: string | Date | null;
  "Exclusao"?: string | Date | null;
  // Campos adicionais possíveis
  [key: string]: unknown;
}

function parseDuration(duration: string | undefined | null): number | null {
  if (!duration || typeof duration !== "string") return null;
  
  const hours = parseInt(duration.match(/(\d+)h/)?.[1] || "0");
  const minutes = parseInt(duration.match(/(\d+)m/)?.[1] || "0");
  const seconds = parseInt(duration.match(/(\d+)s/)?.[1] || "0");
  
  return hours * 3600 + minutes * 60 + seconds;
}

function parseDate(dateValue: string | number | Date | undefined): Date | null {
  if (!dateValue) return null;
  
  // Se for número (serial date do Excel)
  if (typeof dateValue === "number") {
    // Excel serial date para JavaScript Date
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
    return date;
  }
  
  // Se for Date
  if (dateValue instanceof Date) {
    return dateValue;
  }
  
  // Se for string
  if (typeof dateValue === "string") {
    // Tentar formato DD/MM/YYYY HH:MM:SS
    const match = dateValue.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
    if (match) {
      const [, day, month, year, hour, minute, second] = match;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
    }
    
    // Tentar formato DD/MM/YYYY
    const matchDate = dateValue.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (matchDate) {
      const [, day, month, year] = matchDate;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    // Tentar parse direto
    const parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  
  return null;
}

function parseAmount(value: string | number | undefined): number {
  if (!value) return 0;
  
  if (typeof value === "number") return value;
  
  // Remover R$ e formatar
  const cleaned = value
    .replace(/R\$\s*/gi, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();
  
  return parseFloat(cleaned) || 0;
}

function getExternalId(row: ExcelRow): string {
  const id = row["Cód."] || row["Código"] || row["Cod"] || row["Cód"];
  return String(id || "");
}

function getOrigin(row: ExcelRow): string {
  return String(row["Origem"] || "Desconhecido");
}

function getOrderType(row: ExcelRow): string {
  return String(row["Tipo"] || "Outros");
}

function getItemsCount(row: ExcelRow): number {
  return parseInt(String(row["Qtd. Itens"] || row["Qtd Itens"] || row["QuantidadeItens"] || 0)) || 0;
}

function getAmount(row: ExcelRow): number {
  return parseAmount(row["Valor Final"] || row["ValorFinal"] || row["Valor"]);
}

function getStatus(row: ExcelRow): string {
  return String(row["Status"] || "Desconhecido");
}

function getOpenedAt(row: ExcelRow): Date | null {
  return parseDate(row["Abertura"] || row["Data Abertura"] || row["DataAbertura"]);
}

function getDuration(row: ExcelRow): number | null {
  return parseDuration(row["Tempo"] || row["Duração"] || row["Duracao"]);
}

function getUnit(row: ExcelRow): string {
  return String(row["Unidade"] || "PIRATA PIZZARIA");
}

async function importExcelFile(filePath: string): Promise<{ imported: number; errors: number }> {
  console.log(`\n📂 Processando: ${path.basename(filePath)}`);
  
  // Ler o arquivo Excel
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Converter para array de arrays (raw data)
  const rawData: unknown[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // Encontrar a linha do cabeçalho (procura por "Cód." ou similar)
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(10, rawData.length); i++) {
    const row = rawData[i];
    if (Array.isArray(row) && row.some(cell => 
      typeof cell === "string" && (cell.includes("Cód") || cell.includes("Código"))
    )) {
      headerRowIndex = i;
      break;
    }
  }
  
  // Converter para JSON usando a linha correta como cabeçalho
  const headers = rawData[headerRowIndex] as string[];
  const dataRows = rawData.slice(headerRowIndex + 1);
  
  // Mapear para objetos
  const rows: ExcelRow[] = dataRows
    .filter(row => Array.isArray(row) && row.length > 0 && row[0])
    .map(row => {
      const obj: ExcelRow = {};
      headers.forEach((header, idx) => {
        if (header && Array.isArray(row)) {
          obj[header] = row[idx];
        }
      });
      return obj;
    });
  
  console.log(`   📊 ${rows.length} linhas de dados encontradas (cabeçalho na linha ${headerRowIndex + 1})`);
  
  // Mostrar as primeiras colunas para debug
  if (rows.length > 0) {
    console.log(`   📋 Colunas: ${Object.keys(rows[0]).join(", ")}`);
  }
  
  let imported = 0;
  let errors = 0;
  
  for (const row of rows) {
    try {
      const externalId = getExternalId(row);
      
      // Pular linhas sem ID
      if (!externalId || externalId === "undefined" || externalId === "null") {
        continue;
      }
      
      const orderType = getOrderType(row);
      const openedAt = getOpenedAt(row);
      
      // Pular linhas sem data
      if (!openedAt) {
        errors++;
        continue;
      }
      
      // Determinar tipo de pedido
      const isCounter = orderType.toLowerCase().includes("balcão") || orderType.toLowerCase().includes("balcao");
      const isDelivery = orderType.toLowerCase().includes("delivery");
      
      // Extrair número da mesa
      let tableNumber: number | null = null;
      const tableMatch = orderType.match(/(\d+)$/);
      if (tableMatch) {
        tableNumber = parseInt(tableMatch[1]);
      }
      
      // Determinar status de pagamento
      const status = getStatus(row);
      let paymentStatus = "PAID";
      if (status.toLowerCase().includes("fiado") || status.toLowerCase().includes("pendente")) {
        paymentStatus = "PENDING";
      } else if (status.toLowerCase().includes("cancel")) {
        paymentStatus = "CANCELLED";
      }
      
      // Upsert no banco
      await prisma.salesOrder.upsert({
        where: { externalId },
        update: {
          origin: getOrigin(row),
          orderType,
          itemsCount: getItemsCount(row),
          amount: getAmount(row),
          status,
          paymentStatus,
          openedAt,
          duration: getDuration(row),
          unit: getUnit(row),
          tableNumber,
          isCounter,
          isDelivery,
          syncedAt: new Date(),
        },
        create: {
          externalId,
          origin: getOrigin(row),
          orderType,
          itemsCount: getItemsCount(row),
          amount: getAmount(row),
          status,
          paymentStatus,
          openedAt,
          duration: getDuration(row),
          unit: getUnit(row),
          tableNumber,
          isCounter,
          isDelivery,
        },
      });
      
      imported++;
    } catch (error) {
      errors++;
      if (errors <= 5) {
        console.error(`   ❌ Erro na linha: ${JSON.stringify(row).substring(0, 100)}...`);
        console.error(`      ${error}`);
      }
    }
  }
  
  console.log(`   ✅ Importados: ${imported} | ❌ Erros: ${errors}`);
  
  return { imported, errors };
}

async function main() {
  console.log("🏴‍☠️ Importador de Vendas - Consumer Connect Excel");
  console.log("================================================\n");
  
  // Listar arquivos Excel no diretório utils
  const files = fs.readdirSync(UTILS_DIR).filter(f => 
    f.endsWith(".xlsx") || f.endsWith(".xls")
  );
  
  if (files.length === 0) {
    console.error("❌ Nenhum arquivo Excel encontrado em:", UTILS_DIR);
    process.exit(1);
  }
  
  console.log(`📁 Encontrados ${files.length} arquivos Excel:`);
  files.forEach(f => console.log(`   - ${f}`));
  
  let totalImported = 0;
  let totalErrors = 0;
  
  // Processar cada arquivo
  for (const file of files) {
    const filePath = path.join(UTILS_DIR, file);
    const result = await importExcelFile(filePath);
    totalImported += result.imported;
    totalErrors += result.errors;
  }
  
  console.log("\n================================================");
  console.log("📊 RESUMO FINAL");
  console.log("================================================");
  console.log(`   📁 Arquivos processados: ${files.length}`);
  console.log(`   ✅ Total importados: ${totalImported}`);
  console.log(`   ❌ Total erros: ${totalErrors}`);
  
  // Estatísticas do banco
  const stats = await prisma.salesOrder.aggregate({
    _count: true,
    _sum: { amount: true },
    _avg: { amount: true },
  });
  
  const byMonth = await prisma.$queryRaw`
    SELECT 
      strftime('%Y-%m', openedAt) as month,
      COUNT(*) as orders,
      SUM(amount) as total
    FROM sales_orders
    GROUP BY strftime('%Y-%m', openedAt)
    ORDER BY month DESC
    LIMIT 6
  ` as Array<{ month: string; orders: number; total: number }>;
  
  console.log("\n📊 ESTATÍSTICAS DO BANCO:");
  console.log(`   - Total de vendas: ${stats._count}`);
  console.log(`   - Valor total: R$ ${Number(stats._sum.amount || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`);
  console.log(`   - Ticket médio: R$ ${Number(stats._avg.amount || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`);
  
  console.log("\n📅 VENDAS POR MÊS:");
  byMonth.forEach(m => {
    console.log(`   - ${m.month}: ${m.orders} pedidos, R$ ${Number(m.total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Erro fatal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


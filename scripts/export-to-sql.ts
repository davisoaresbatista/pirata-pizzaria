/**
 * Script para exportar dados do banco local (SQLite) para SQL
 * Execute com: npx tsx scripts/export-to-sql.ts
 */

import { PrismaClient, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Helper para escapar strings SQL
function escapeSQL(value: string | null | undefined): string {
  if (value === null || value === undefined) return 'NULL';
  return `'${value.replace(/'/g, "''")}'`;
}

// Helper para formatar data
function formatDate(date: Date | null | undefined): string {
  if (!date) return 'NULL';
  return `'${date.toISOString().slice(0, 19).replace('T', ' ')}'`;
}

// Helper para formatar decimal
function formatDecimal(value: Prisma.Decimal | number | null | undefined): string {
  if (value === null || value === undefined) return '0';
  return String(value);
}

// Helper para formatar boolean
function formatBool(value: boolean | null | undefined): string {
  if (value === null || value === undefined) return 'false';
  return value ? 'true' : 'false';
}

async function exportToSQL() {
  console.log('📦 Exportando dados para SQL...\n');

  let sql = `-- ============================================
-- DADOS DO BANCO LOCAL - Pirata Pizzaria
-- Gerado em: ${new Date().toLocaleString('pt-BR')}
-- Execute no phpMyAdmin APÓS criar as tabelas
-- ============================================

`;

  try {
    // Exportar usuários
    const users = await prisma.user.findMany();
    console.log(`✅ Usuários: ${users.length}`);
    
    if (users.length > 0) {
      sql += `-- USUÁRIOS\n`;
      sql += `DELETE FROM users WHERE id NOT IN ('cm5bn4admin001');\n`;
      for (const u of users) {
        sql += `INSERT INTO users (id, name, email, password, role, createdAt, updatedAt) VALUES (
  ${escapeSQL(u.id)},
  ${escapeSQL(u.name)},
  ${escapeSQL(u.email)},
  ${escapeSQL(u.password)},
  ${escapeSQL(u.role)},
  ${formatDate(u.createdAt)},
  ${formatDate(u.updatedAt)}
) ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password), role = VALUES(role);\n\n`;
      }
    }

    // Exportar funcionários
    const employees = await prisma.employee.findMany();
    console.log(`✅ Funcionários: ${employees.length}`);
    
    if (employees.length > 0) {
      sql += `\n-- FUNCIONÁRIOS\n`;
      for (const e of employees) {
        sql += `INSERT INTO employees (id, name, role, salary, phone, document, hireDate, active,
  worksLunch, lunchPaymentType, lunchValue, lunchStartTime, lunchEndTime,
  worksDinner, dinnerPaymentType, dinnerWeekdayValue, dinnerWeekendValue, dinnerStartTime, dinnerEndTime,
  createdAt, updatedAt) VALUES (
  ${escapeSQL(e.id)},
  ${escapeSQL(e.name)},
  ${escapeSQL(e.role)},
  ${formatDecimal(e.salary)},
  ${escapeSQL(e.phone)},
  ${escapeSQL(e.document)},
  ${formatDate(e.hireDate)},
  ${formatBool(e.active)},
  ${formatBool(e.worksLunch)},
  ${escapeSQL(e.lunchPaymentType)},
  ${formatDecimal(e.lunchValue)},
  ${escapeSQL(e.lunchStartTime)},
  ${escapeSQL(e.lunchEndTime)},
  ${formatBool(e.worksDinner)},
  ${escapeSQL(e.dinnerPaymentType)},
  ${formatDecimal(e.dinnerWeekdayValue)},
  ${formatDecimal(e.dinnerWeekendValue)},
  ${escapeSQL(e.dinnerStartTime)},
  ${escapeSQL(e.dinnerEndTime)},
  ${formatDate(e.createdAt)},
  ${formatDate(e.updatedAt)}
) ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  worksLunch = VALUES(worksLunch),
  lunchPaymentType = VALUES(lunchPaymentType),
  lunchValue = VALUES(lunchValue),
  worksDinner = VALUES(worksDinner),
  dinnerPaymentType = VALUES(dinnerPaymentType),
  dinnerWeekdayValue = VALUES(dinnerWeekdayValue),
  dinnerWeekendValue = VALUES(dinnerWeekendValue);\n\n`;
      }
    }

    // Exportar configurações de turno
    const shiftConfigs = await prisma.shiftConfig.findMany();
    console.log(`✅ Configurações de Turno: ${shiftConfigs.length}`);
    
    if (shiftConfigs.length > 0) {
      sql += `\n-- CONFIGURAÇÕES DE TURNO\n`;
      for (const s of shiftConfigs) {
        sql += `INSERT INTO shift_configs (id, name, description, value, createdAt, updatedAt) VALUES (
  ${escapeSQL(s.id)},
  ${escapeSQL(s.name)},
  ${escapeSQL(s.description)},
  ${formatDecimal(s.value)},
  ${formatDate(s.createdAt)},
  ${formatDate(s.updatedAt)}
) ON DUPLICATE KEY UPDATE description = VALUES(description), value = VALUES(value);\n\n`;
      }
    }

    // Exportar adiantamentos
    const advances = await prisma.advance.findMany();
    console.log(`✅ Adiantamentos: ${advances.length}`);
    
    if (advances.length > 0) {
      sql += `\n-- ADIANTAMENTOS\n`;
      for (const a of advances) {
        sql += `INSERT INTO advances (id, employeeId, amount, requestDate, paymentDate, status, notes, createdAt, updatedAt) VALUES (
  ${escapeSQL(a.id)},
  ${escapeSQL(a.employeeId)},
  ${formatDecimal(a.amount)},
  ${formatDate(a.requestDate)},
  ${formatDate(a.paymentDate)},
  ${escapeSQL(a.status)},
  ${escapeSQL(a.notes)},
  ${formatDate(a.createdAt)},
  ${formatDate(a.updatedAt)}
) ON DUPLICATE KEY UPDATE status = VALUES(status), paymentDate = VALUES(paymentDate);\n\n`;
      }
    }

    // Exportar despesas
    const expenses = await prisma.expense.findMany();
    console.log(`✅ Despesas: ${expenses.length}`);
    
    if (expenses.length > 0) {
      sql += `\n-- DESPESAS\n`;
      for (const e of expenses) {
        sql += `INSERT INTO expenses (id, category, description, amount, date, notes, createdAt, updatedAt) VALUES (
  ${escapeSQL(e.id)},
  ${escapeSQL(e.category)},
  ${escapeSQL(e.description)},
  ${formatDecimal(e.amount)},
  ${formatDate(e.date)},
  ${escapeSQL(e.notes)},
  ${formatDate(e.createdAt)},
  ${formatDate(e.updatedAt)}
) ON DUPLICATE KEY UPDATE description = VALUES(description), amount = VALUES(amount);\n\n`;
      }
    }

    // Exportar receitas
    const revenues = await prisma.revenue.findMany();
    console.log(`✅ Receitas: ${revenues.length}`);
    
    if (revenues.length > 0) {
      sql += `\n-- RECEITAS\n`;
      for (const r of revenues) {
        sql += `INSERT INTO revenues (id, source, description, amount, date, notes, createdAt, updatedAt) VALUES (
  ${escapeSQL(r.id)},
  ${escapeSQL(r.source)},
  ${escapeSQL(r.description)},
  ${formatDecimal(r.amount)},
  ${formatDate(r.date)},
  ${escapeSQL(r.notes)},
  ${formatDate(r.createdAt)},
  ${formatDate(r.updatedAt)}
) ON DUPLICATE KEY UPDATE description = VALUES(description), amount = VALUES(amount);\n\n`;
      }
    }

    // NÃO exportar registros de ponto (muitos dados, pode ser grande demais)
    const timeEntries = await prisma.timeEntry.findMany();
    console.log(`⚠️  Registros de Ponto: ${timeEntries.length} (não exportados - dados de teste)`);

    sql += `\n-- ============================================
-- FIM DA IMPORTAÇÃO
-- Total de funcionários: ${employees.length}
-- Total de adiantamentos: ${advances.length}
-- Total de despesas: ${expenses.length}
-- Total de receitas: ${revenues.length}
-- ============================================\n`;

    // Salvar em arquivo SQL
    const exportPath = path.join(process.cwd(), 'data-export.sql');
    fs.writeFileSync(exportPath, sql);

    console.log(`\n🎉 SQL exportado para: ${exportPath}`);
    console.log('\n📋 Próximos passos:');
    console.log('   1. Abra o phpMyAdmin na Hostinger');
    console.log('   2. Selecione o banco u985490280_piratapizzaria');
    console.log('   3. Vá na aba SQL');
    console.log('   4. Cole o conteúdo do arquivo data-export.sql');
    console.log('   5. Clique em Executar');

  } catch (error) {
    console.error('❌ Erro ao exportar:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportToSQL();


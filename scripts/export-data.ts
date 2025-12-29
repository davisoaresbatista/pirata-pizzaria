/**
 * Script para exportar dados do banco local (SQLite) para JSON
 * Execute com: npx tsx scripts/export-data.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function exportData() {
  console.log('📦 Exportando dados do banco local...\n');

  try {
    // Exportar usuários
    const users = await prisma.user.findMany();
    console.log(`✅ Usuários: ${users.length}`);

    // Exportar funcionários
    const employees = await prisma.employee.findMany();
    console.log(`✅ Funcionários: ${employees.length}`);

    // Exportar registros de ponto
    const timeEntries = await prisma.timeEntry.findMany();
    console.log(`✅ Registros de Ponto: ${timeEntries.length}`);

    // Exportar adiantamentos
    const advances = await prisma.advance.findMany();
    console.log(`✅ Adiantamentos: ${advances.length}`);

    // Exportar despesas
    const expenses = await prisma.expense.findMany();
    console.log(`✅ Despesas: ${expenses.length}`);

    // Exportar receitas
    const revenues = await prisma.revenue.findMany();
    console.log(`✅ Receitas: ${revenues.length}`);

    // Exportar configurações de turno
    const shiftConfigs = await prisma.shiftConfig.findMany();
    console.log(`✅ Configurações de Turno: ${shiftConfigs.length}`);

    // Exportar períodos de folha
    const payrollPeriods = await prisma.payrollPeriod.findMany();
    console.log(`✅ Períodos de Folha: ${payrollPeriods.length}`);

    // Exportar pagamentos
    const payrollPayments = await prisma.payrollPayment.findMany();
    console.log(`✅ Pagamentos: ${payrollPayments.length}`);

    // Criar objeto com todos os dados
    const data = {
      exportedAt: new Date().toISOString(),
      users: users.map(u => ({ ...u, password: u.password })), // Inclui senha hash
      employees,
      timeEntries,
      advances,
      expenses,
      revenues,
      shiftConfigs,
      payrollPeriods,
      payrollPayments,
    };

    // Salvar em arquivo JSON
    const exportPath = path.join(process.cwd(), 'data-export.json');
    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2));

    console.log(`\n🎉 Dados exportados para: ${exportPath}`);
    console.log('\n📋 Resumo:');
    console.log(`   - Usuários: ${users.length}`);
    console.log(`   - Funcionários: ${employees.length}`);
    console.log(`   - Registros de Ponto: ${timeEntries.length}`);
    console.log(`   - Adiantamentos: ${advances.length}`);
    console.log(`   - Despesas: ${expenses.length}`);
    console.log(`   - Receitas: ${revenues.length}`);

  } catch (error) {
    console.error('❌ Erro ao exportar:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();


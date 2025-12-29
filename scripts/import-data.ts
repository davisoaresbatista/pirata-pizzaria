/**
 * Script para importar dados do JSON para o banco de produção
 * Execute com: npx tsx scripts/import-data.ts
 * 
 * IMPORTANTE: Configure o DATABASE_URL no .env para o banco de produção antes de executar!
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ExportedData {
  exportedAt: string;
  users: Array<{
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }>;
  employees: Array<{
    id: string;
    name: string;
    role: string;
    salary: number;
    phone: string | null;
    document: string | null;
    hireDate: string;
    active: boolean;
    worksLunch: boolean;
    lunchPaymentType: string;
    lunchValue: number;
    lunchStartTime: string | null;
    lunchEndTime: string | null;
    worksDinner: boolean;
    dinnerPaymentType: string;
    dinnerWeekdayValue: number;
    dinnerWeekendValue: number;
    dinnerStartTime: string | null;
    dinnerEndTime: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  timeEntries: Array<unknown>;
  advances: Array<unknown>;
  expenses: Array<unknown>;
  revenues: Array<unknown>;
  shiftConfigs: Array<unknown>;
  payrollPeriods: Array<unknown>;
  payrollPayments: Array<unknown>;
}

async function importData() {
  console.log('📦 Importando dados para o banco de produção...\n');

  const exportPath = path.join(process.cwd(), 'data-export.json');

  if (!fs.existsSync(exportPath)) {
    console.error('❌ Arquivo data-export.json não encontrado!');
    console.log('   Execute primeiro: npx tsx scripts/export-data.ts');
    return;
  }

  try {
    const rawData = fs.readFileSync(exportPath, 'utf-8');
    const data: ExportedData = JSON.parse(rawData);

    console.log(`📅 Dados exportados em: ${data.exportedAt}\n`);

    // Importar usuários
    console.log('👤 Importando usuários...');
    for (const user of data.users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          password: user.password,
          role: user.role,
        },
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
        },
      });
    }
    console.log(`   ✅ ${data.users.length} usuários importados`);

    // Importar funcionários
    console.log('👥 Importando funcionários...');
    for (const emp of data.employees) {
      await prisma.employee.upsert({
        where: { id: emp.id },
        update: {
          name: emp.name,
          role: emp.role,
          salary: emp.salary,
          phone: emp.phone,
          document: emp.document,
          active: emp.active,
          worksLunch: emp.worksLunch,
          lunchPaymentType: emp.lunchPaymentType,
          lunchValue: emp.lunchValue,
          lunchStartTime: emp.lunchStartTime,
          lunchEndTime: emp.lunchEndTime,
          worksDinner: emp.worksDinner,
          dinnerPaymentType: emp.dinnerPaymentType,
          dinnerWeekdayValue: emp.dinnerWeekdayValue,
          dinnerWeekendValue: emp.dinnerWeekendValue,
          dinnerStartTime: emp.dinnerStartTime,
          dinnerEndTime: emp.dinnerEndTime,
        },
        create: {
          id: emp.id,
          name: emp.name,
          role: emp.role,
          salary: emp.salary,
          phone: emp.phone,
          document: emp.document,
          hireDate: new Date(emp.hireDate),
          active: emp.active,
          worksLunch: emp.worksLunch,
          lunchPaymentType: emp.lunchPaymentType,
          lunchValue: emp.lunchValue,
          lunchStartTime: emp.lunchStartTime,
          lunchEndTime: emp.lunchEndTime,
          worksDinner: emp.worksDinner,
          dinnerPaymentType: emp.dinnerPaymentType,
          dinnerWeekdayValue: emp.dinnerWeekdayValue,
          dinnerWeekendValue: emp.dinnerWeekendValue,
          dinnerStartTime: emp.dinnerStartTime,
          dinnerEndTime: emp.dinnerEndTime,
        },
      });
    }
    console.log(`   ✅ ${data.employees.length} funcionários importados`);

    // Importar configurações de turno
    if (data.shiftConfigs && data.shiftConfigs.length > 0) {
      console.log('⚙️ Importando configurações de turno...');
      for (const config of data.shiftConfigs as Array<{ id: string; name: string; description: string; value: number }>) {
        await prisma.shiftConfig.upsert({
          where: { name: config.name },
          update: { value: config.value, description: config.description },
          create: {
            id: config.id,
            name: config.name,
            description: config.description,
            value: config.value,
          },
        });
      }
      console.log(`   ✅ ${data.shiftConfigs.length} configurações importadas`);
    }

    // Importar registros de ponto
    if (data.timeEntries && data.timeEntries.length > 0) {
      console.log('⏰ Importando registros de ponto...');
      let count = 0;
      for (const entry of data.timeEntries as Array<{
        id: string;
        employeeId: string;
        date: string;
        workedLunch: boolean;
        workedDinner: boolean;
        clockInLunch: string | null;
        clockOutLunch: string | null;
        clockInDinner: string | null;
        clockOutDinner: string | null;
        status: string;
        notes: string | null;
        lunchValue: number;
        dinnerValue: number;
        totalValue: number;
      }>) {
        try {
          await prisma.timeEntry.create({
            data: {
              id: entry.id,
              employeeId: entry.employeeId,
              date: new Date(entry.date),
              workedLunch: entry.workedLunch,
              workedDinner: entry.workedDinner,
              clockInLunch: entry.clockInLunch,
              clockOutLunch: entry.clockOutLunch,
              clockInDinner: entry.clockInDinner,
              clockOutDinner: entry.clockOutDinner,
              status: entry.status,
              notes: entry.notes,
              lunchValue: entry.lunchValue,
              dinnerValue: entry.dinnerValue,
              totalValue: entry.totalValue,
            },
          });
          count++;
        } catch {
          // Registro já existe, pular
        }
      }
      console.log(`   ✅ ${count} registros de ponto importados`);
    }

    // Importar adiantamentos
    if (data.advances && data.advances.length > 0) {
      console.log('💰 Importando adiantamentos...');
      let count = 0;
      for (const adv of data.advances as Array<{
        id: string;
        employeeId: string;
        amount: number;
        requestDate: string;
        paymentDate: string | null;
        status: string;
        notes: string | null;
      }>) {
        try {
          await prisma.advance.create({
            data: {
              id: adv.id,
              employeeId: adv.employeeId,
              amount: adv.amount,
              requestDate: new Date(adv.requestDate),
              paymentDate: adv.paymentDate ? new Date(adv.paymentDate) : null,
              status: adv.status,
              notes: adv.notes,
            },
          });
          count++;
        } catch {
          // Registro já existe
        }
      }
      console.log(`   ✅ ${count} adiantamentos importados`);
    }

    console.log('\n🎉 Importação concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao importar:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();


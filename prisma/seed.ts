import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@piratapizzaria.com.br' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@piratapizzaria.com.br',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Usuário admin criado: ${adminUser.email}`);

  // Configuração de valores por turno
  const shiftConfigs = [
    { name: 'lunch', description: 'Almoço (todos os dias)', value: 50 },
    { name: 'dinner_weekday', description: 'Jantar (Segunda a Sexta)', value: 60 },
    { name: 'dinner_weekend', description: 'Jantar (Sábado e Domingo)', value: 80 },
  ];

  for (const config of shiftConfigs) {
    await prisma.shiftConfig.upsert({
      where: { name: config.name },
      update: { value: config.value },
      create: config,
    });
  }
  console.log('✅ Configuração de valores por turno criada');

  // Funcionários com suas configurações
  const employees = [
    { name: "Andressa", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Bianca", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Caio", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Catia", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Cleber", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Cleia", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Duda", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Duda Loira", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Felipe", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Gil", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Henry", worksLunch: true, worksDinner: false, lunchPaymentType: "MONTH", lunchValue: 3000, salary: 3000 },
    { name: "Isaias", worksLunch: true, worksDinner: true, lunchPaymentType: "HOUR", lunchValue: 15, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Kaio", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Lais", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Lara", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Ligia", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Marina", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Miguel", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Miqueias Moto", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Mudinho", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Nayara", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Rebeca", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Silva", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Stephanie", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Valdeir Moto", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Vinicius", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
    { name: "Vitoria", worksLunch: false, worksDinner: true, dinnerPaymentType: "HOUR", dinnerWeekdayValue: 15, dinnerWeekendValue: 20 },
  ];

  type EmployeeData = {
    name: string;
    worksLunch: boolean;
    worksDinner: boolean;
    lunchPaymentType?: string;
    lunchValue?: number;
    dinnerPaymentType?: string;
    dinnerWeekdayValue?: number;
    dinnerWeekendValue?: number;
    salary?: number;
  };

  for (const emp of employees as EmployeeData[]) {
    const id = emp.name.toLowerCase().replace(/\s+/g, '-');
    await prisma.employee.upsert({
      where: { id },
      update: {
        worksLunch: emp.worksLunch,
        worksDinner: emp.worksDinner,
        lunchPaymentType: emp.lunchPaymentType || "SHIFT",
        lunchValue: emp.lunchValue || 0,
        dinnerPaymentType: emp.dinnerPaymentType || "SHIFT",
        dinnerWeekdayValue: emp.dinnerWeekdayValue || 0,
        dinnerWeekendValue: emp.dinnerWeekendValue || 0,
        salary: emp.salary || 0,
        lunchStartTime: emp.worksLunch ? "11:00" : null,
        lunchEndTime: emp.worksLunch ? "17:00" : null,
        dinnerStartTime: emp.worksDinner ? "17:00" : null,
        dinnerEndTime: emp.worksDinner ? "00:00" : null,
      },
      create: {
        id,
        name: emp.name,
        role: 'Funcionário',
        salary: emp.salary || 0,
        worksLunch: emp.worksLunch,
        worksDinner: emp.worksDinner,
        lunchPaymentType: emp.lunchPaymentType || "SHIFT",
        lunchValue: emp.lunchValue || 0,
        dinnerPaymentType: emp.dinnerPaymentType || "SHIFT",
        dinnerWeekdayValue: emp.dinnerWeekdayValue || 0,
        dinnerWeekendValue: emp.dinnerWeekendValue || 0,
        lunchStartTime: emp.worksLunch ? "11:00" : null,
        lunchEndTime: emp.worksLunch ? "17:00" : null,
        dinnerStartTime: emp.worksDinner ? "17:00" : null,
        dinnerEndTime: emp.worksDinner ? "00:00" : null,
      },
    });
  }
  console.log(`✅ ${employees.length} funcionários cadastrados`);

  console.log('\n📧 Email: admin@piratapizzaria.com.br');
  console.log('🔑 Senha: admin123');
  console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
  console.log('\n💰 Valores configurados:');
  console.log('   - Almoço: R$ 50,00');
  console.log('   - Jantar (Seg-Sex): R$ 60,00');
  console.log('   - Jantar (Sáb-Dom): R$ 80,00');
  console.log('\n🏴‍☠️ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

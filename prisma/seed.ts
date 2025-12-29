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
    { name: "Andressa", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Bianca", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Caio", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Catia", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Cleber", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Cleia", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Duda", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Duda Loira", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Felipe", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Gil", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Henry", paymentType: "FIXED", worksLunch: true, worksDinner: false, salary: 3000 },
    { name: "Isaias", paymentType: "HOURLY", worksLunch: true, worksDinner: true },
    { name: "Kaio", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Lais", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Lara", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Ligia", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Marina", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Miguel", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Miqueias Moto", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Mudinho", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Nayara", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Rebeca", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Silva", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Stephanie", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Valdeir Moto", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Vinicius", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
    { name: "Vitoria", paymentType: "HOURLY", worksLunch: false, worksDinner: true },
  ];

  for (const emp of employees) {
    const id = emp.name.toLowerCase().replace(/\s+/g, '-');
    await prisma.employee.upsert({
      where: { id },
      update: {
        paymentType: emp.paymentType,
        worksLunch: emp.worksLunch,
        worksDinner: emp.worksDinner,
        salary: (emp as { salary?: number }).salary || 0,
      },
      create: {
        id,
        name: emp.name,
        role: 'Funcionário',
        salary: (emp as { salary?: number }).salary || 0,
        paymentType: emp.paymentType,
        worksLunch: emp.worksLunch,
        worksDinner: emp.worksDinner,
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

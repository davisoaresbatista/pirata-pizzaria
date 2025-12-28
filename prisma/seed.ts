import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@piratapizzaria.com.br" },
    update: {},
    create: {
      email: "admin@piratapizzaria.com.br",
      name: "Administrador",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Usuário admin criado:", admin.email);
  console.log("📧 Email: admin@piratapizzaria.com.br");
  console.log("🔑 Senha: admin123");
  console.log("");
  console.log("⚠️  IMPORTANTE: Altere a senha após o primeiro login!");

  // Criar alguns funcionários de exemplo
  const employees = await Promise.all([
    prisma.employee.upsert({
      where: { id: "emp-1" },
      update: {},
      create: {
        id: "emp-1",
        name: "João Silva",
        role: "Pizzaiolo",
        salary: 2500,
        phone: "(13) 99999-1111",
        document: "123.456.789-00",
      },
    }),
    prisma.employee.upsert({
      where: { id: "emp-2" },
      update: {},
      create: {
        id: "emp-2",
        name: "Maria Santos",
        role: "Garçonete",
        salary: 1800,
        phone: "(13) 99999-2222",
        document: "987.654.321-00",
      },
    }),
    prisma.employee.upsert({
      where: { id: "emp-3" },
      update: {},
      create: {
        id: "emp-3",
        name: "Pedro Oliveira",
        role: "Cozinheiro",
        salary: 2200,
        phone: "(13) 99999-3333",
        document: "456.789.123-00",
      },
    }),
  ]);

  console.log(`✅ ${employees.length} funcionários de exemplo criados`);

  console.log("");
  console.log("🏴‍☠️ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

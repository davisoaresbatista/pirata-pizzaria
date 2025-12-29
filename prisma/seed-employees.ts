import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const employees = [
  "Andressa",
  "Bianca",
  "Caio",
  "Catia",
  "Cleber",
  "Cleia",
  "Duda",
  "Duda Loira",
  "Felipe",
  "Gil",
  "Henry",
  "Isaias",
  "Kaio",
  "Lais",
  "Lara",
  "Ligia",
  "Marina",
  "Miguel",
  "Miqueias Moto",
  "Mudinho",
  "Nayara",
  "Rebeca",
  "Silva",
  "Stephanie",
  "Valdeir Moto",
  "Vinicius",
  "Vitoria",
];

async function main() {
  console.log('🏴‍☠️ Cadastrando funcionários...\n');

  for (const name of employees) {
    const employee = await prisma.employee.upsert({
      where: { 
        id: name.toLowerCase().replace(/\s+/g, '-') 
      },
      update: {},
      create: {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        role: 'Funcionário',
        salary: 0,
      },
    });
    console.log(`✅ ${employee.name}`);
  }

  console.log(`\n🎉 ${employees.length} funcionários cadastrados!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

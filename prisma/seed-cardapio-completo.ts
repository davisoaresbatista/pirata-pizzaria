import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🍽️ Populando cardápio completo (Almoço + Pizzaria)...\n");

  // Limpar dados existentes
  console.log("🗑️ Limpando dados existentes...");
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();

  // ============================================================================
  // CATEGORIAS - ALMOÇO (Restaurante)
  // ============================================================================
  console.log("\n📂 Criando categorias de ALMOÇO...");

  const entradas = await prisma.menuCategory.create({
    data: {
      name: "entradas",
      displayName: "Entradas",
      description: "Saladas e porções de entrada",
      icon: "Salad",
      shift: "lunch",
      order: 1,
      active: true,
    },
  });

  const peixes = await prisma.menuCategory.create({
    data: {
      name: "peixes",
      displayName: "Pratos de Peixe",
      description: "Filés de peixe e salmão frescos",
      icon: "Fish",
      shift: "lunch",
      order: 2,
      active: true,
    },
  });

  const carnes = await prisma.menuCategory.create({
    data: {
      name: "carnes",
      displayName: "Pratos de Carne",
      description: "Contra filé e filé mignon",
      icon: "Beef",
      shift: "lunch",
      order: 3,
      active: true,
    },
  });

  const frango = await prisma.menuCategory.create({
    data: {
      name: "frango",
      displayName: "Pratos de Frango",
      description: "Filés de frango grelhado e à parmegiana",
      icon: "Drumstick",
      shift: "lunch",
      order: 4,
      active: true,
    },
  });

  const massas = await prisma.menuCategory.create({
    data: {
      name: "massas",
      displayName: "Massas",
      description: "Spaghetti e massas especiais",
      icon: "Utensils",
      shift: "lunch",
      order: 5,
      active: true,
    },
  });

  const porcoes = await prisma.menuCategory.create({
    data: {
      name: "porcoes",
      displayName: "Porções",
      description: "Porções para compartilhar",
      icon: "UtensilsCrossed",
      shift: "both",
      order: 6,
      active: true,
    },
  });

  console.log("  ✅ Categorias de almoço criadas");

  // ============================================================================
  // CATEGORIAS - PIZZARIA (Jantar)
  // ============================================================================
  console.log("\n📂 Criando categorias de PIZZARIA...");

  const pizzasSalgadas = await prisma.menuCategory.create({
    data: {
      name: "pizzas_salgadas",
      displayName: "Pizzas Salgadas",
      description: "Nossas deliciosas pizzas tradicionais",
      icon: "Pizza",
      shift: "dinner",
      order: 10,
      active: true,
    },
  });

  const pizzasDoces = await prisma.menuCategory.create({
    data: {
      name: "pizzas_doces",
      displayName: "Pizzas Doces",
      description: "Pizzas doces para finalizar sua refeição",
      icon: "Cake",
      shift: "dinner",
      order: 11,
      active: true,
    },
  });

  console.log("  ✅ Categorias de pizzaria criadas");

  // ============================================================================
  // CATEGORIAS - COMUNS (Bebidas e Sobremesas)
  // ============================================================================
  console.log("\n📂 Criando categorias COMUNS...");

  const bebidas = await prisma.menuCategory.create({
    data: {
      name: "bebidas",
      displayName: "Bebidas",
      description: "Refrigerantes, sucos, águas e cervejas",
      icon: "GlassWater",
      shift: "both",
      order: 20,
      active: true,
    },
  });

  const sobremesas = await prisma.menuCategory.create({
    data: {
      name: "sobremesas",
      displayName: "Sobremesas",
      description: "Sobremesas deliciosas",
      icon: "IceCream",
      shift: "both",
      order: 21,
      active: true,
    },
  });

  console.log("  ✅ Categorias comuns criadas");

  // ============================================================================
  // ITENS - ALMOÇO
  // ============================================================================
  console.log("\n🍴 Adicionando itens de ALMOÇO...");

  // Entradas
  const itensEntradas = [
    { name: "Casquinha de Siri", description: "Casquinha de siri tradicional", price: 29.99, popular: true },
    { name: "Salada Simples", description: "Alface, Tomate, Cebola", price: 14.99, vegetarian: true },
    { name: "Salada Mista", description: "Alface, Tomate, Cebola, Cenoura, Beterraba, Milho e Palmito", price: 24.99, vegetarian: true },
    { name: "Salada de Lula", description: "Alface, Lula Grelhada e um toque de Vinagrete da casa", price: 34.99, featured: true },
  ];

  // Peixes
  const itensPeixes = [
    { name: "Filé de Peixe Grelhado", description: "Arroz, Feijão e Fritas", price: 31.99 },
    { name: "Filé de Peixe à Dorê", description: "Arroz, Feijão e Fritas", price: 32.99 },
    { name: "Filé de Peixe à Milanesa", description: "Arroz, Feijão e Fritas", price: 33.99 },
    { name: "Filé de Peixe ao Molho de Camarão", description: "Arroz e Fritas", price: 59.99, popular: true, featured: true },
    { name: "Salmão Grelhado", description: "Arroz e Legumes salteados", price: 54.99, featured: true },
  ];

  // Carnes
  const itensCarnes = [
    { name: "Contra Filé Grelhado", description: "Arroz, Feijão e Fritas", price: 34.99, popular: true },
    { name: "Filé Mignon à Parmegiana", description: "Arroz e Fritas", price: 44.99, featured: true },
    { name: "Filé Mignon à Milanesa", description: "Arroz, Feijão e Fritas", price: 42.99 },
  ];

  // Frango
  const itensFrango = [
    { name: "Filé de Frango Grelhado", description: "Arroz, Feijão e Fritas", price: 23.99 },
    { name: "Filé de Frango à Milanesa", description: "Arroz, Feijão e Fritas", price: 28.99 },
    { name: "Filé de Frango à Parmegiana", description: "Arroz e Fritas", price: 36.99, popular: true, featured: true },
  ];

  // Massas
  const itensMassas = [
    { name: "Spaghetti c/ Frutos do Mar", description: "Spaghetti com mix de frutos do mar", price: 54.99, featured: true },
    { name: "Spaghetti à Bolonhesa", description: "Spaghetti ao molho bolonhesa", price: 39.99, popular: true },
    { name: "Spaghetti ao Sugo", description: "Spaghetti com molho de tomate", price: 34.99, vegetarian: true },
    { name: "Spaghetti ao Molho Branco", description: "Spaghetti com molho branco cremoso", price: 39.99, vegetarian: true },
  ];

  // Porções
  const itensPorcoes = [
    { name: "Fritas", description: "Porção de batatas fritas crocantes", price: 29.99, vegetarian: true },
    { name: "Frango Crocante", description: "Porção de frango empanado crocante", price: 69.99, popular: true },
    { name: "Isca de Peixe", description: "Iscas de peixe empanadas", price: 79.99 },
    { name: "Camarão à Dorê", description: "Camarões empanados à dorê", price: 89.99, popular: true, featured: true },
  ];

  // ============================================================================
  // ITENS - PIZZARIA
  // ============================================================================
  console.log("\n🍕 Adicionando itens de PIZZARIA...");

  // Pizzas Salgadas
  const itensPizzasSalgadas = [
    { name: "Calabresa", description: "Calabresa fatiada e cebola", price: 39.99, popular: true },
    { name: "Marguerita", description: "Mussarela, parmesão, manjericão fresco e tomate", price: 64.99, popular: true, featured: true },
    { name: "Portuguesa", description: "Presunto, ovos, cebola, palmito, ervilha e mussarela", price: 69.99, popular: true },
    { name: "4 Queijos", description: "Requeijão cremoso, mussarela, parmesão e provolone", price: 69.99, popular: true },
    { name: "Mussarela", description: "Mussarela de qualidade e orégano", price: 54.99, popular: true },
    { name: "Frango com Catupiry", description: "Frango desfiado e catupiry original", price: 64.99, popular: true },
    { name: "Pepperoni", description: "Pepperoni importado e mussarela", price: 69.99, spicy: true },
    { name: "Bacon", description: "Bacon crocante, mussarela e cebola", price: 64.99 },
    { name: "Atum", description: "Atum sólido, cebola e azeitonas", price: 64.99 },
    { name: "Napolitana", description: "Tomate, mussarela, parmesão e manjericão", price: 59.99, vegetarian: true },
    { name: "Palmito", description: "Palmito, mussarela e azeitonas", price: 64.99, vegetarian: true },
    { name: "Strogonoff", description: "Strogonoff de frango e batata palha", price: 69.99, newItem: true },
    { name: "Baiana", description: "Calabresa, pimenta, cebola e ovo", price: 64.99, spicy: true },
    { name: "Camarão", description: "Camarões frescos e catupiry", price: 89.99, featured: true },
    { name: "Carne Seca", description: "Carne seca desfiada, cream cheese e cebola", price: 79.99 },
    { name: "Parma", description: "Presunto parma, rúcula e tomate seco", price: 84.99, featured: true },
  ];

  // Pizzas Doces
  const itensPizzasDoces = [
    { name: "Brigadeiro", description: "Chocolate ao leite e granulado", price: 69.99, popular: true },
    { name: "Sensação", description: "Chocolate ao leite e morango fresco", price: 69.99, popular: true },
    { name: "Romeu e Julieta", description: "Goiabada cascão e queijo minas", price: 64.99, popular: true },
    { name: "Banana com Canela", description: "Banana, açúcar e canela", price: 59.99 },
    { name: "Prestígio", description: "Chocolate e coco ralado", price: 69.99 },
    { name: "Nutella", description: "Creme de avelã Nutella", price: 74.99, featured: true, popular: true },
  ];

  // ============================================================================
  // ITENS - COMUNS
  // ============================================================================
  console.log("\n🥤 Adicionando BEBIDAS e SOBREMESAS...");

  // Bebidas
  const itensBebidas = [
    { name: "Coca-Cola Lata", description: "350ml", price: 7.00 },
    { name: "Coca-Cola 600ml", description: "Garrafa", price: 10.00 },
    { name: "Coca-Cola 2L", description: "Garrafa", price: 15.00 },
    { name: "Guaraná Antarctica Lata", description: "350ml", price: 6.00 },
    { name: "Guaraná Antarctica 2L", description: "Garrafa", price: 12.00 },
    { name: "Suco Natural", description: "Laranja, Limão ou Maracujá - 500ml", price: 10.00, vegetarian: true },
    { name: "Água Mineral", description: "500ml", price: 4.00 },
    { name: "Água com Gás", description: "500ml", price: 5.00 },
    { name: "Cerveja Heineken", description: "Long Neck 355ml", price: 12.00 },
    { name: "Cerveja Budweiser", description: "Long Neck 355ml", price: 11.00 },
    { name: "Caipirinha", description: "Drink tradicional de cachaça com limão", price: 22.00, popular: true },
    { name: "Caipiroska", description: "Drink de vodka com limão", price: 27.00, popular: true },
  ];

  // Sobremesas
  const itensSobremesas = [
    { name: "Petit Gateau", description: "Bolo de chocolate com sorvete e calda quente", price: 24.99, featured: true, popular: true },
    { name: "Pudim", description: "Pudim de leite condensado", price: 14.00, popular: true },
    { name: "Brownie com Sorvete", description: "Brownie de chocolate com sorvete de creme", price: 22.00 },
    { name: "Mousse de Maracujá", description: "Mousse cremoso de maracujá", price: 14.00 },
  ];

  // ============================================================================
  // CRIAR TODOS OS ITENS
  // ============================================================================

  const createItems = async (categoryId: string, items: Array<{
    name: string;
    description: string;
    price: number;
    featured?: boolean;
    popular?: boolean;
    vegetarian?: boolean;
    spicy?: boolean;
    newItem?: boolean;
  }>) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await prisma.menuItem.create({
        data: {
          categoryId,
          name: item.name,
          description: item.description,
          price: item.price,
          active: true,
          featured: item.featured || false,
          popular: item.popular || false,
          vegetarian: item.vegetarian || false,
          spicy: item.spicy || false,
          newItem: item.newItem || false,
          order: i + 1,
        },
      });
    }
    return items.length;
  };

  // Almoço
  const countEntradas = await createItems(entradas.id, itensEntradas);
  const countPeixes = await createItems(peixes.id, itensPeixes);
  const countCarnes = await createItems(carnes.id, itensCarnes);
  const countFrango = await createItems(frango.id, itensFrango);
  const countMassas = await createItems(massas.id, itensMassas);
  const countPorcoes = await createItems(porcoes.id, itensPorcoes);

  // Pizzaria
  const countPizzasSalgadas = await createItems(pizzasSalgadas.id, itensPizzasSalgadas);
  const countPizzasDoces = await createItems(pizzasDoces.id, itensPizzasDoces);

  // Comuns
  const countBebidas = await createItems(bebidas.id, itensBebidas);
  const countSobremesas = await createItems(sobremesas.id, itensSobremesas);

  // ============================================================================
  // RESUMO
  // ============================================================================
  console.log("\n" + "=".repeat(50));
  console.log("📊 RESUMO DO CARDÁPIO COMPLETO");
  console.log("=".repeat(50));
  
  console.log("\n🍽️ ALMOÇO (Seg-Sex 11h-15h):");
  console.log(`   • Entradas: ${countEntradas} itens`);
  console.log(`   • Peixes: ${countPeixes} itens`);
  console.log(`   • Carnes: ${countCarnes} itens`);
  console.log(`   • Frango: ${countFrango} itens`);
  console.log(`   • Massas: ${countMassas} itens`);
  
  console.log("\n🍕 PIZZARIA (Ter-Dom 18h-23h):");
  console.log(`   • Pizzas Salgadas: ${countPizzasSalgadas} itens`);
  console.log(`   • Pizzas Doces: ${countPizzasDoces} itens`);
  
  console.log("\n🥤 COMUM (Ambos os turnos):");
  console.log(`   • Porções: ${countPorcoes} itens`);
  console.log(`   • Bebidas: ${countBebidas} itens`);
  console.log(`   • Sobremesas: ${countSobremesas} itens`);
  
  const total = countEntradas + countPeixes + countCarnes + countFrango + countMassas + 
                countPorcoes + countPizzasSalgadas + countPizzasDoces + countBebidas + countSobremesas;
  
  console.log("\n" + "=".repeat(50));
  console.log(`✅ TOTAL: ${total} itens em 10 categorias`);
  console.log("=".repeat(50));
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


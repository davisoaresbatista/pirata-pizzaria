import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🍕 Populando cardápio...\n");

  // ============================================================================
  // CATEGORIAS
  // ============================================================================
  
  const pizzasSalgadas = await prisma.menuCategory.upsert({
    where: { name: "pizzas_salgadas" },
    update: {},
    create: {
      name: "pizzas_salgadas",
      displayName: "Pizzas Salgadas",
      description: "Nossas deliciosas pizzas salgadas tradicionais",
      icon: "Pizza",
      order: 1,
      active: true,
    },
  });
  console.log(`✅ Categoria: ${pizzasSalgadas.displayName}`);

  const pizzasDoces = await prisma.menuCategory.upsert({
    where: { name: "pizzas_doces" },
    update: {},
    create: {
      name: "pizzas_doces",
      displayName: "Pizzas Doces",
      description: "Pizzas doces para finalizar sua refeição",
      icon: "Cake",
      order: 2,
      active: true,
    },
  });
  console.log(`✅ Categoria: ${pizzasDoces.displayName}`);

  const bebidas = await prisma.menuCategory.upsert({
    where: { name: "bebidas" },
    update: {},
    create: {
      name: "bebidas",
      displayName: "Bebidas",
      description: "Refrigerantes, sucos e cervejas",
      icon: "Wine",
      order: 3,
      active: true,
    },
  });
  console.log(`✅ Categoria: ${bebidas.displayName}`);

  const sobremesas = await prisma.menuCategory.upsert({
    where: { name: "sobremesas" },
    update: {},
    create: {
      name: "sobremesas",
      displayName: "Sobremesas",
      description: "Sobremesas deliciosas",
      icon: "IceCream",
      order: 4,
      active: true,
    },
  });
  console.log(`✅ Categoria: ${sobremesas.displayName}`);

  // ============================================================================
  // PIZZAS SALGADAS
  // ============================================================================
  console.log("\n🍕 Adicionando pizzas salgadas...");

  const pizzasSalgadasItens = [
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
    { name: "Milho", description: "Milho verde e mussarela", price: 54.99, vegetarian: true },
    { name: "Brócolis", description: "Brócolis, bacon e mussarela", price: 64.99 },
    { name: "Strogonoff", description: "Strogonoff de frango e batata palha", price: 69.99, newItem: true },
    { name: "Baiana", description: "Calabresa, pimenta, cebola e ovo", price: 64.99, spicy: true },
    { name: "Lombo Canadense", description: "Lombo canadense e mussarela", price: 69.99 },
    { name: "Alho e Óleo", description: "Alho dourado, azeite e mussarela", price: 54.99, vegetarian: true },
    { name: "Camarão", description: "Camarões frescos e catupiry", price: 89.99, featured: true },
    { name: "Carne Seca", description: "Carne seca desfiada, cream cheese e cebola", price: 79.99 },
    { name: "Parma", description: "Presunto parma, rúcula e tomate seco", price: 84.99, featured: true },
  ];

  for (let i = 0; i < pizzasSalgadasItens.length; i++) {
    const item = pizzasSalgadasItens[i];
    await prisma.menuItem.upsert({
      where: {
        id: `pizza-salgada-${i + 1}`,
      },
      update: {
        ...item,
        order: i + 1,
      },
      create: {
        id: `pizza-salgada-${i + 1}`,
        categoryId: pizzasSalgadas.id,
        ...item,
        order: i + 1,
        active: true,
        featured: item.featured || false,
        popular: item.popular || false,
        spicy: item.spicy || false,
        vegetarian: item.vegetarian || false,
        newItem: item.newItem || false,
      },
    });
    console.log(`  ✅ ${item.name}`);
  }

  // ============================================================================
  // PIZZAS DOCES
  // ============================================================================
  console.log("\n🍫 Adicionando pizzas doces...");

  const pizzasDocesItens = [
    { name: "Brigadeiro", description: "Chocolate ao leite e granulado", price: 69.99, popular: true },
    { name: "Sensação", description: "Chocolate ao leite e morango fresco", price: 69.99, popular: true },
    { name: "Romeu e Julieta", description: "Goiabada cascão e queijo minas", price: 64.99, popular: true },
    { name: "Banana com Canela", description: "Banana, açúcar e canela", price: 59.99 },
    { name: "Prestígio", description: "Chocolate e coco ralado", price: 69.99 },
    { name: "Doce de Leite", description: "Doce de leite e coco", price: 64.99 },
    { name: "Nutella", description: "Creme de avelã Nutella", price: 74.99, featured: true, popular: true },
    { name: "Abacaxi com Canela", description: "Abacaxi caramelizado e canela", price: 59.99 },
  ];

  for (let i = 0; i < pizzasDocesItens.length; i++) {
    const item = pizzasDocesItens[i];
    await prisma.menuItem.upsert({
      where: {
        id: `pizza-doce-${i + 1}`,
      },
      update: {
        ...item,
        order: i + 1,
      },
      create: {
        id: `pizza-doce-${i + 1}`,
        categoryId: pizzasDoces.id,
        ...item,
        order: i + 1,
        active: true,
        featured: item.featured || false,
        popular: item.popular || false,
        spicy: false,
        vegetarian: true,
        newItem: false,
      },
    });
    console.log(`  ✅ ${item.name}`);
  }

  // ============================================================================
  // BEBIDAS
  // ============================================================================
  console.log("\n🥤 Adicionando bebidas...");

  const bebidasItens = [
    { name: "Coca-Cola Lata", description: "350ml", price: 7.00 },
    { name: "Coca-Cola 600ml", description: "Garrafa", price: 10.00 },
    { name: "Coca-Cola 2L", description: "Garrafa", price: 15.00 },
    { name: "Guaraná Antarctica Lata", description: "350ml", price: 6.00 },
    { name: "Guaraná Antarctica 2L", description: "Garrafa", price: 12.00 },
    { name: "Sprite Lata", description: "350ml", price: 6.00 },
    { name: "Fanta Laranja Lata", description: "350ml", price: 6.00 },
    { name: "Suco Natural", description: "Laranja, Limão ou Maracujá - 500ml", price: 10.00 },
    { name: "Água Mineral", description: "500ml", price: 4.00 },
    { name: "Água com Gás", description: "500ml", price: 5.00 },
    { name: "Cerveja Brahma", description: "600ml", price: 12.00 },
    { name: "Cerveja Heineken", description: "Long Neck", price: 12.00 },
    { name: "Cerveja Stella Artois", description: "Long Neck", price: 14.00 },
  ];

  for (let i = 0; i < bebidasItens.length; i++) {
    const item = bebidasItens[i];
    await prisma.menuItem.upsert({
      where: {
        id: `bebida-${i + 1}`,
      },
      update: {
        ...item,
        order: i + 1,
      },
      create: {
        id: `bebida-${i + 1}`,
        categoryId: bebidas.id,
        ...item,
        order: i + 1,
        active: true,
        featured: false,
        popular: false,
        spicy: false,
        vegetarian: true,
        newItem: false,
      },
    });
    console.log(`  ✅ ${item.name}`);
  }

  // ============================================================================
  // SOBREMESAS
  // ============================================================================
  console.log("\n🍨 Adicionando sobremesas...");

  const sobremesasItens = [
    { name: "Petit Gateau", description: "Bolo de chocolate com sorvete e calda quente", price: 24.99, featured: true, popular: true },
    { name: "Sorvete", description: "2 bolas - Chocolate, Creme ou Morango", price: 12.00 },
    { name: "Pudim", description: "Pudim de leite condensado", price: 14.00, popular: true },
    { name: "Mousse de Maracujá", description: "Mousse cremoso de maracujá", price: 14.00 },
    { name: "Brownie com Sorvete", description: "Brownie de chocolate com sorvete de creme", price: 22.00 },
  ];

  for (let i = 0; i < sobremesasItens.length; i++) {
    const item = sobremesasItens[i];
    await prisma.menuItem.upsert({
      where: {
        id: `sobremesa-${i + 1}`,
      },
      update: {
        ...item,
        order: i + 1,
      },
      create: {
        id: `sobremesa-${i + 1}`,
        categoryId: sobremesas.id,
        ...item,
        order: i + 1,
        active: true,
        featured: item.featured || false,
        popular: item.popular || false,
        spicy: false,
        vegetarian: true,
        newItem: false,
      },
    });
    console.log(`  ✅ ${item.name}`);
  }

  console.log("\n✅ Cardápio populado com sucesso!");
  console.log(`   📂 ${4} categorias`);
  console.log(`   🍕 ${pizzasSalgadasItens.length} pizzas salgadas`);
  console.log(`   🍫 ${pizzasDocesItens.length} pizzas doces`);
  console.log(`   🥤 ${bebidasItens.length} bebidas`);
  console.log(`   🍨 ${sobremesasItens.length} sobremesas`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

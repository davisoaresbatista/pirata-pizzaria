import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🍽️ Iniciando seed do cardápio extraído do PDF...\n");

  // Primeiro, limpar dados existentes
  console.log("🗑️ Limpando dados existentes...");
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();

  // ============================================================================
  // CATEGORIAS
  // ============================================================================

  console.log("📂 Criando categorias...");

  const categorias = await Promise.all([
    prisma.menuCategory.create({
      data: {
        name: "entradas",
        displayName: "Entradas",
        description: "Saladas e porções de entrada",
        icon: "Salad",
        order: 0,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "peixes_individual",
        displayName: "Pratos de Peixe (Individual)",
        description: "Pratos de peixe para uma pessoa",
        icon: "Fish",
        order: 1,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "peixes_duplo",
        displayName: "Pratos de Peixe (2 Pessoas)",
        description: "Pratos de peixe para duas pessoas",
        icon: "Fish",
        order: 2,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "carnes_individual",
        displayName: "Pratos de Carne (Individual)",
        description: "Pratos de carne para uma pessoa",
        icon: "Beef",
        order: 3,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "carnes_duplo",
        displayName: "Pratos de Carne (2 Pessoas)",
        description: "Pratos de carne para duas pessoas",
        icon: "Beef",
        order: 4,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "frango_individual",
        displayName: "Pratos de Frango (Individual)",
        description: "Pratos de frango para uma pessoa",
        icon: "Drumstick",
        order: 5,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "frango_duplo",
        displayName: "Pratos de Frango (2 Pessoas)",
        description: "Pratos de frango para duas pessoas",
        icon: "Drumstick",
        order: 6,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "massas",
        displayName: "Massas",
        description: "Pratos de massas",
        icon: "Utensils",
        order: 7,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "porcoes",
        displayName: "Porções",
        description: "Porções para compartilhar",
        icon: "UtensilsCrossed",
        order: 8,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "risotos",
        displayName: "Risotos",
        description: "Risotos especiais",
        icon: "Soup",
        order: 9,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "bebidas_alcoolicas",
        displayName: "Bebidas Alcoólicas",
        description: "Cervejas, vinhos e drinks",
        icon: "Wine",
        order: 10,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "bebidas_nao_alcoolicas",
        displayName: "Bebidas Não Alcoólicas",
        description: "Sucos, refrigerantes e águas",
        icon: "GlassWater",
        order: 11,
        active: true,
      },
    }),
  ]);

  const [
    entradas,
    peixesIndividual,
    peixesDuplo,
    carnesIndividual,
    carnesDuplo,
    frangoIndividual,
    frangoDuplo,
    massas,
    porcoes,
    risotos,
    bebidasAlcoolicas,
    bebidasNaoAlcoolicas,
  ] = categorias;

  console.log(`✅ ${categorias.length} categorias criadas`);

  // ============================================================================
  // ITENS DO CARDÁPIO
  // ============================================================================

  console.log("\n🍴 Criando itens do cardápio...");

  // ENTRADAS
  const itensEntradas = [
    { name: "Casquinha de Siri", description: "Casquinha de siri tradicional", price: 29.99, popular: true },
    { name: "Salada Simples", description: "Alface, Tomate, Cebola", price: 14.99, vegetarian: true },
    { name: "Salada Mista", description: "Alface, Tomate, Cebola, Cenoura, Beterraba, Milho e Palmito", price: 24.99, vegetarian: true },
    { name: "Salada de Lula", description: "Alface, Lula Grelhada e um toque de Vinagrete da casa", price: 34.99, featured: true },
    { name: "Salada de Marisco", description: "Alface, Marisco e Vinagrete", price: 34.99 },
  ];

  // PEIXES INDIVIDUAL
  const itensPeixesIndividual = [
    { name: "Filé de Peixe Grelhado", description: "Arroz, Feijão e Fritas", price: 31.99 },
    { name: "Filé de Peixe à Dorê", description: "Arroz, Feijão e Fritas", price: 32.99 },
    { name: "Filé de Peixe à Milanesa", description: "Arroz, Feijão e Fritas", price: 33.99 },
    { name: "Filé de Peixe à Belle Meuniere", description: "Arroz e Batata Sautê", price: 54.99, featured: true },
    { name: "Filé de Peixe ao Molho de Camarão", description: "Arroz e Fritas", price: 59.99, popular: true },
    { name: "Salmão Grelhado c/ Spaghetti de Legumes", description: "Arroz e Spaghetti de Legumes", price: 54.99, featured: true },
    { name: "Salmão Grelhado c/ Legumes", description: "Arroz e Legumes", price: 54.99 },
  ];

  // PEIXES DUPLO (2 pessoas)
  const itensPeixesDuplo = [
    { name: "Filé de Peixe Grelhado (2 pessoas)", description: "Arroz, Feijão e Fritas", price: 59.99 },
    { name: "Filé de Peixe à Dorê (2 pessoas)", description: "Arroz, Feijão e Fritas", price: 61.99 },
    { name: "Filé de Peixe à Milanesa (2 pessoas)", description: "Arroz, Feijão e Fritas", price: 63.99 },
    { name: "Filé de Peixe ao Molho de Camarão (2 pessoas)", description: "Arroz e Fritas", price: 109.99, featured: true },
  ];

  // CARNES INDIVIDUAL
  const itensCarnesIndividual = [
    { name: "Contra Filé Grelhado", description: "Arroz, Feijão e Fritas", price: 34.99, popular: true },
    { name: "Filé Mignon à Parmegiana", description: "Arroz e Fritas", price: 44.99, featured: true },
    { name: "Filé Mignon à Milanesa", description: "Arroz, Feijão e Fritas", price: 42.99 },
  ];

  // CARNES DUPLO (2 pessoas)
  const itensCarnesDuplo = [
    { name: "Contra Filé Grelhado (2 pessoas)", description: "Arroz, Feijão e Fritas", price: 67.99 },
    { name: "Filé Mignon à Parmegiana (2 pessoas)", description: "Arroz e Fritas", price: 89.99, featured: true },
    { name: "Filé Mignon à Milanesa (2 pessoas)", description: "Arroz, Feijão e Fritas", price: 85.99 },
  ];

  // FRANGO INDIVIDUAL
  const itensFrangoIndividual = [
    { name: "Filé de Frango Grelhado", description: "Arroz, Feijão e Fritas", price: 23.99 },
    { name: "Filé de Frango à Milanesa", description: "Arroz, Feijão e Fritas", price: 28.99 },
    { name: "Filé de Frango c/ Legumes", description: "Arroz, Feijão e Fritas", price: 31.99 },
    { name: "Filé de Frango à Parmegiana", description: "Arroz e Fritas", price: 36.99, popular: true },
  ];

  // FRANGO DUPLO (2 pessoas)
  const itensFrangoDuplo = [
    { name: "Filé de Frango Grelhado (2 pessoas)", description: "Arroz, Feijão e Fritas", price: 45.99 },
    { name: "Filé de Frango à Milanesa (2 pessoas)", description: "Arroz, Feijão e Fritas", price: 55.99 },
    { name: "Filé de Frango c/ Legumes (2 pessoas)", description: "Arroz, Feijão e Fritas", price: 59.99 },
    { name: "Filé de Frango à Parmegiana (2 pessoas)", description: "Arroz e Fritas", price: 69.99, featured: true },
  ];

  // MASSAS
  const itensMassas = [
    { name: "Spaghetti c/ Frutos do Mar", description: "Spaghetti com mix de frutos do mar", price: 54.99, featured: true },
    { name: "Spaghetti à Bolonhesa", description: "Spaghetti ao molho bolonhesa", price: 39.99, popular: true },
    { name: "Spaghetti ao Sugo", description: "Spaghetti com molho de tomate", price: 34.99, vegetarian: true },
    { name: "Spaghetti ao Molho Branco", description: "Spaghetti com molho branco cremoso", price: 39.99, vegetarian: true },
    { name: "Adicional: Escalope de Mignon", description: "Filé Mignon para adicionar às massas", price: 29.99 },
    { name: "Adicional: Filé de Frango Grelhado", description: "Frango grelhado para adicionar às massas", price: 15.99 },
  ];

  // PORÇÕES
  const itensPorcoes = [
    { name: "Fritas", description: "Porção de batatas fritas crocantes", price: 29.99, vegetarian: true },
    { name: "Frango Crocante", description: "Porção de frango empanado crocante", price: 69.99, popular: true },
    { name: "Isca de Peixe", description: "Iscas de peixe empanadas", price: 79.99 },
    { name: "Lula à Dorê", description: "Lula empanada à dorê", price: 99.99, featured: true },
    { name: "Camarão à Dorê", description: "Camarões empanados à dorê", price: 89.99, popular: true },
    { name: "Camarão à Paulistinha", description: "Camarão ao alho e óleo", price: 89.99, featured: true },
    { name: "Marisco à Vinagrete", description: "Marisco com vinagrete especial", price: 94.99 },
  ];

  // RISOTOS
  const itensRisotos = [
    { name: "Risoto de Filé Mignon", description: "Risoto cremoso com filé mignon", price: 74.99, featured: true },
    { name: "Risoto de Frutos do Mar", description: "Risoto com mix de frutos do mar", price: 99.99, featured: true, popular: true },
    { name: "Risoto 3 Queijos", description: "Risoto cremoso com três tipos de queijo", price: 69.99, vegetarian: true },
  ];

  // BEBIDAS ALCOÓLICAS
  const itensBebidasAlcoolicas = [
    { name: "Heineken Long Neck", description: "Cerveja Heineken 355ml", price: 12.00 },
    { name: "Cerveja Sem Álcool Long Neck", description: "Cerveja sem álcool 355ml", price: 12.00 },
    { name: "Budweiser Long Neck", description: "Cerveja Budweiser 355ml", price: 11.00 },
    { name: "Império Lager Long Neck", description: "Cerveja Império Lager 355ml", price: 10.00 },
    { name: "Malzbier Long Neck", description: "Cerveja Malzbier 355ml", price: 11.00 },
    { name: "Império Pilsen Long Neck", description: "Cerveja Império Pilsen 355ml", price: 9.00 },
    { name: "Caipiroska", description: "Drink de vodka com limão", price: 27.00, popular: true },
    { name: "Batida de Vodka", description: "Batida cremosa de vodka", price: 30.00 },
    { name: "Caipirinha", description: "Drink tradicional de cachaça com limão", price: 22.00, popular: true },
    { name: "Espanhola", description: "Drink de vinho com frutas", price: 26.00 },
    { name: "Batida de Pinga", description: "Batida cremosa de cachaça", price: 24.00 },
    { name: "Taça de Vinho", description: "Taça de vinho tinto ou branco", price: 15.00 },
    { name: "Garrafa de Vinho", description: "Garrafa de vinho da casa", price: 35.00 },
  ];

  // BEBIDAS NÃO ALCOÓLICAS
  const itensBebidasNaoAlcoolicas = [
    { name: "Sucos com Água", description: "Suco natural com água", price: 18.00, vegetarian: true },
    { name: "Schweppes Lata", description: "Schweppes citrus 350ml", price: 8.00, vegetarian: true },
    { name: "Sucos com Laranja ou Leite", description: "Suco natural com laranja ou leite", price: 20.00, vegetarian: true },
    { name: "Tônica Lata", description: "Água tônica 350ml", price: 8.00, vegetarian: true },
    { name: "Suco de Laranja", description: "Suco de laranja natural", price: 18.00, vegetarian: true, popular: true },
    { name: "Água 500ml", description: "Água mineral sem gás", price: 5.00, vegetarian: true },
    { name: "Refrigerante Lata", description: "Coca-Cola, Guaraná ou Fanta 350ml", price: 7.00, vegetarian: true },
    { name: "Água com Gás 500ml", description: "Água mineral com gás", price: 6.00, vegetarian: true },
    { name: "Refrigerante 2L", description: "Refrigerante garrafa 2 litros", price: 18.00, vegetarian: true },
    { name: "Energético", description: "Energético Red Bull ou Monster", price: 20.00, vegetarian: true },
    { name: "H2OH", description: "Refrigerante H2OH 500ml", price: 9.00, vegetarian: true },
  ];

  // Função helper para criar itens
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
    return Promise.all(
      items.map((item, index) =>
        prisma.menuItem.create({
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
            order: index,
          },
        })
      )
    );
  };

  // Criar todos os itens
  const [
    entradasCreated,
    peixesIndCreated,
    peixesDupCreated,
    carnesIndCreated,
    carnesDupCreated,
    frangoIndCreated,
    frangoDupCreated,
    massasCreated,
    porcoesCreated,
    risotosCreated,
    bebidasAlcCreated,
    bebidasNaoAlcCreated,
  ] = await Promise.all([
    createItems(entradas.id, itensEntradas),
    createItems(peixesIndividual.id, itensPeixesIndividual),
    createItems(peixesDuplo.id, itensPeixesDuplo),
    createItems(carnesIndividual.id, itensCarnesIndividual),
    createItems(carnesDuplo.id, itensCarnesDuplo),
    createItems(frangoIndividual.id, itensFrangoIndividual),
    createItems(frangoDuplo.id, itensFrangoDuplo),
    createItems(massas.id, itensMassas),
    createItems(porcoes.id, itensPorcoes),
    createItems(risotos.id, itensRisotos),
    createItems(bebidasAlcoolicas.id, itensBebidasAlcoolicas),
    createItems(bebidasNaoAlcoolicas.id, itensBebidasNaoAlcoolicas),
  ]);

  const totalItens =
    entradasCreated.length +
    peixesIndCreated.length +
    peixesDupCreated.length +
    carnesIndCreated.length +
    carnesDupCreated.length +
    frangoIndCreated.length +
    frangoDupCreated.length +
    massasCreated.length +
    porcoesCreated.length +
    risotosCreated.length +
    bebidasAlcCreated.length +
    bebidasNaoAlcCreated.length;

  console.log(`✅ ${totalItens} itens criados\n`);

  // Resumo
  console.log("📊 RESUMO DO CARDÁPIO:");
  console.log("========================");
  console.log(`📂 Categorias: ${categorias.length}`);
  console.log(`🍽️ Total de itens: ${totalItens}`);
  console.log("");
  console.log("Por categoria:");
  console.log(`  • Entradas: ${entradasCreated.length}`);
  console.log(`  • Peixes (Individual): ${peixesIndCreated.length}`);
  console.log(`  • Peixes (2 Pessoas): ${peixesDupCreated.length}`);
  console.log(`  • Carnes (Individual): ${carnesIndCreated.length}`);
  console.log(`  • Carnes (2 Pessoas): ${carnesDupCreated.length}`);
  console.log(`  • Frango (Individual): ${frangoIndCreated.length}`);
  console.log(`  • Frango (2 Pessoas): ${frangoDupCreated.length}`);
  console.log(`  • Massas: ${massasCreated.length}`);
  console.log(`  • Porções: ${porcoesCreated.length}`);
  console.log(`  • Risotos: ${risotosCreated.length}`);
  console.log(`  • Bebidas Alcoólicas: ${bebidasAlcCreated.length}`);
  console.log(`  • Bebidas Não Alcoólicas: ${bebidasNaoAlcCreated.length}`);
  console.log("");
  console.log("🎉 Seed do cardápio concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


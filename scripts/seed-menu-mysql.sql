-- ============================================================================
-- SEED DO CARDÁPIO (MySQL - Hostinger)
-- Execute este script APÓS criar as tabelas
-- ============================================================================

-- Limpar dados existentes
DELETE FROM `menu_items`;
DELETE FROM `menu_categories`;

-- ============================================================================
-- CATEGORIAS
-- ============================================================================

INSERT INTO `menu_categories` (`id`, `name`, `displayName`, `description`, `icon`, `order`, `active`, `createdAt`, `updatedAt`) VALUES
('cat_entradas', 'entradas', 'Entradas', 'Saladas e porções de entrada', 'Salad', 0, TRUE, NOW(), NOW()),
('cat_peixes_ind', 'peixes_individual', 'Pratos de Peixe (Individual)', 'Pratos de peixe para uma pessoa', 'Fish', 1, TRUE, NOW(), NOW()),
('cat_peixes_dup', 'peixes_duplo', 'Pratos de Peixe (2 Pessoas)', 'Pratos de peixe para duas pessoas', 'Fish', 2, TRUE, NOW(), NOW()),
('cat_carnes_ind', 'carnes_individual', 'Pratos de Carne (Individual)', 'Pratos de carne para uma pessoa', 'Beef', 3, TRUE, NOW(), NOW()),
('cat_carnes_dup', 'carnes_duplo', 'Pratos de Carne (2 Pessoas)', 'Pratos de carne para duas pessoas', 'Beef', 4, TRUE, NOW(), NOW()),
('cat_frango_ind', 'frango_individual', 'Pratos de Frango (Individual)', 'Pratos de frango para uma pessoa', 'Drumstick', 5, TRUE, NOW(), NOW()),
('cat_frango_dup', 'frango_duplo', 'Pratos de Frango (2 Pessoas)', 'Pratos de frango para duas pessoas', 'Drumstick', 6, TRUE, NOW(), NOW()),
('cat_massas', 'massas', 'Massas', 'Pratos de massas', 'Utensils', 7, TRUE, NOW(), NOW()),
('cat_porcoes', 'porcoes', 'Porções', 'Porções para compartilhar', 'UtensilsCrossed', 8, TRUE, NOW(), NOW()),
('cat_risotos', 'risotos', 'Risotos', 'Risotos especiais', 'Soup', 9, TRUE, NOW(), NOW()),
('cat_bebidas_alc', 'bebidas_alcoolicas', 'Bebidas Alcoólicas', 'Cervejas, vinhos e drinks', 'Wine', 10, TRUE, NOW(), NOW()),
('cat_bebidas_nao', 'bebidas_nao_alcoolicas', 'Bebidas Não Alcoólicas', 'Sucos, refrigerantes e águas', 'GlassWater', 11, TRUE, NOW(), NOW());

-- ============================================================================
-- ENTRADAS
-- ============================================================================

INSERT INTO `menu_items` (`id`, `categoryId`, `name`, `description`, `price`, `active`, `featured`, `popular`, `spicy`, `vegetarian`, `newItem`, `order`, `createdAt`, `updatedAt`) VALUES
('item_001', 'cat_entradas', 'Casquinha de Siri', 'Casquinha de siri tradicional', 29.99, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 0, NOW(), NOW()),
('item_002', 'cat_entradas', 'Salada Simples', 'Alface, Tomate, Cebola', 14.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 1, NOW(), NOW()),
('item_003', 'cat_entradas', 'Salada Mista', 'Alface, Tomate, Cebola, Cenoura, Beterraba, Milho e Palmito', 24.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 2, NOW(), NOW()),
('item_004', 'cat_entradas', 'Salada de Lula', 'Alface, Lula Grelhada e um toque de Vinagrete da casa', 34.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 3, NOW(), NOW()),
('item_005', 'cat_entradas', 'Salada de Marisco', 'Alface, Marisco e Vinagrete', 34.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 4, NOW(), NOW());

-- ============================================================================
-- PEIXES INDIVIDUAL
-- ============================================================================

INSERT INTO `menu_items` (`id`, `categoryId`, `name`, `description`, `price`, `active`, `featured`, `popular`, `spicy`, `vegetarian`, `newItem`, `order`, `createdAt`, `updatedAt`) VALUES
('item_010', 'cat_peixes_ind', 'Filé de Peixe Grelhado', 'Arroz, Feijão e Fritas', 31.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 0, NOW(), NOW()),
('item_011', 'cat_peixes_ind', 'Filé de Peixe à Dorê', 'Arroz, Feijão e Fritas', 32.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_012', 'cat_peixes_ind', 'Filé de Peixe à Milanesa', 'Arroz, Feijão e Fritas', 33.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 2, NOW(), NOW()),
('item_013', 'cat_peixes_ind', 'Filé de Peixe à Belle Meuniere', 'Arroz e Batata Sautê', 54.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 3, NOW(), NOW()),
('item_014', 'cat_peixes_ind', 'Filé de Peixe ao Molho de Camarão', 'Arroz e Fritas', 59.99, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 4, NOW(), NOW()),
('item_015', 'cat_peixes_ind', 'Salmão Grelhado c/ Spaghetti de Legumes', 'Arroz e Spaghetti de Legumes', 54.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 5, NOW(), NOW()),
('item_016', 'cat_peixes_ind', 'Salmão Grelhado c/ Legumes', 'Arroz e Legumes', 54.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 6, NOW(), NOW());

-- ============================================================================
-- PEIXES DUPLO
-- ============================================================================

INSERT INTO `menu_items` (`id`, `categoryId`, `name`, `description`, `price`, `active`, `featured`, `popular`, `spicy`, `vegetarian`, `newItem`, `order`, `createdAt`, `updatedAt`) VALUES
('item_020', 'cat_peixes_dup', 'Filé de Peixe Grelhado (2 pessoas)', 'Arroz, Feijão e Fritas', 59.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 0, NOW(), NOW()),
('item_021', 'cat_peixes_dup', 'Filé de Peixe à Dorê (2 pessoas)', 'Arroz, Feijão e Fritas', 61.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_022', 'cat_peixes_dup', 'Filé de Peixe à Milanesa (2 pessoas)', 'Arroz, Feijão e Fritas', 63.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 2, NOW(), NOW()),
('item_023', 'cat_peixes_dup', 'Filé de Peixe ao Molho de Camarão (2 pessoas)', 'Arroz e Fritas', 109.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 3, NOW(), NOW());

-- ============================================================================
-- CARNES INDIVIDUAL
-- ============================================================================

INSERT INTO `menu_items` (`id`, `categoryId`, `name`, `description`, `price`, `active`, `featured`, `popular`, `spicy`, `vegetarian`, `newItem`, `order`, `createdAt`, `updatedAt`) VALUES
('item_030', 'cat_carnes_ind', 'Contra Filé Grelhado', 'Arroz, Feijão e Fritas', 34.99, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 0, NOW(), NOW()),
('item_031', 'cat_carnes_ind', 'Filé Mignon à Parmegiana', 'Arroz e Fritas', 44.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_032', 'cat_carnes_ind', 'Filé Mignon à Milanesa', 'Arroz, Feijão e Fritas', 42.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 2, NOW(), NOW());

-- ============================================================================
-- CARNES DUPLO
-- ============================================================================

INSERT INTO `menu_items` (`id`, `categoryId`, `name`, `description`, `price`, `active`, `featured`, `popular`, `spicy`, `vegetarian`, `newItem`, `order`, `createdAt`, `updatedAt`) VALUES
('item_040', 'cat_carnes_dup', 'Contra Filé Grelhado (2 pessoas)', 'Arroz, Feijão e Fritas', 67.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 0, NOW(), NOW()),
('item_041', 'cat_carnes_dup', 'Filé Mignon à Parmegiana (2 pessoas)', 'Arroz e Fritas', 89.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_042', 'cat_carnes_dup', 'Filé Mignon à Milanesa (2 pessoas)', 'Arroz, Feijão e Fritas', 85.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 2, NOW(), NOW());

-- ============================================================================
-- FRANGO INDIVIDUAL
-- ============================================================================

INSERT INTO `menu_items` (`id`, `categoryId`, `name`, `description`, `price`, `active`, `featured`, `popular`, `spicy`, `vegetarian`, `newItem`, `order`, `createdAt`, `updatedAt`) VALUES
('item_050', 'cat_frango_ind', 'Filé de Frango Grelhado', 'Arroz, Feijão e Fritas', 23.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 0, NOW(), NOW()),
('item_051', 'cat_frango_ind', 'Filé de Frango à Milanesa', 'Arroz, Feijão e Fritas', 28.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_052', 'cat_frango_ind', 'Filé de Frango c/ Legumes', 'Arroz, Feijão e Fritas', 31.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 2, NOW(), NOW()),
('item_053', 'cat_frango_ind', 'Filé de Frango à Parmegiana', 'Arroz e Fritas', 36.99, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 3, NOW(), NOW());

-- ============================================================================
-- FRANGO DUPLO
-- ============================================================================

INSERT INTO `menu_items` (`id`, `categoryId`, `name`, `description`, `price`, `active`, `featured`, `popular`, `spicy`, `vegetarian`, `newItem`, `order`, `createdAt`, `updatedAt`) VALUES
('item_060', 'cat_frango_dup', 'Filé de Frango Grelhado (2 pessoas)', 'Arroz, Feijão e Fritas', 45.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 0, NOW(), NOW()),
('item_061', 'cat_frango_dup', 'Filé de Frango à Milanesa (2 pessoas)', 'Arroz, Feijão e Fritas', 55.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_062', 'cat_frango_dup', 'Filé de Frango c/ Legumes (2 pessoas)', 'Arroz, Feijão e Fritas', 59.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 2, NOW(), NOW()),
('item_063', 'cat_frango_dup', 'Filé de Frango à Parmegiana (2 pessoas)', 'Arroz e Fritas', 69.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 3, NOW(), NOW());

-- ============================================================================
-- MASSAS
-- ============================================================================

INSERT INTO `menu_items` (`id`, `categoryId`, `name`, `description`, `price`, `active`, `featured`, `popular`, `spicy`, `vegetarian`, `newItem`, `order`, `createdAt`, `updatedAt`) VALUES
('item_070', 'cat_massas', 'Spaghetti c/ Frutos do Mar', 'Spaghetti com mix de frutos do mar', 54.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 0, NOW(), NOW()),
('item_071', 'cat_massas', 'Spaghetti à Bolonhesa', 'Spaghetti ao molho bolonhesa', 39.99, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_072', 'cat_massas', 'Spaghetti ao Sugo', 'Spaghetti com molho de tomate', 34.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 2, NOW(), NOW()),
('item_073', 'cat_massas', 'Spaghetti ao Molho Branco', 'Spaghetti com molho branco cremoso', 39.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 3, NOW(), NOW()),
('item_074', 'cat_massas', 'Adicional: Escalope de Mignon', 'Filé Mignon para adicionar às massas', 29.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 4, NOW(), NOW()),
('item_075', 'cat_massas', 'Adicional: Filé de Frango Grelhado', 'Frango grelhado para adicionar às massas', 15.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 5, NOW(), NOW());

-- ============================================================================
-- PORÇÕES
-- ============================================================================

INSERT INTO `menu_items` (`id`, `categoryId`, `name`, `description`, `price`, `active`, `featured`, `popular`, `spicy`, `vegetarian`, `newItem`, `order`, `createdAt`, `updatedAt`) VALUES
('item_080', 'cat_porcoes', 'Fritas', 'Porção de batatas fritas crocantes', 29.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 0, NOW(), NOW()),
('item_081', 'cat_porcoes', 'Frango Crocante', 'Porção de frango empanado crocante', 69.99, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_082', 'cat_porcoes', 'Isca de Peixe', 'Iscas de peixe empanadas', 79.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 2, NOW(), NOW()),
('item_083', 'cat_porcoes', 'Lula à Dorê', 'Lula empanada à dorê', 99.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 3, NOW(), NOW()),
('item_084', 'cat_porcoes', 'Camarão à Dorê', 'Camarões empanados à dorê', 89.99, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 4, NOW(), NOW()),
('item_085', 'cat_porcoes', 'Camarão à Paulistinha', 'Camarão ao alho e óleo', 89.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 5, NOW(), NOW()),
('item_086', 'cat_porcoes', 'Marisco à Vinagrete', 'Marisco com vinagrete especial', 94.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 6, NOW(), NOW());

-- ============================================================================
-- RISOTOS
-- ============================================================================

INSERT INTO `menu_items` (`id`, `categoryId`, `name`, `description`, `price`, `active`, `featured`, `popular`, `spicy`, `vegetarian`, `newItem`, `order`, `createdAt`, `updatedAt`) VALUES
('item_090', 'cat_risotos', 'Risoto de Filé Mignon', 'Risoto cremoso com filé mignon', 74.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 0, NOW(), NOW()),
('item_091', 'cat_risotos', 'Risoto de Frutos do Mar', 'Risoto com mix de frutos do mar', 99.99, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_092', 'cat_risotos', 'Risoto 3 Queijos', 'Risoto cremoso com três tipos de queijo', 69.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 2, NOW(), NOW());

-- ============================================================================
-- BEBIDAS ALCOÓLICAS
-- ============================================================================

INSERT INTO `menu_items` (`id`, `categoryId`, `name`, `description`, `price`, `active`, `featured`, `popular`, `spicy`, `vegetarian`, `newItem`, `order`, `createdAt`, `updatedAt`) VALUES
('item_100', 'cat_bebidas_alc', 'Heineken Long Neck', 'Cerveja Heineken 355ml', 12.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 0, NOW(), NOW()),
('item_101', 'cat_bebidas_alc', 'Cerveja Sem Álcool Long Neck', 'Cerveja sem álcool 355ml', 12.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_102', 'cat_bebidas_alc', 'Budweiser Long Neck', 'Cerveja Budweiser 355ml', 11.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 2, NOW(), NOW()),
('item_103', 'cat_bebidas_alc', 'Império Lager Long Neck', 'Cerveja Império Lager 355ml', 10.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 3, NOW(), NOW()),
('item_104', 'cat_bebidas_alc', 'Malzbier Long Neck', 'Cerveja Malzbier 355ml', 11.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 4, NOW(), NOW()),
('item_105', 'cat_bebidas_alc', 'Império Pilsen Long Neck', 'Cerveja Império Pilsen 355ml', 9.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 5, NOW(), NOW()),
('item_106', 'cat_bebidas_alc', 'Caipiroska', 'Drink de vodka com limão', 27.00, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 6, NOW(), NOW()),
('item_107', 'cat_bebidas_alc', 'Batida de Vodka', 'Batida cremosa de vodka', 30.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 7, NOW(), NOW()),
('item_108', 'cat_bebidas_alc', 'Caipirinha', 'Drink tradicional de cachaça com limão', 22.00, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 8, NOW(), NOW()),
('item_109', 'cat_bebidas_alc', 'Espanhola', 'Drink de vinho com frutas', 26.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 9, NOW(), NOW()),
('item_110', 'cat_bebidas_alc', 'Batida de Pinga', 'Batida cremosa de cachaça', 24.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 10, NOW(), NOW()),
('item_111', 'cat_bebidas_alc', 'Taça de Vinho', 'Taça de vinho tinto ou branco', 15.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 11, NOW(), NOW()),
('item_112', 'cat_bebidas_alc', 'Garrafa de Vinho', 'Garrafa de vinho da casa', 35.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 12, NOW(), NOW());

-- ============================================================================
-- BEBIDAS NÃO ALCOÓLICAS
-- ============================================================================

INSERT INTO `menu_items` (`id`, `categoryId`, `name`, `description`, `price`, `active`, `featured`, `popular`, `spicy`, `vegetarian`, `newItem`, `order`, `createdAt`, `updatedAt`) VALUES
('item_120', 'cat_bebidas_nao', 'Sucos com Água', 'Suco natural com água', 18.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 0, NOW(), NOW()),
('item_121', 'cat_bebidas_nao', 'Schweppes Lata', 'Schweppes citrus 350ml', 8.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 1, NOW(), NOW()),
('item_122', 'cat_bebidas_nao', 'Sucos com Laranja ou Leite', 'Suco natural com laranja ou leite', 20.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 2, NOW(), NOW()),
('item_123', 'cat_bebidas_nao', 'Tônica Lata', 'Água tônica 350ml', 8.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 3, NOW(), NOW()),
('item_124', 'cat_bebidas_nao', 'Suco de Laranja', 'Suco de laranja natural', 18.00, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, 4, NOW(), NOW()),
('item_125', 'cat_bebidas_nao', 'Água 500ml', 'Água mineral sem gás', 5.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 5, NOW(), NOW()),
('item_126', 'cat_bebidas_nao', 'Refrigerante Lata', 'Coca-Cola, Guaraná ou Fanta 350ml', 7.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 6, NOW(), NOW()),
('item_127', 'cat_bebidas_nao', 'Água com Gás 500ml', 'Água mineral com gás', 6.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 7, NOW(), NOW()),
('item_128', 'cat_bebidas_nao', 'Refrigerante 2L', 'Refrigerante garrafa 2 litros', 18.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 8, NOW(), NOW()),
('item_129', 'cat_bebidas_nao', 'Energético', 'Energético Red Bull ou Monster', 20.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 9, NOW(), NOW()),
('item_130', 'cat_bebidas_nao', 'H2OH', 'Refrigerante H2OH 500ml', 9.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 10, NOW(), NOW());

-- Verificar quantidade inserida
SELECT 'Categorias inseridas:' as Info, COUNT(*) as Total FROM menu_categories;
SELECT 'Itens inseridos:' as Info, COUNT(*) as Total FROM menu_items;


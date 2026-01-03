-- ============================================================================
-- SEED COMPLETO DO CARDÁPIO (MySQL)
-- Execute: mysql -u pirata -p piratapizzaria < scripts/seed-menu-complete.sql
-- ============================================================================

-- Limpar dados existentes
DELETE FROM menu_items;
DELETE FROM menu_categories;

-- ============================================================================
-- CATEGORIAS (com shift: lunch, dinner, both)
-- ============================================================================

INSERT INTO menu_categories (id, name, displayName, description, icon, shift, `order`, active, createdAt, updatedAt) VALUES
-- Almoço (Restaurante)
('cat_entradas', 'entradas', 'Entradas', 'Saladas e porções de entrada', 'Salad', 'lunch', 1, TRUE, NOW(), NOW()),
('cat_peixes', 'peixes', 'Pratos de Peixe', 'Filés de peixe e salmão frescos', 'Fish', 'lunch', 2, TRUE, NOW(), NOW()),
('cat_carnes', 'carnes', 'Pratos de Carne', 'Contra filé e filé mignon', 'Beef', 'lunch', 3, TRUE, NOW(), NOW()),
('cat_frango', 'frango', 'Pratos de Frango', 'Filés de frango grelhado e à parmegiana', 'Drumstick', 'lunch', 4, TRUE, NOW(), NOW()),
('cat_massas', 'massas', 'Massas', 'Spaghetti e massas especiais', 'Utensils', 'lunch', 5, TRUE, NOW(), NOW()),
('cat_risotos', 'risotos', 'Risotos', 'Risotos especiais', 'Soup', 'lunch', 6, TRUE, NOW(), NOW()),
-- Jantar (Pizzaria)
('cat_pizzas_salgadas', 'pizzas_salgadas', 'Pizzas Salgadas', 'Nossas deliciosas pizzas tradicionais', 'Pizza', 'dinner', 10, TRUE, NOW(), NOW()),
('cat_pizzas_doces', 'pizzas_doces', 'Pizzas Doces', 'Pizzas doces para finalizar', 'Cake', 'dinner', 11, TRUE, NOW(), NOW()),
-- Ambos os turnos
('cat_porcoes', 'porcoes', 'Porções', 'Porções para compartilhar', 'UtensilsCrossed', 'both', 20, TRUE, NOW(), NOW()),
('cat_bebidas', 'bebidas', 'Bebidas', 'Refrigerantes, sucos e águas', 'GlassWater', 'both', 21, TRUE, NOW(), NOW()),
('cat_bebidas_alc', 'bebidas_alcoolicas', 'Bebidas Alcoólicas', 'Cervejas, vinhos e drinks', 'Wine', 'both', 22, TRUE, NOW(), NOW());

-- ============================================================================
-- ENTRADAS
-- ============================================================================

INSERT INTO menu_items (id, categoryId, name, description, price, active, featured, popular, spicy, vegetarian, newItem, `order`, createdAt, updatedAt) VALUES
('item_001', 'cat_entradas', 'Casquinha de Siri', 'Casquinha de siri tradicional', 29.99, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_002', 'cat_entradas', 'Salada Simples', 'Alface, Tomate, Cebola', 14.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 2, NOW(), NOW()),
('item_003', 'cat_entradas', 'Salada Mista', 'Alface, Tomate, Cebola, Cenoura, Beterraba, Milho e Palmito', 24.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 3, NOW(), NOW()),
('item_004', 'cat_entradas', 'Salada de Lula', 'Alface, Lula Grelhada e Vinagrete da casa', 34.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 4, NOW(), NOW()),
('item_005', 'cat_entradas', 'Salada de Marisco', 'Alface, Marisco e Vinagrete', 34.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 5, NOW(), NOW());

-- ============================================================================
-- PEIXES
-- ============================================================================

INSERT INTO menu_items (id, categoryId, name, description, price, active, featured, popular, spicy, vegetarian, newItem, `order`, createdAt, updatedAt) VALUES
('item_010', 'cat_peixes', 'Filé de Peixe Grelhado', 'Arroz, Feijão e Fritas', 31.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_011', 'cat_peixes', 'Filé de Peixe à Dorê', 'Arroz, Feijão e Fritas', 32.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 2, NOW(), NOW()),
('item_012', 'cat_peixes', 'Filé de Peixe à Milanesa', 'Arroz, Feijão e Fritas', 33.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 3, NOW(), NOW()),
('item_013', 'cat_peixes', 'Filé de Peixe à Belle Meuniere', 'Arroz e Batata Sautê', 54.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 4, NOW(), NOW()),
('item_014', 'cat_peixes', 'Filé de Peixe ao Molho de Camarão', 'Arroz e Fritas', 59.99, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, 5, NOW(), NOW()),
('item_015', 'cat_peixes', 'Salmão Grelhado c/ Spaghetti de Legumes', 'Arroz e Spaghetti de Legumes', 54.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 6, NOW(), NOW()),
('item_016', 'cat_peixes', 'Salmão Grelhado c/ Legumes', 'Arroz e Legumes', 54.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 7, NOW(), NOW()),
('item_017', 'cat_peixes', 'Filé de Peixe Grelhado (2 pessoas)', 'Arroz, Feijão e Fritas', 59.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 8, NOW(), NOW()),
('item_018', 'cat_peixes', 'Filé de Peixe à Dorê (2 pessoas)', 'Arroz, Feijão e Fritas', 61.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 9, NOW(), NOW()),
('item_019', 'cat_peixes', 'Filé de Peixe à Milanesa (2 pessoas)', 'Arroz, Feijão e Fritas', 63.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 10, NOW(), NOW()),
('item_020', 'cat_peixes', 'Filé de Peixe ao Molho de Camarão (2 pessoas)', 'Arroz e Fritas', 109.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 11, NOW(), NOW());

-- ============================================================================
-- CARNES
-- ============================================================================

INSERT INTO menu_items (id, categoryId, name, description, price, active, featured, popular, spicy, vegetarian, newItem, `order`, createdAt, updatedAt) VALUES
('item_030', 'cat_carnes', 'Contra Filé Grelhado', 'Arroz, Feijão e Fritas', 34.99, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_031', 'cat_carnes', 'Filé Mignon à Parmegiana', 'Arroz e Fritas', 44.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 2, NOW(), NOW()),
('item_032', 'cat_carnes', 'Filé Mignon à Milanesa', 'Arroz, Feijão e Fritas', 42.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 3, NOW(), NOW()),
('item_033', 'cat_carnes', 'Contra Filé Grelhado (2 pessoas)', 'Arroz, Feijão e Fritas', 67.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 4, NOW(), NOW()),
('item_034', 'cat_carnes', 'Filé Mignon à Parmegiana (2 pessoas)', 'Arroz e Fritas', 89.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 5, NOW(), NOW()),
('item_035', 'cat_carnes', 'Filé Mignon à Milanesa (2 pessoas)', 'Arroz, Feijão e Fritas', 85.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 6, NOW(), NOW());

-- ============================================================================
-- FRANGO
-- ============================================================================

INSERT INTO menu_items (id, categoryId, name, description, price, active, featured, popular, spicy, vegetarian, newItem, `order`, createdAt, updatedAt) VALUES
('item_050', 'cat_frango', 'Filé de Frango Grelhado', 'Arroz, Feijão e Fritas', 23.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_051', 'cat_frango', 'Filé de Frango à Milanesa', 'Arroz, Feijão e Fritas', 28.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 2, NOW(), NOW()),
('item_052', 'cat_frango', 'Filé de Frango c/ Legumes', 'Arroz, Feijão e Fritas', 31.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 3, NOW(), NOW()),
('item_053', 'cat_frango', 'Filé de Frango à Parmegiana', 'Arroz e Fritas', 36.99, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, 4, NOW(), NOW()),
('item_054', 'cat_frango', 'Filé de Frango Grelhado (2 pessoas)', 'Arroz, Feijão e Fritas', 45.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 5, NOW(), NOW()),
('item_055', 'cat_frango', 'Filé de Frango à Milanesa (2 pessoas)', 'Arroz, Feijão e Fritas', 55.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 6, NOW(), NOW()),
('item_056', 'cat_frango', 'Filé de Frango c/ Legumes (2 pessoas)', 'Arroz, Feijão e Fritas', 59.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 7, NOW(), NOW()),
('item_057', 'cat_frango', 'Filé de Frango à Parmegiana (2 pessoas)', 'Arroz e Fritas', 69.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 8, NOW(), NOW());

-- ============================================================================
-- MASSAS
-- ============================================================================

INSERT INTO menu_items (id, categoryId, name, description, price, active, featured, popular, spicy, vegetarian, newItem, `order`, createdAt, updatedAt) VALUES
('item_070', 'cat_massas', 'Spaghetti c/ Frutos do Mar', 'Spaghetti com mix de frutos do mar', 54.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_071', 'cat_massas', 'Spaghetti à Bolonhesa', 'Spaghetti ao molho bolonhesa', 39.99, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 2, NOW(), NOW()),
('item_072', 'cat_massas', 'Spaghetti ao Sugo', 'Spaghetti com molho de tomate', 34.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 3, NOW(), NOW()),
('item_073', 'cat_massas', 'Spaghetti ao Molho Branco', 'Spaghetti com molho branco cremoso', 39.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 4, NOW(), NOW()),
('item_074', 'cat_massas', 'Adicional: Escalope de Mignon', 'Filé Mignon para adicionar às massas', 29.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 5, NOW(), NOW()),
('item_075', 'cat_massas', 'Adicional: Filé de Frango Grelhado', 'Frango grelhado para adicionar às massas', 15.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 6, NOW(), NOW());

-- ============================================================================
-- RISOTOS
-- ============================================================================

INSERT INTO menu_items (id, categoryId, name, description, price, active, featured, popular, spicy, vegetarian, newItem, `order`, createdAt, updatedAt) VALUES
('item_090', 'cat_risotos', 'Risoto de Filé Mignon', 'Risoto cremoso com filé mignon', 74.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_091', 'cat_risotos', 'Risoto de Frutos do Mar', 'Risoto com mix de frutos do mar', 99.99, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, 2, NOW(), NOW()),
('item_092', 'cat_risotos', 'Risoto 3 Queijos', 'Risoto cremoso com três tipos de queijo', 69.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 3, NOW(), NOW());

-- ============================================================================
-- PORÇÕES
-- ============================================================================

INSERT INTO menu_items (id, categoryId, name, description, price, active, featured, popular, spicy, vegetarian, newItem, `order`, createdAt, updatedAt) VALUES
('item_080', 'cat_porcoes', 'Fritas', 'Porção de batatas fritas crocantes', 29.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 1, NOW(), NOW()),
('item_081', 'cat_porcoes', 'Frango Crocante', 'Porção de frango empanado crocante', 69.99, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 2, NOW(), NOW()),
('item_082', 'cat_porcoes', 'Isca de Peixe', 'Iscas de peixe empanadas', 79.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 3, NOW(), NOW()),
('item_083', 'cat_porcoes', 'Lula à Dorê', 'Lula empanada à dorê', 99.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 4, NOW(), NOW()),
('item_084', 'cat_porcoes', 'Camarão à Dorê', 'Camarões empanados à dorê', 89.99, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, 5, NOW(), NOW()),
('item_085', 'cat_porcoes', 'Camarão à Paulistinha', 'Camarão ao alho e óleo', 89.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 6, NOW(), NOW()),
('item_086', 'cat_porcoes', 'Marisco à Vinagrete', 'Marisco com vinagrete especial', 94.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 7, NOW(), NOW());

-- ============================================================================
-- PIZZAS SALGADAS
-- ============================================================================

INSERT INTO menu_items (id, categoryId, name, description, price, active, featured, popular, spicy, vegetarian, newItem, `order`, createdAt, updatedAt) VALUES
('item_200', 'cat_pizzas_salgadas', 'Calabresa', 'Calabresa fatiada, cebola e mussarela', 49.99, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_201', 'cat_pizzas_salgadas', 'Marguerita', 'Mussarela, tomate, manjericão fresco e parmesão', 54.99, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, 2, NOW(), NOW()),
('item_202', 'cat_pizzas_salgadas', 'Portuguesa', 'Presunto, ovos, cebola, palmito, ervilha e mussarela', 59.99, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 3, NOW(), NOW()),
('item_203', 'cat_pizzas_salgadas', '4 Queijos', 'Mussarela, provolone, parmesão e catupiry', 59.99, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, 4, NOW(), NOW()),
('item_204', 'cat_pizzas_salgadas', 'Mussarela', 'Mussarela de qualidade e orégano', 44.99, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, 5, NOW(), NOW()),
('item_205', 'cat_pizzas_salgadas', 'Frango com Catupiry', 'Frango desfiado e catupiry original', 54.99, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 6, NOW(), NOW()),
('item_206', 'cat_pizzas_salgadas', 'Pepperoni', 'Pepperoni e mussarela', 59.99, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, 7, NOW(), NOW()),
('item_207', 'cat_pizzas_salgadas', 'Bacon', 'Bacon crocante, mussarela e cebola', 54.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 8, NOW(), NOW()),
('item_208', 'cat_pizzas_salgadas', 'Napolitana', 'Mussarela, tomate, parmesão e manjericão', 49.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 9, NOW(), NOW()),
('item_209', 'cat_pizzas_salgadas', 'Atum', 'Atum, cebola e mussarela', 54.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 10, NOW(), NOW()),
('item_210', 'cat_pizzas_salgadas', 'Camarão', 'Camarão, mussarela e catupiry', 69.99, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 11, NOW(), NOW()),
('item_211', 'cat_pizzas_salgadas', 'Palmito', 'Palmito, mussarela e catupiry', 54.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 12, NOW(), NOW()),
('item_212', 'cat_pizzas_salgadas', 'Milho', 'Milho verde, mussarela e catupiry', 49.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 13, NOW(), NOW()),
('item_213', 'cat_pizzas_salgadas', 'Lombo Canadense', 'Lombo canadense, mussarela e catupiry', 59.99, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 14, NOW(), NOW()),
('item_214', 'cat_pizzas_salgadas', 'Pirata Especial', 'Calabresa, bacon, cebola, pimentão e mussarela', 64.99, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, 15, NOW(), NOW());

-- ============================================================================
-- PIZZAS DOCES
-- ============================================================================

INSERT INTO menu_items (id, categoryId, name, description, price, active, featured, popular, spicy, vegetarian, newItem, `order`, createdAt, updatedAt) VALUES
('item_250', 'cat_pizzas_doces', 'Chocolate', 'Chocolate ao leite derretido', 44.99, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, 1, NOW(), NOW()),
('item_251', 'cat_pizzas_doces', 'Chocolate com Morango', 'Chocolate ao leite e morangos frescos', 54.99, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, 2, NOW(), NOW()),
('item_252', 'cat_pizzas_doces', 'Banana com Canela', 'Banana, canela, açúcar e leite condensado', 44.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 3, NOW(), NOW()),
('item_253', 'cat_pizzas_doces', 'Romeu e Julieta', 'Goiabada cremosa e queijo minas', 49.99, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, 4, NOW(), NOW()),
('item_254', 'cat_pizzas_doces', 'Prestígio', 'Chocolate e coco ralado', 49.99, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 5, NOW(), NOW()),
('item_255', 'cat_pizzas_doces', 'Brigadeiro', 'Brigadeiro e granulado', 49.99, TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, 6, NOW(), NOW());

-- ============================================================================
-- BEBIDAS
-- ============================================================================

INSERT INTO menu_items (id, categoryId, name, description, price, active, featured, popular, spicy, vegetarian, newItem, `order`, createdAt, updatedAt) VALUES
('item_120', 'cat_bebidas', 'Água 500ml', 'Água mineral sem gás', 5.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 1, NOW(), NOW()),
('item_121', 'cat_bebidas', 'Água com Gás 500ml', 'Água mineral com gás', 6.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 2, NOW(), NOW()),
('item_122', 'cat_bebidas', 'Refrigerante Lata', 'Coca-Cola, Guaraná ou Fanta 350ml', 7.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 3, NOW(), NOW()),
('item_123', 'cat_bebidas', 'Refrigerante 2L', 'Refrigerante garrafa 2 litros', 18.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 4, NOW(), NOW()),
('item_124', 'cat_bebidas', 'Suco de Laranja', 'Suco de laranja natural', 18.00, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, 5, NOW(), NOW()),
('item_125', 'cat_bebidas', 'Sucos com Água', 'Suco natural com água', 18.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 6, NOW(), NOW()),
('item_126', 'cat_bebidas', 'Sucos com Laranja ou Leite', 'Suco natural com laranja ou leite', 20.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 7, NOW(), NOW()),
('item_127', 'cat_bebidas', 'H2OH 500ml', 'Refrigerante H2OH', 9.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 8, NOW(), NOW()),
('item_128', 'cat_bebidas', 'Schweppes Lata', 'Schweppes citrus 350ml', 8.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 9, NOW(), NOW()),
('item_129', 'cat_bebidas', 'Tônica Lata', 'Água tônica 350ml', 8.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 10, NOW(), NOW()),
('item_130', 'cat_bebidas', 'Energético', 'Red Bull ou Monster', 20.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 11, NOW(), NOW());

-- ============================================================================
-- BEBIDAS ALCOÓLICAS
-- ============================================================================

INSERT INTO menu_items (id, categoryId, name, description, price, active, featured, popular, spicy, vegetarian, newItem, `order`, createdAt, updatedAt) VALUES
('item_100', 'cat_bebidas_alc', 'Heineken Long Neck', 'Cerveja Heineken 355ml', 12.00, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 1, NOW(), NOW()),
('item_101', 'cat_bebidas_alc', 'Budweiser Long Neck', 'Cerveja Budweiser 355ml', 11.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 2, NOW(), NOW()),
('item_102', 'cat_bebidas_alc', 'Império Lager Long Neck', 'Cerveja Império Lager 355ml', 10.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 3, NOW(), NOW()),
('item_103', 'cat_bebidas_alc', 'Império Pilsen Long Neck', 'Cerveja Império Pilsen 355ml', 9.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 4, NOW(), NOW()),
('item_104', 'cat_bebidas_alc', 'Malzbier Long Neck', 'Cerveja Malzbier 355ml', 11.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 5, NOW(), NOW()),
('item_105', 'cat_bebidas_alc', 'Cerveja Sem Álcool Long Neck', 'Cerveja sem álcool 355ml', 12.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 6, NOW(), NOW()),
('item_106', 'cat_bebidas_alc', 'Caipirinha', 'Cachaça, limão e açúcar', 22.00, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 7, NOW(), NOW()),
('item_107', 'cat_bebidas_alc', 'Caipiroska', 'Vodka, limão e açúcar', 27.00, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, 8, NOW(), NOW()),
('item_108', 'cat_bebidas_alc', 'Batida de Vodka', 'Batida cremosa de vodka', 30.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 9, NOW(), NOW()),
('item_109', 'cat_bebidas_alc', 'Batida de Pinga', 'Batida cremosa de cachaça', 24.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 10, NOW(), NOW()),
('item_110', 'cat_bebidas_alc', 'Espanhola', 'Vinho com frutas', 26.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 11, NOW(), NOW()),
('item_111', 'cat_bebidas_alc', 'Taça de Vinho', 'Vinho tinto ou branco', 15.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 12, NOW(), NOW()),
('item_112', 'cat_bebidas_alc', 'Garrafa de Vinho', 'Vinho da casa', 35.00, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 13, NOW(), NOW());

-- ============================================================================
-- VERIFICAR RESULTADO
-- ============================================================================

SELECT 'Categorias inseridas:' as Info, COUNT(*) as Total FROM menu_categories;
SELECT 'Itens inseridos:' as Info, COUNT(*) as Total FROM menu_items;


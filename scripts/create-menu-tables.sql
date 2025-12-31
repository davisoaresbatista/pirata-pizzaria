-- ============================================================================
-- CRIAR TABELAS DO CARDÁPIO (MySQL - Hostinger)
-- Execute este script no banco de produção
-- ============================================================================

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS `menu_categories` (
  `id` VARCHAR(25) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `displayName` VARCHAR(100) NOT NULL,
  `description` VARCHAR(500) NULL,
  `icon` VARCHAR(50) NULL,
  `order` INT NOT NULL DEFAULT 0,
  `active` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `menu_categories_name_key`(`name`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabela de Itens
CREATE TABLE IF NOT EXISTS `menu_items` (
  `id` VARCHAR(25) NOT NULL,
  `categoryId` VARCHAR(25) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(500) NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT TRUE,
  `featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `popular` BOOLEAN NOT NULL DEFAULT FALSE,
  `spicy` BOOLEAN NOT NULL DEFAULT FALSE,
  `vegetarian` BOOLEAN NOT NULL DEFAULT FALSE,
  `newItem` BOOLEAN NOT NULL DEFAULT FALSE,
  `imageUrl` VARCHAR(500) NULL,
  `order` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `menu_items_categoryId_idx`(`categoryId`),
  PRIMARY KEY (`id`),
  CONSTRAINT `menu_items_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `menu_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


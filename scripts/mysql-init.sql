-- ============================================
-- Script de criação de tabelas - Pirata Pizzaria
-- Execute no phpMyAdmin do Hostinger
-- ============================================

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(30) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Funcionários
CREATE TABLE IF NOT EXISTS `employees` (
  `id` VARCHAR(30) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) NOT NULL,
  `salary` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `phone` VARCHAR(50),
  `document` VARCHAR(50),
  `hireDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `active` BOOLEAN NOT NULL DEFAULT true,
  
  `worksLunch` BOOLEAN NOT NULL DEFAULT false,
  `lunchPaymentType` VARCHAR(50) NOT NULL DEFAULT 'SHIFT',
  `lunchValue` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `lunchStartTime` VARCHAR(10),
  `lunchEndTime` VARCHAR(10),
  
  `worksDinner` BOOLEAN NOT NULL DEFAULT false,
  `dinnerPaymentType` VARCHAR(50) NOT NULL DEFAULT 'SHIFT',
  `dinnerWeekdayValue` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `dinnerWeekendValue` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `dinnerStartTime` VARCHAR(10),
  `dinnerEndTime` VARCHAR(10),
  
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Registros de Ponto
CREATE TABLE IF NOT EXISTS `time_entries` (
  `id` VARCHAR(30) NOT NULL PRIMARY KEY,
  `employeeId` VARCHAR(30) NOT NULL,
  `date` DATETIME(3) NOT NULL,
  
  `workedLunch` BOOLEAN NOT NULL DEFAULT false,
  `workedDinner` BOOLEAN NOT NULL DEFAULT false,
  
  `clockInLunch` VARCHAR(10),
  `clockOutLunch` VARCHAR(10),
  `clockInDinner` VARCHAR(10),
  `clockOutDinner` VARCHAR(10),
  
  `status` VARCHAR(50) NOT NULL DEFAULT 'PRESENT',
  `notes` TEXT,
  
  `lunchValue` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `dinnerValue` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `totalValue` DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  `createdById` VARCHAR(30),
  `updatedById` VARCHAR(30),
  
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  UNIQUE KEY `time_entries_employeeId_date_key` (`employeeId`, `date`),
  CONSTRAINT `time_entries_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Configuração de Turnos
CREATE TABLE IF NOT EXISTS `shift_configs` (
  `id` VARCHAR(30) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` VARCHAR(255) NOT NULL,
  `value` DECIMAL(10,2) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Períodos de Folha
CREATE TABLE IF NOT EXISTS `payroll_periods` (
  `id` VARCHAR(30) NOT NULL PRIMARY KEY,
  `startDate` DATETIME(3) NOT NULL,
  `endDate` DATETIME(3) NOT NULL,
  `periodType` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'OPEN',
  `totalAmount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Pagamentos da Folha
CREATE TABLE IF NOT EXISTS `payroll_payments` (
  `id` VARCHAR(30) NOT NULL PRIMARY KEY,
  `periodId` VARCHAR(30) NOT NULL,
  `employeeId` VARCHAR(30) NOT NULL,
  `employeeName` VARCHAR(255) NOT NULL,
  
  `daysWorked` INT NOT NULL DEFAULT 0,
  `lunchShifts` INT NOT NULL DEFAULT 0,
  `dinnerShifts` INT NOT NULL DEFAULT 0,
  
  `fixedSalary` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `lunchTotal` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `dinnerTotal` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `grossAmount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `advances` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `deductions` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `netAmount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  `paid` BOOLEAN NOT NULL DEFAULT false,
  `paidAt` DATETIME(3),
  `notes` TEXT,
  
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  CONSTRAINT `payroll_payments_periodId_fkey` FOREIGN KEY (`periodId`) REFERENCES `payroll_periods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Adiantamentos
CREATE TABLE IF NOT EXISTS `advances` (
  `id` VARCHAR(30) NOT NULL PRIMARY KEY,
  `employeeId` VARCHAR(30) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `requestDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `paymentDate` DATETIME(3),
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `notes` TEXT,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  CONSTRAINT `advances_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Folha de Pagamento (Entradas)
CREATE TABLE IF NOT EXISTS `payroll_entries` (
  `id` VARCHAR(30) NOT NULL PRIMARY KEY,
  `employeeId` VARCHAR(30) NOT NULL,
  `month` VARCHAR(20) NOT NULL,
  `baseSalary` DECIMAL(10,2) NOT NULL,
  `advances` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `bonuses` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `deductions` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `netSalary` DECIMAL(10,2) NOT NULL,
  `paymentDate` DATETIME(3),
  `paid` BOOLEAN NOT NULL DEFAULT false,
  `notes` TEXT,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  UNIQUE KEY `payroll_entries_employeeId_month_key` (`employeeId`, `month`),
  CONSTRAINT `payroll_entries_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Despesas
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` VARCHAR(30) NOT NULL PRIMARY KEY,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `date` DATETIME(3) NOT NULL,
  `notes` TEXT,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Receitas
CREATE TABLE IF NOT EXISTS `revenues` (
  `id` VARCHAR(30) NOT NULL PRIMARY KEY,
  `source` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `amount` DECIMAL(10,2) NOT NULL,
  `date` DATETIME(3) NOT NULL,
  `notes` TEXT,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Logs de Auditoria
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` VARCHAR(30) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(30) NOT NULL,
  `userEmail` VARCHAR(255) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `resource` VARCHAR(255) NOT NULL,
  `resourceId` VARCHAR(30),
  `details` TEXT,
  `ipAddress` VARCHAR(50) NOT NULL,
  `userAgent` TEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  
  INDEX `audit_logs_userId_idx` (`userId`),
  INDEX `audit_logs_action_idx` (`action`),
  INDEX `audit_logs_resource_idx` (`resource`),
  INDEX `audit_logs_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Tentativas de Login
CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` VARCHAR(30) NOT NULL PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL,
  `ipAddress` VARCHAR(50) NOT NULL,
  `success` BOOLEAN NOT NULL,
  `userAgent` TEXT,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  
  INDEX `login_attempts_email_idx` (`email`),
  INDEX `login_attempts_ipAddress_idx` (`ipAddress`),
  INDEX `login_attempts_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DADOS INICIAIS
-- ============================================

-- Usuário Admin (senha: admin123)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
('cm5bn4admin001', 'Administrador', 'admin@piratapizzaria.com.br', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Configurações de Turno
INSERT INTO `shift_configs` (`id`, `name`, `description`, `value`) VALUES
('cm5shift001', 'lunch', 'Valor do turno do almoço', 80.00),
('cm5shift002', 'dinner_weekday', 'Valor do jantar durante a semana', 100.00),
('cm5shift003', 'dinner_weekend', 'Valor do jantar no fim de semana', 120.00)
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);

-- ============================================
-- PRONTO! Tabelas criadas com sucesso!
-- ============================================


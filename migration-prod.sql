-- ============================================
-- MIGRAÇÃO PARA PRODUÇÃO - Pirata Pizzaria
-- Gerado em: 01/01/2026
-- Execute ANTES do data-export.sql
-- ============================================

-- 1. Adicionar coluna 'shift' na tabela menu_categories (se não existir)
-- Esta coluna organiza o cardápio por turno (almoço/jantar)
ALTER TABLE menu_categories 
ADD COLUMN IF NOT EXISTS shift VARCHAR(20) DEFAULT 'both';

-- Se o MySQL não suportar "IF NOT EXISTS" para colunas, use:
-- ALTER TABLE menu_categories ADD COLUMN shift VARCHAR(20) DEFAULT 'both';
-- (vai dar erro se já existir, mas pode ignorar)

-- 2. Verificar se todas as colunas de employees existem
-- Estas colunas são essenciais para os valores acordados:

-- Verificar colunas de almoço
-- ALTER TABLE employees ADD COLUMN IF NOT EXISTS worksLunch BOOLEAN DEFAULT false;
-- ALTER TABLE employees ADD COLUMN IF NOT EXISTS lunchPaymentType VARCHAR(20) DEFAULT 'SHIFT';
-- ALTER TABLE employees ADD COLUMN IF NOT EXISTS lunchValue DECIMAL(10,2) DEFAULT 0;
-- ALTER TABLE employees ADD COLUMN IF NOT EXISTS lunchStartTime VARCHAR(10);
-- ALTER TABLE employees ADD COLUMN IF NOT EXISTS lunchEndTime VARCHAR(10);

-- Verificar colunas de jantar
-- ALTER TABLE employees ADD COLUMN IF NOT EXISTS worksDinner BOOLEAN DEFAULT false;
-- ALTER TABLE employees ADD COLUMN IF NOT EXISTS dinnerPaymentType VARCHAR(20) DEFAULT 'SHIFT';
-- ALTER TABLE employees ADD COLUMN IF NOT EXISTS dinnerWeekdayValue DECIMAL(10,2) DEFAULT 0;
-- ALTER TABLE employees ADD COLUMN IF NOT EXISTS dinnerWeekendValue DECIMAL(10,2) DEFAULT 0;
-- ALTER TABLE employees ADD COLUMN IF NOT EXISTS dinnerStartTime VARCHAR(10);
-- ALTER TABLE employees ADD COLUMN IF NOT EXISTS dinnerEndTime VARCHAR(10);

-- ============================================
-- VERIFICAÇÃO: Execute esta query para ver a estrutura atual
-- ============================================
-- DESCRIBE employees;
-- DESCRIBE menu_categories;

-- ============================================
-- APÓS EXECUTAR ESTE SCRIPT, execute o data-export.sql
-- ============================================


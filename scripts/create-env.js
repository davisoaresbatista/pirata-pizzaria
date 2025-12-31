#!/usr/bin/env node

/**
 * 🏴‍☠️ Script para criar arquivo .env na Hostinger
 * 
 * Este script é executado durante o build para garantir que
 * as variáveis de ambiente estejam disponíveis.
 * 
 * As variáveis são lidas do ambiente (configuradas no painel)
 * ou usa valores padrão para produção na Hostinger.
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

// Se já existe um .env, não sobrescreve
if (fs.existsSync(envPath)) {
  console.log('✅ Arquivo .env já existe, mantendo configuração atual');
  process.exit(0);
}

// Variáveis de ambiente (do painel ou valores padrão)
const envVars = {
  DATABASE_URL: process.env.DATABASE_URL || 'mysql://u985490280_master:uLWpJ7Pirata2025@localhost:3306/u985490280_piratapizzaria',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'pxb4NirT5BMES8h0uB9NGxPVPsnFrQ+QwYZipc/6qFU=',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://piratapizzaria.com.br',
  NODE_ENV: process.env.NODE_ENV || 'production',
};

// Criar conteúdo do .env
const envContent = Object.entries(envVars)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

try {
  fs.writeFileSync(envPath, envContent + '\n');
  console.log('✅ Arquivo .env criado com sucesso!');
  console.log('   Variáveis configuradas:');
  Object.keys(envVars).forEach(key => {
    const value = key.includes('SECRET') || key.includes('PASSWORD') 
      ? '****' 
      : envVars[key].substring(0, 50) + (envVars[key].length > 50 ? '...' : '');
    console.log(`   - ${key}: ${value}`);
  });
} catch (error) {
  console.error('❌ Erro ao criar .env:', error.message);
  // Não falha o build, o server.js vai mostrar erro mais claro
}


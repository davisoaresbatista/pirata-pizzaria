#!/usr/bin/env node

/**
 * 🏴‍☠️ Servidor Customizado para Pirata Pizzaria
 * 
 * Este servidor carrega as variáveis de ambiente do arquivo .env
 * antes de iniciar o Next.js em modo standalone.
 * 
 * Necessário para deploy na Hostinger, onde as variáveis de ambiente
 * configuradas no painel nem sempre são passadas para a aplicação.
 */

const path = require('path');
const { existsSync } = require('fs');

// Carregar variáveis de ambiente do .env ANTES de qualquer outra coisa
const dotenvPath = path.join(__dirname, '.env');
if (existsSync(dotenvPath)) {
  require('dotenv').config({ path: dotenvPath });
  console.log('✅ Variáveis de ambiente carregadas do arquivo .env');
} else {
  console.log('⚠️  Arquivo .env não encontrado, usando variáveis do ambiente do sistema');
}

// Verificar variáveis críticas
const requiredVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error('❌ ERRO: Variáveis de ambiente obrigatórias não definidas:');
  missingVars.forEach(v => console.error(`   - ${v}`));
  console.error('');
  console.error('Por favor, crie um arquivo .env com as seguintes variáveis:');
  console.error('   DATABASE_URL=mysql://usuario:senha@localhost:3306/banco');
  console.error('   NEXTAUTH_SECRET=sua-chave-secreta');
  console.error('   NEXTAUTH_URL=https://seu-dominio.com');
  process.exit(1);
}

// Definir NODE_ENV se não estiver definido
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

console.log('🏴‍☠️ Iniciando Pirata Pizzaria...');
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`);
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')}`);

// Tentar carregar o servidor standalone do Next.js
const standalonePath = path.join(__dirname, '.next', 'standalone', 'server.js');

if (existsSync(standalonePath)) {
  // Modo Standalone - Hostinger com build via GitHub
  console.log('📦 Modo: Standalone');
  
  // Configurar hostname e porta
  process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';
  process.env.PORT = process.env.PORT || '3000';
  
  require(standalonePath);
} else {
  // Modo tradicional - fallback para next start
  console.log('📦 Modo: Tradicional (next start)');
  
  const { spawn } = require('child_process');
  const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');
  
  const child = spawn(nextBin, ['start'], {
    stdio: 'inherit',
    env: process.env
  });
  
  child.on('error', (err) => {
    console.error('Erro ao iniciar Next.js:', err);
    process.exit(1);
  });
  
  child.on('close', (code) => {
    process.exit(code || 0);
  });
}


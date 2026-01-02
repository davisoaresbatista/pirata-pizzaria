#!/usr/bin/env node

/**
 * 🏴‍☠️ Script para copiar arquivos estáticos para o standalone
 * 
 * Quando usamos output: "standalone" no Next.js, os arquivos estáticos
 * (CSS, JS, imagens) não são incluídos automaticamente na pasta do standalone.
 * Este script copia os arquivos necessários após o build.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const standaloneDir = path.join(rootDir, '.next', 'standalone');
const staticSrc = path.join(rootDir, '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');
const publicSrc = path.join(rootDir, 'public');
const publicDest = path.join(standaloneDir, 'public');

/**
 * Copia uma pasta recursivamente
 */
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⚠️  Pasta não encontrada: ${src}`);
    return;
  }

  // Criar pasta de destino se não existir
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('📦 Copiando arquivos estáticos para o standalone...');
console.log('');

// Verificar se o standalone existe
if (!fs.existsSync(standaloneDir)) {
  console.log('⚠️  Pasta standalone não encontrada.');
  console.log('   Isso pode significar que o build não foi executado ou');
  console.log('   que output: "standalone" não está configurado no next.config.ts');
  process.exit(0);
}

// Copiar .next/static
console.log('📁 Copiando .next/static...');
copyRecursive(staticSrc, staticDest);
console.log('   ✅ .next/static copiado');

// Copiar public
console.log('📁 Copiando public...');
copyRecursive(publicSrc, publicDest);
console.log('   ✅ public copiado');

console.log('');
console.log('🎉 Arquivos estáticos copiados com sucesso!');
console.log('');
console.log('📦 O standalone agora inclui:');
console.log('   - .next/standalone/server.js (servidor)');
console.log('   - .next/standalone/.next/static (CSS, JS)');
console.log('   - .next/standalone/public (imagens, favicon)');


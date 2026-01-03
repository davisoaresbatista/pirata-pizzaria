#!/bin/bash
# ============================================================================
# SCRIPT DE DEPLOY AUTOMÁTICO - Pirata Pizzaria
# Execute na VPS: bash scripts/deploy.sh
# ============================================================================

set -e  # Para em caso de erro

echo ""
echo "🏴‍☠️ =========================================="
echo "   DEPLOY - Pirata Pizzaria"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Diretório do projeto
PROJECT_DIR="/var/www/pirata"
cd $PROJECT_DIR

# 1. Parar aplicação
echo -e "${YELLOW}⏸️  Parando aplicação...${NC}"
pm2 stop pirata 2>/dev/null || true

# 2. Puxar alterações do Git
echo -e "${YELLOW}📥 Puxando alterações do GitHub...${NC}"
git fetch origin
git reset --hard origin/main

# 3. Instalar dependências
echo -e "${YELLOW}📦 Instalando dependências...${NC}"
npm install --legacy-peer-deps

# 4. Sincronizar banco de dados
echo -e "${YELLOW}🗄️  Sincronizando banco de dados...${NC}"
npx prisma generate
npx prisma db push --accept-data-loss --skip-generate

# 5. Build da aplicação
echo -e "${YELLOW}🔨 Fazendo build...${NC}"
npm run build

# 6. Reiniciar aplicação
echo -e "${YELLOW}🚀 Iniciando aplicação...${NC}"
pm2 start pirata 2>/dev/null || pm2 start server.js --name pirata
pm2 save

# 7. Verificar status
echo ""
echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""
pm2 status pirata

echo ""
echo "🔍 Para ver logs: pm2 logs pirata --lines 50"
echo "🌐 Acesse: https://piratapizzaria.com.br"
echo ""


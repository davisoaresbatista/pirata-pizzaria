#!/bin/bash

echo "🏴‍☠️ Preparando Pirata Pizzaria para deploy..."
echo ""

# Copiar schema MySQL para produção
cp prisma/schema.mysql.prisma prisma/schema.prisma

echo "✅ Schema MySQL configurado"

# Gerar Prisma Client
npx prisma generate

echo "✅ Prisma Client gerado"

# Build do projeto
npm run build

echo ""
echo "🚀 Projeto pronto para deploy!"
echo ""
echo "Próximos passos:"
echo "1. Faça upload dos arquivos para a Hostinger"
echo "2. Configure as variáveis de ambiente no hPanel"
echo "3. Execute: npx prisma db push"
echo "4. Execute: npx tsx prisma/seed.ts"
echo "5. Reinicie a aplicação Node.js"


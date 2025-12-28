# 🏴‍☠️ Guia de Deploy - Pirata Pizzaria

## Requisitos na Hostinger
- Plano Premium Web Hosting (com Node.js)
- Banco de dados MySQL

---

## 📋 Passo a Passo

### 1. Criar Banco de Dados MySQL

1. Acesse o **hPanel** da Hostinger
2. Vá em **Bancos de Dados** → **Bancos de dados MySQL**
3. Crie um novo banco:
   - **Nome do banco**: `u123456789_pirata` (o prefixo será adicionado automaticamente)
   - **Usuário**: `u123456789_admin`
   - **Senha**: crie uma senha forte

4. Anote todas as informações:
   - Host: `localhost` ou o que aparecer
   - Nome do banco
   - Usuário
   - Senha

---

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
# Banco de dados MySQL (Hostinger)
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/NOME_DO_BANCO"

# NextAuth
NEXTAUTH_SECRET="sua-chave-secreta-muito-forte-123"
NEXTAUTH_URL="https://piratapizzaria.com.br"
```

**Substitua:**
- `USUARIO` = seu usuário do MySQL
- `SENHA` = sua senha do MySQL  
- `NOME_DO_BANCO` = nome completo do banco (ex: u123456789_pirata)

---

### 3. Preparar o Projeto para Deploy

No seu computador, execute:

```bash
# Copiar schema MySQL
cp prisma/schema.mysql.prisma prisma/schema.prisma

# Gerar Prisma Client
npx prisma generate

# Build do projeto
npm run build
```

---

### 4. Upload para Hostinger

**Opção A: Via Git (Recomendado)**

1. Crie um repositório no GitHub
2. No hPanel, vá em **Avançado** → **GIT**
3. Clone o repositório
4. Configure o deploy automático

**Opção B: Via File Manager**

1. Compacte a pasta `pirata` em `.zip`
2. No hPanel, vá em **Arquivos** → **Gerenciador de Arquivos**
3. Faça upload na pasta `public_html` ou subpasta
4. Extraia o arquivo

---

### 5. Configurar Node.js na Hostinger

1. No hPanel, vá em **Avançado** → **Node.js**
2. Configure:
   - **Versão Node.js**: 18.x ou 20.x
   - **Diretório da aplicação**: `/public_html/pirata` (ou onde você subiu)
   - **Arquivo inicial**: `node_modules/.bin/next`
   - **Comando de inicialização**: `npm run start`

3. Clique em **Criar**

---

### 6. Criar as Tabelas no Banco

Via SSH ou Terminal da Hostinger:

```bash
cd ~/public_html/pirata

# Criar tabelas
npx prisma db push

# Criar usuário admin
npx tsx prisma/seed.ts
```

---

### 7. Apontar Domínio

1. No hPanel, vá em **Domínios**
2. Configure `piratapizzaria.com.br` para apontar para a pasta do projeto

---

## 🔐 Credenciais de Acesso Inicial

Após o deploy, acesse:

- **Site público**: https://piratapizzaria.com.br
- **Admin**: https://piratapizzaria.com.br/login

**Login inicial:**
- Email: `admin@piratapizzaria.com.br`
- Senha: `admin123`

⚠️ **IMPORTANTE**: Altere a senha após o primeiro login!

---

## 🆘 Problemas Comuns

### Erro de conexão com banco
- Verifique se a DATABASE_URL está correta
- Verifique se o usuário tem permissão no banco

### Erro 500
- Verifique os logs em `logs/` ou no hPanel
- Verifique se as variáveis de ambiente estão configuradas

### Página em branco
- Verifique se o build foi feito corretamente
- Verifique a configuração do Node.js

---

## 📞 Suporte

Precisa de ajuda? Entre em contato com o desenvolvedor.


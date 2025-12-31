# 🚀 Guia de Deploy na Hostinger

Este guia explica passo a passo como fazer o deploy do site da Pirata Pizzaria na Hostinger.

## ⚠️ IMPORTANTE: Variáveis de Ambiente

A Hostinger tem um comportamento específico com variáveis de ambiente em aplicações Node.js.
As variáveis configuradas no painel de "Implementações" **nem sempre são passadas** para a aplicação em runtime.

**Solução**: Este projeto usa um `server.js` customizado que carrega as variáveis do arquivo `.env`.
Você **DEVE** criar o arquivo `.env` manualmente via SSH após o deploy.

## Pré-requisitos

- Conta na Hostinger com plano Premium ou superior
- Acesso ao hPanel
- Domínio configurado (piratapizzaria.com.br)

## Passo 1: Configurar o Banco de Dados MySQL

1. Acesse o **hPanel** da Hostinger
2. Navegue até **Bancos de Dados** > **MySQL**
3. Clique em **Criar novo banco de dados**
4. Preencha:
   - Nome do banco: `pirata_db`
   - Usuário: `pirata_user`
   - Senha: Crie uma senha forte
5. Anote as informações:
   - Host: geralmente `localhost` ou o hostname fornecido
   - Porta: `3306`

## Passo 2: Fazer Upload do Código

### Opção A: Via Git (Recomendado)

1. No hPanel, vá em **Avançado** > **Git**
2. Conecte seu repositório GitHub
3. Configure:
   - Branch: `main`
   - Auto-deploy: Ativado

### Opção B: Via Gerenciador de Arquivos

1. Faça o build local: `npm run build`
2. Compacte a pasta `.next`, `public`, `prisma`, e os arquivos `package.json`, `next.config.ts`
3. Faça upload via Gerenciador de Arquivos do hPanel

## Passo 3: Configurar Node.js

1. No hPanel, vá em **Avançado** > **Node.js**
2. Crie uma nova aplicação Node.js:
   - Versão do Node: 18 ou superior
   - Diretório: `/public_html` ou o diretório do seu domínio
3. Configure os comandos:
   - **Install command**: `npm install`
   - **Build command**: `npm run build`
   - **Start command**: `npm start`

## Passo 4: Configurar Variáveis de Ambiente (CRÍTICO!)

### ⚠️ ATENÇÃO: As variáveis do painel NÃO funcionam!

A Hostinger não passa as variáveis de ambiente do painel "Implementações" para aplicações Node.js em runtime.
Você **DEVE** criar o arquivo `.env` manualmente via SSH.

### Passo 4.1: Conectar via SSH

1. No hPanel, vá em **Avançado** > **SSH Access**
2. Anote o comando de conexão e conecte-se ao servidor

### Passo 4.2: Criar o arquivo .env

```bash
# Navegue até a pasta do projeto
cd ~/domains/piratapizzaria.com.br/public_html

# Crie o arquivo .env
cat > .env << 'EOF'
DATABASE_URL=mysql://u985490280_master:uLWpJ7Pirata2025@localhost:3306/u985490280_piratapizzaria
NEXTAUTH_SECRET=sua-chave-secreta-aqui
NEXTAUTH_URL=https://piratapizzaria.com.br
NODE_ENV=production
EOF
```

### Passo 4.3: Gerar o NEXTAUTH_SECRET

Para gerar uma chave secreta segura, execute no seu terminal local:
```bash
openssl rand -base64 32
```

Copie o resultado e substitua `sua-chave-secreta-aqui` no arquivo `.env`.

### Passo 4.4: Verificar o arquivo

```bash
cat .env
```

Certifique-se de que todas as variáveis estão corretas.

### Também configure no painel (opcional, como backup)

No hPanel, na configuração do Node.js, adicione as mesmas variáveis:

```env
DATABASE_URL=mysql://u985490280_master:uLWpJ7Pirata2025@localhost:3306/u985490280_piratapizzaria
NEXTAUTH_SECRET=SUA_CHAVE_SECRETA
NEXTAUTH_URL=https://piratapizzaria.com.br
NODE_ENV=production
```

## Passo 5: Executar Migrações do Banco

1. Acesse o terminal SSH do hPanel:
   - hPanel > **Avançado** > **SSH Access**
2. Navegue até a pasta do projeto
3. Execute:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

## Passo 6: Deploy e Reiniciar a Aplicação

### Importante: O projeto usa um servidor customizado!

O comando de start (`npm start`) agora executa o `server.js`, que:
1. Carrega as variáveis do arquivo `.env`
2. Inicia o Next.js

### Para fazer o deploy:

1. Faça push das alterações para o GitHub
2. No hPanel > Implementações, clique em **Deploy** (ou aguarde o auto-deploy)
3. Após o deploy, **crie o arquivo `.env` via SSH** (Passo 4)
4. No painel Node.js, clique em **Reiniciar**
5. Aguarde a aplicação iniciar (pode levar 30-60 segundos)

## Passo 7: Verificar o Deploy

1. Acesse: https://piratapizzaria.com.br
2. Verifique o site público
3. Acesse: https://piratapizzaria.com.br/login
4. Faça login com:
   - Email: `admin@piratapizzaria.com.br`
   - Senha: `admin123`
5. **IMPORTANTE**: Altere a senha após o primeiro login

## Estrutura de Arquivos Esperada

```
public_html/
├── .env              ← CRIAR MANUALMENTE VIA SSH!
├── .next/
├── node_modules/
├── prisma/
├── public/
├── server.js         ← Servidor customizado que carrega o .env
├── src/
├── package.json
├── package-lock.json
├── next.config.ts
└── tsconfig.json
```

## Troubleshooting

### ❌ Erro: "Environment variable not found: DATABASE_URL"

Este é o erro mais comum! As variáveis de ambiente do painel não estão sendo lidas.

**Solução:**
1. Conecte via SSH
2. Crie o arquivo `.env` conforme o Passo 4
3. Reinicie a aplicação no painel Node.js

```bash
# Via SSH, verifique se o .env existe:
cat ~/domains/piratapizzaria.com.br/public_html/.env
```

### ❌ Erro: "[next-auth][error][NO_SECRET]"

O NextAuth não está encontrando o `NEXTAUTH_SECRET`.

**Solução:**
1. Verifique se o arquivo `.env` contém `NEXTAUTH_SECRET`
2. Gere uma nova chave: `openssl rand -base64 32`
3. Atualize o `.env` e reinicie a aplicação

### ❌ Erro de Conexão com Banco de Dados
- Verifique se as credenciais no `.env` estão corretas
- Confirme se o host está correto (geralmente `localhost`)
- Verifique se o usuário tem permissões no banco
- Teste a conexão via SSH: `mysql -u USUARIO -p BANCO`

### ❌ Erro 500 ou Página em Branco
- Verifique os logs: `cat ~/domains/piratapizzaria.com.br/public_html/stderr.log`
- Confirme se o build foi executado corretamente
- Verifique se o arquivo `.env` existe e está correto

### ❌ Erro de Autenticação
- Verifique se o NEXTAUTH_URL está correto (com https://)
- Confirme se o NEXTAUTH_SECRET está configurado no `.env`
- Limpe os cookies do navegador e tente novamente

### ❌ Imagens não Carregam
- Verifique se a pasta `public/logo` foi enviada corretamente
- Confirme se as permissões dos arquivos estão corretas (644)

### 🔍 Como verificar os logs

```bash
# Via SSH
cd ~/domains/piratapizzaria.com.br/public_html

# Ver erros
cat stderr.log

# Ver logs de acesso
cat stdout.log
```

## Manutenção

### Atualizando o Site

1. Faça as alterações no código
2. Faça push para o GitHub
3. Se auto-deploy está ativado, o site será atualizado automaticamente
4. Se não, faça o deploy manual no painel Node.js

### Backup do Banco de Dados

1. hPanel > Bancos de Dados > MySQL
2. Clique em phpMyAdmin
3. Selecione o banco
4. Clique em Exportar

## Suporte

Se encontrar problemas:
1. Verifique os logs no painel Node.js
2. Consulte a documentação da Hostinger
3. Entre em contato com o suporte da Hostinger

---

📧 Credenciais Iniciais:
- Email: admin@piratapizzaria.com.br
- Senha: admin123

⚠️ ALTERE A SENHA APÓS O PRIMEIRO LOGIN!


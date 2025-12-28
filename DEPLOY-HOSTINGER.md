# 🚀 Guia de Deploy na Hostinger

Este guia explica passo a passo como fazer o deploy do site da Pirata Pizzaria na Hostinger.

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

## Passo 4: Configurar Variáveis de Ambiente

No hPanel, na configuração do Node.js, adicione as variáveis:

```env
DATABASE_URL=mysql://pirata_user:SUA_SENHA@localhost:3306/pirata_db
NEXTAUTH_SECRET=SUA_CHAVE_SECRETA
NEXTAUTH_URL=https://piratapizzaria.com.br
NODE_ENV=production
```

Para gerar o NEXTAUTH_SECRET, execute no terminal:
```bash
openssl rand -base64 32
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

## Passo 6: Reiniciar a Aplicação

1. No painel Node.js, clique em **Reiniciar**
2. Aguarde a aplicação iniciar

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
├── .next/
├── node_modules/
├── prisma/
├── public/
├── src/
├── package.json
├── package-lock.json
├── next.config.ts
└── tsconfig.json
```

## Troubleshooting

### Erro de Conexão com Banco de Dados
- Verifique se as credenciais estão corretas
- Confirme se o host está correto (pode ser `localhost` ou um hostname específico)
- Verifique se o usuário tem permissões no banco

### Erro 500 ou Página em Branco
- Verifique os logs do Node.js no hPanel
- Confirme se o build foi executado corretamente
- Verifique se todas as variáveis de ambiente estão configuradas

### Erro de Autenticação
- Verifique se o NEXTAUTH_URL está correto (com https://)
- Confirme se o NEXTAUTH_SECRET está configurado
- Limpe os cookies do navegador e tente novamente

### Imagens não Carregam
- Verifique se a pasta `public/logo` foi enviada corretamente
- Confirme se as permissões dos arquivos estão corretas (644)

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


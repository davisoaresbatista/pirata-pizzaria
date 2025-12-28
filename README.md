# 🏴‍☠️ Pirata Pizzaria

Site institucional e sistema administrativo para a Pirata Pizzaria.

## 🚀 Tecnologias

- **Frontend**: Next.js 14 + React + TypeScript
- **Estilização**: Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Banco de Dados**: MySQL + Prisma ORM
- **Autenticação**: NextAuth.js

## 📁 Estrutura do Projeto

```
├── prisma/              # Schema e seeds do banco de dados
├── public/              # Arquivos estáticos (logo, imagens)
└── src/
    ├── app/
    │   ├── (public)/    # Páginas públicas (site institucional)
    │   ├── (auth)/      # Páginas de autenticação
    │   ├── (admin)/     # Painel administrativo
    │   └── api/         # Rotas da API
    ├── components/      # Componentes React
    └── lib/             # Utilitários e configurações
```

## 🛠️ Instalação Local

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd pirata
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Configure o banco de dados**
```bash
npm run db:push    # Cria as tabelas
npm run db:seed    # Popula com dados iniciais
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse o sistema**
- Site público: http://localhost:3000
- Login admin: http://localhost:3000/login
  - Email: admin@piratapizzaria.com.br
  - Senha: admin123

## 🌐 Deploy na Hostinger

### 1. Configurar o Banco de Dados MySQL

1. Acesse o painel hPanel da Hostinger
2. Vá em **Bancos de Dados** > **MySQL**
3. Crie um novo banco de dados
4. Anote: nome do banco, usuário, senha e host

### 2. Configurar Variáveis de Ambiente

No hPanel, configure as variáveis de ambiente:

```env
DATABASE_URL=mysql://usuario:senha@host:3306/banco
NEXTAUTH_SECRET=sua-chave-secreta (gere com: openssl rand -base64 32)
NEXTAUTH_URL=https://piratapizzaria.com.br
```

### 3. Deploy via Git

1. No hPanel, vá em **Git**
2. Conecte seu repositório GitHub/GitLab
3. Configure o branch e deploy automático

### 4. Configurar Build

No painel de deploy:
- **Build command**: `npm run build`
- **Start command**: `npm start`
- **Node version**: 18 ou superior

### 5. Executar Migrações

Após o primeiro deploy, execute no terminal SSH:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

## 📱 Funcionalidades

### Site Público
- ✅ Página inicial com apresentação
- ✅ Cardápio completo (pizzas, almoço, bebidas, sobremesas)
- ✅ Página sobre/horários de funcionamento
- ✅ Página de contato com integração WhatsApp

### Painel Administrativo
- ✅ Dashboard com resumo financeiro
- ✅ Cadastro de funcionários
- ✅ Controle de adiantamentos
- ✅ Folha de pagamento mensal
- ✅ Registro de despesas
- ✅ Registro de receitas/faturamento
- ✅ Relatórios financeiros

## 🔒 Segurança

- Autenticação segura com NextAuth.js
- Senhas criptografadas com bcrypt
- APIs protegidas por sessão
- Painel admin não acessível ao público

## 📞 Suporte

Para dúvidas ou suporte, entre em contato com o desenvolvedor.

---

Desenvolvido com ❤️ para a Pirata Pizzaria

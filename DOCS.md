# 🏴‍☠️ Pirata Pizzaria - Documentação Técnica Completa

> Sistema de gestão completo para pizzaria, incluindo site institucional público e painel administrativo.

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Arquitetura da Aplicação](#3-arquitetura-da-aplicação)
4. [Estrutura de Diretórios](#4-estrutura-de-diretórios)
5. [Modelo de Dados](#5-modelo-de-dados)
6. [Autenticação e Autorização](#6-autenticação-e-autorização)
7. [APIs REST](#7-apis-rest)
8. [Segurança](#8-segurança)
9. [Ambientes de Desenvolvimento](#9-ambientes-de-desenvolvimento)
10. [Deploy em Produção](#10-deploy-em-produção)
11. [Scripts Úteis](#11-scripts-úteis)
12. [Troubleshooting](#12-troubleshooting)
13. [Manutenção e Operações](#13-manutenção-e-operações)

---

## 1. Visão Geral

### 1.1 O que é

Sistema web completo para gestão de uma pizzaria, composto por:

| Módulo | Descrição | Acesso |
|--------|-----------|--------|
| **Site Público** | Página institucional, cardápio, contato | Qualquer visitante |
| **Painel Admin** | Gestão completa do negócio | Usuários autenticados |

### 1.2 Funcionalidades Principais

#### Site Público
- ✅ Página inicial com apresentação da pizzaria
- ✅ Cardápio completo (pizzas, almoço, bebidas, sobremesas)
- ✅ Página sobre/horários de funcionamento
- ✅ Página de contato com integração WhatsApp

#### Painel Administrativo
- ✅ Dashboard com resumo financeiro
- ✅ Cadastro e gestão de funcionários
- ✅ Controle de ponto (almoço e jantar)
- ✅ Controle de adiantamentos
- ✅ Fechamento de folha de pagamento
- ✅ Registro de despesas
- ✅ Receitas/Vendas (integração Consumer Connect)
- ✅ Inteligência de Mercado (insights e analytics)
- ✅ Gestão de cardápio
- ✅ Relatórios financeiros
- ✅ Logs de auditoria e segurança

---

## 2. Stack Tecnológica

### 2.1 Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Next.js** | 16.1.1 | Framework React com SSR |
| **React** | 19.2.3 | Biblioteca de UI |
| **TypeScript** | 5.x | Tipagem estática |
| **Tailwind CSS** | 4.x | Estilização utility-first |
| **shadcn/ui** | - | Componentes de UI |
| **Radix UI** | - | Primitivos acessíveis |
| **Lucide React** | - | Ícones |
| **React Hook Form** | 7.x | Formulários |
| **Zod** | 4.x | Validação de schemas |

### 2.2 Backend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Next.js API Routes** | - | REST APIs |
| **NextAuth.js** | 4.24.x | Autenticação |
| **Prisma ORM** | 5.22.x | Acesso ao banco de dados |
| **bcryptjs** | 3.x | Hash de senhas |

### 2.3 Banco de Dados

| Ambiente | Banco | Descrição |
|----------|-------|-----------|
| **Desenvolvimento** | SQLite | Arquivo local `dev.db` |
| **Produção** | MySQL | Hostinger MySQL 8.x |

### 2.4 Infraestrutura

| Serviço | Uso |
|---------|-----|
| **Hostinger VPS** | Servidor Ubuntu com Node.js, Nginx, MySQL |
| **Nginx** | Proxy reverso + SSL |
| **PM2** | Gerenciador de processos Node.js |
| **Let's Encrypt** | Certificados SSL gratuitos |
| **Registro.br** | Registro de domínio |
| **GitHub** | Versionamento de código |

---

## 3. Arquitetura da Aplicação

### 3.1 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTE (Browser)                          │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS APPLICATION                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                         MIDDLEWARE                                 │  │
│  │  • Rate Limiting          • Security Headers                      │  │
│  │  • Auth Check             • Suspicious Path Blocking              │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                      │                                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────┐   │
│  │   PAGES (SSR)   │    │   API ROUTES    │    │    COMPONENTS    │   │
│  │  ├─ (public)    │    │  ├─ /auth       │    │  ├─ ui/          │   │
│  │  ├─ (auth)      │    │  ├─ /employees  │    │  ├─ admin/       │   │
│  │  └─ (admin)     │    │  ├─ /advances   │    │  └─ layout/      │   │
│  └─────────────────┘    │  ├─ /expenses   │    └──────────────────┘   │
│                         │  ├─ /revenues   │                            │
│                         │  ├─ /time-entry │                            │
│                         │  └─ /menu       │                            │
│                         └─────────────────┘                            │
│                                      │                                  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                           LIB (Core)                              │  │
│  │  • auth.ts (NextAuth)     • api-security.ts (Wrapper)            │  │
│  │  • prisma.ts (Client)     • validation-schemas.ts                │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        PRISMA ORM                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                        ┌─────────────┴─────────────┐
                        ▼                           ▼
              ┌─────────────────┐         ┌─────────────────┐
              │     SQLite      │         │      MySQL      │
              │  (Development)  │         │  (Production)   │
              └─────────────────┘         └─────────────────┘
```

### 3.2 Fluxo de Requisições

```
1. Cliente faz requisição
        ↓
2. Middleware intercepta:
   • Verifica rate limiting
   • Adiciona headers de segurança
   • Bloqueia paths suspeitos
   • Verifica autenticação (rotas /admin)
        ↓
3. Roteamento Next.js:
   • Páginas: SSR/Client rendering
   • APIs: Server-side handlers
        ↓
4. API Security Wrapper (para APIs):
   • Valida autenticação
   • Verifica autorização (roles)
   • Valida dados de entrada (Zod)
   • Sanitiza inputs
   • Registra audit logs
        ↓
5. Handler da API executa lógica
        ↓
6. Prisma ORM acessa banco de dados
        ↓
7. Resposta retorna ao cliente
```

### 3.3 Padrões de Código

#### API Handler com Segurança

```typescript
import { withApiSecurity, successResponse, errorResponse } from "@/lib/api-security";
import { createEmployeeSchema } from "@/lib/validation-schemas";

export const POST = withApiSecurity(
  async (request, context, data) => {
    // data já está validado e sanitizado
    const employee = await prisma.employee.create({ data });
    return successResponse(employee, 201);
  },
  {
    requireAuth: true,           // Exige autenticação
    requiredRoles: ["ADMIN"],    // Apenas admins
    bodySchema: createEmployeeSchema, // Validação Zod
    auditAction: "CREATE_EMPLOYEE",   // Log de auditoria
  }
);
```

---

## 4. Estrutura de Diretórios

```
pirata/
├── prisma/                      # Configuração do banco de dados
│   ├── schema.prisma            # Schema SQLite (desenvolvimento)
│   ├── schema.mysql.prisma      # Schema MySQL (produção)
│   ├── dev.db                   # Banco SQLite local
│   ├── seed.ts                  # Seed inicial
│   └── seed-menu.ts             # Seed do cardápio
│
├── public/                      # Arquivos estáticos
│   └── logo/                    # Logo da pizzaria
│
├── scripts/                     # Scripts utilitários
│   ├── create-env.js            # Cria .env no build
│   ├── export-data.ts           # Exporta dados do banco
│   ├── import-data.ts           # Importa dados no banco
│   ├── mysql-init.sql           # Script DDL para MySQL
│   └── seed-menu-mysql.sql      # Seed do cardápio MySQL
│
├── src/
│   ├── app/                     # App Router (Next.js 13+)
│   │   ├── (public)/            # Rotas públicas (site)
│   │   │   ├── page.tsx         # Home
│   │   │   ├── cardapio/        # Cardápio
│   │   │   ├── sobre/           # Sobre
│   │   │   └── contato/         # Contato
│   │   │
│   │   ├── (auth)/              # Rotas de autenticação
│   │   │   └── login/           # Login
│   │   │
│   │   ├── (admin)/             # Painel administrativo
│   │   │   ├── layout.tsx       # Layout com sidebar
│   │   │   └── admin/
│   │   │       ├── dashboard/   # Dashboard principal
│   │   │       ├── funcionarios/# Gestão de funcionários
│   │   │       ├── ponto/       # Controle de ponto
│   │   │       ├── adiantamentos/# Adiantamentos
│   │   │       ├── fechamento/  # Fechamento de período
│   │   │       ├── folha/       # Folha de pagamento
│   │   │       ├── despesas/    # Despesas
│   │   │       ├── receitas/    # Receitas
│   │   │       ├── cardapio/    # Gestão do cardápio
│   │   │       ├── relatorios/  # Relatórios
│   │   │       ├── usuarios/    # Gestão de usuários
│   │   │       ├── configuracoes/# Configurações
│   │   │       └── seguranca/   # Logs de auditoria
│   │   │
│   │   └── api/                 # API Routes
│   │       ├── auth/            # NextAuth endpoints
│   │       ├── employees/       # CRUD funcionários
│   │       ├── time-entries/    # CRUD ponto
│   │       ├── advances/        # CRUD adiantamentos
│   │       ├── payroll/         # Folha de pagamento
│   │       ├── payroll-period/  # Períodos de fechamento
│   │       ├── expenses/        # CRUD despesas
│   │       ├── revenues/        # CRUD receitas
│   │       ├── menu/            # CRUD cardápio
│   │       ├── users/           # CRUD usuários
│   │       ├── shift-config/    # Configuração de turnos
│   │       ├── reports/         # Relatórios
│   │       ├── security/        # Logs de segurança
│   │       └── health/          # Health check
│   │
│   ├── components/              # Componentes React
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── admin/               # Componentes do admin
│   │   ├── layout/              # Header, Footer
│   │   └── security/            # Componentes de segurança
│   │
│   ├── lib/                     # Utilitários e configurações
│   │   ├── auth.ts              # Configuração NextAuth
│   │   ├── auth-provider.tsx    # Provider de sessão
│   │   ├── prisma.ts            # Cliente Prisma
│   │   ├── api-security.ts      # Wrapper de segurança
│   │   ├── validation-schemas.ts# Schemas Zod
│   │   ├── permissions.ts       # Verificação de permissões
│   │   ├── csrf.ts              # Proteção CSRF
│   │   ├── date-utils.ts        # Utilitários de data
│   │   └── utils.ts             # Utilitários gerais
│   │
│   ├── types/                   # Tipos TypeScript
│   │   └── next-auth.d.ts       # Extensão de tipos NextAuth
│   │
│   └── middleware.ts            # Middleware global
│
├── server.js                    # Servidor customizado (produção)
├── next.config.ts               # Configuração Next.js
├── package.json                 # Dependências
├── tsconfig.json                # Configuração TypeScript
└── components.json              # Configuração shadcn/ui
```

---

## 5. Modelo de Dados

### 5.1 Diagrama ER Simplificado

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │  Employee   │       │  Advance    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │       │ id          │◄──────│ employeeId  │
│ name        │       │ name        │       │ amount      │
│ email       │       │ role        │       │ status      │
│ password    │       │ salary      │       │ requestDate │
│ role        │       │ worksLunch  │       └─────────────┘
└─────────────┘       │ worksDinner │
                      └──────┬──────┘
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │ TimeEntry   │  │PayrollEntry │  │ PayrollPay  │
    ├─────────────┤  ├─────────────┤  ├─────────────┤
    │ date        │  │ month       │  │ periodId    │
    │ workedLunch │  │ baseSalary  │  │ netAmount   │
    │ workedDinner│  │ netSalary   │  │ paid        │
    │ totalValue  │  └─────────────┘  └─────────────┘
    └─────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Expense    │       │  Revenue    │       │ ShiftConfig │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ category    │       │ source      │       │ name        │
│ description │       │ amount      │       │ description │
│ amount      │       │ date        │       │ value       │
│ date        │       └─────────────┘       └─────────────┘
└─────────────┘

┌─────────────────┐   ┌─────────────────┐
│  MenuCategory   │   │    MenuItem     │
├─────────────────┤   ├─────────────────┤
│ name            │◄──│ categoryId      │
│ displayName     │   │ name            │
│ icon            │   │ price           │
│ order           │   │ featured        │
└─────────────────┘   │ popular         │
                      └─────────────────┘

┌─────────────────┐   ┌─────────────────┐
│   AuditLog      │   │  LoginAttempt   │
├─────────────────┤   ├─────────────────┤
│ userId          │   │ email           │
│ action          │   │ ipAddress       │
│ resource        │   │ success         │
│ ipAddress       │   │ createdAt       │
└─────────────────┘   └─────────────────┘
```

### 5.2 Entidades Principais

#### User (Usuário do sistema)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | Identificador único |
| name | String | Nome completo |
| email | String | Email (único) |
| password | String | Hash bcrypt |
| role | Enum | ADMIN ou MANAGER |

#### Employee (Funcionário)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | Identificador único |
| name | String | Nome completo |
| role | String | Cargo (Garçom, Cozinheiro, etc) |
| salary | Decimal | Salário fixo |
| worksLunch | Boolean | Trabalha no almoço |
| worksDinner | Boolean | Trabalha no jantar |
| lunchPaymentType | Enum | HOUR, SHIFT, DAY |
| dinnerPaymentType | Enum | HOUR, SHIFT, DAY |

#### TimeEntry (Registro de Ponto)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | Identificador único |
| employeeId | String | FK para Employee |
| date | DateTime | Data do registro |
| workedLunch | Boolean | Trabalhou almoço |
| workedDinner | Boolean | Trabalhou jantar |
| clockInLunch | String | Entrada almoço (HH:MM) |
| clockOutLunch | String | Saída almoço (HH:MM) |
| totalValue | Decimal | Valor calculado do dia |

### 5.3 Schema Completo do Banco MySQL (Produção)

O banco de dados `piratapizzaria` contém **14 tabelas**:

#### Resumo das Tabelas

| # | Tabela | Campos | Foreign Key |
|---|--------|--------|-------------|
| 1 | `users` | 7 | - |
| 2 | `employees` | 21 | - |
| 3 | `time_entries` | 18 | → employees |
| 4 | `advances` | 9 | → employees |
| 5 | `payroll_entries` | 13 | → employees |
| 6 | `payroll_periods` | 8 | - |
| 7 | `payroll_payments` | 19 | → payroll_periods |
| 8 | `expenses` | 8 | - |
| 9 | `revenues` | 8 | - |
| 10 | `menu_categories` | 9 | - |
| 11 | `menu_items` | 15 | → menu_categories |
| 12 | `shift_configs` | 6 | - |
| 13 | `login_attempts` | 6 | - |
| 14 | `audit_logs` | 10 | - |

#### Relacionamentos

```
employees ─┬─► time_entries (employeeId → id)
           ├─► advances (employeeId → id)  
           └─► payroll_entries (employeeId → id)

payroll_periods ──► payroll_payments (periodId → id)

menu_categories ──► menu_items (categoryId → id)
```

#### Índices Únicos

- `users.email`
- `menu_categories.name`
- `shift_configs.name`
- `payroll_entries.(employeeId, month)`
- `time_entries.(employeeId, date)`

---

#### CREATE TABLE - users

```sql
CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'ADMIN',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

#### CREATE TABLE - employees

```sql
CREATE TABLE `employees` (
  `id` varchar(191) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(100) NOT NULL,
  `salary` decimal(10,2) NOT NULL DEFAULT '0.00',
  `phone` varchar(20) DEFAULT NULL,
  `document` varchar(20) DEFAULT NULL,
  `hireDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `worksLunch` tinyint(1) NOT NULL DEFAULT '0',
  `lunchPaymentType` varchar(20) NOT NULL DEFAULT 'SHIFT',
  `lunchValue` decimal(10,2) NOT NULL DEFAULT '0.00',
  `lunchStartTime` varchar(10) DEFAULT NULL,
  `lunchEndTime` varchar(10) DEFAULT NULL,
  `worksDinner` tinyint(1) NOT NULL DEFAULT '0',
  `dinnerPaymentType` varchar(20) NOT NULL DEFAULT 'SHIFT',
  `dinnerWeekdayValue` decimal(10,2) NOT NULL DEFAULT '0.00',
  `dinnerWeekendValue` decimal(10,2) NOT NULL DEFAULT '0.00',
  `dinnerStartTime` varchar(10) DEFAULT NULL,
  `dinnerEndTime` varchar(10) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

#### CREATE TABLE - time_entries

```sql
CREATE TABLE `time_entries` (
  `id` varchar(191) NOT NULL,
  `employeeId` varchar(191) NOT NULL,
  `date` date NOT NULL,
  `workedLunch` tinyint(1) NOT NULL DEFAULT '0',
  `workedDinner` tinyint(1) NOT NULL DEFAULT '0',
  `clockInLunch` varchar(10) DEFAULT NULL,
  `clockOutLunch` varchar(10) DEFAULT NULL,
  `clockInDinner` varchar(10) DEFAULT NULL,
  `clockOutDinner` varchar(10) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'PRESENT',
  `notes` text,
  `lunchValue` decimal(10,2) NOT NULL DEFAULT '0.00',
  `dinnerValue` decimal(10,2) NOT NULL DEFAULT '0.00',
  `totalValue` decimal(10,2) NOT NULL DEFAULT '0.00',
  `createdById` varchar(50) DEFAULT NULL,
  `updatedById` varchar(50) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `time_entries_employeeId_date_key` (`employeeId`,`date`),
  CONSTRAINT `time_entries_employeeId_fkey` FOREIGN KEY (`employeeId`) 
    REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

#### CREATE TABLE - advances

```sql
CREATE TABLE `advances` (
  `id` varchar(191) NOT NULL,
  `employeeId` varchar(191) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `requestDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `paymentDate` datetime(3) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'PENDING',
  `notes` text,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `advances_employeeId_fkey` (`employeeId`),
  CONSTRAINT `advances_employeeId_fkey` FOREIGN KEY (`employeeId`) 
    REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

#### CREATE TABLE - payroll_entries

```sql
CREATE TABLE `payroll_entries` (
  `id` varchar(191) NOT NULL,
  `employeeId` varchar(191) NOT NULL,
  `month` varchar(7) NOT NULL,
  `baseSalary` decimal(10,2) NOT NULL,
  `advances` decimal(10,2) NOT NULL DEFAULT '0.00',
  `bonuses` decimal(10,2) NOT NULL DEFAULT '0.00',
  `deductions` decimal(10,2) NOT NULL DEFAULT '0.00',
  `netSalary` decimal(10,2) NOT NULL,
  `paymentDate` datetime(3) DEFAULT NULL,
  `paid` tinyint(1) NOT NULL DEFAULT '0',
  `notes` text,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payroll_entries_employeeId_month_key` (`employeeId`,`month`),
  CONSTRAINT `payroll_entries_employeeId_fkey` FOREIGN KEY (`employeeId`) 
    REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

#### CREATE TABLE - payroll_periods

```sql
CREATE TABLE `payroll_periods` (
  `id` varchar(191) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `periodType` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'OPEN',
  `totalAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

#### CREATE TABLE - payroll_payments

```sql
CREATE TABLE `payroll_payments` (
  `id` varchar(191) NOT NULL,
  `periodId` varchar(191) NOT NULL,
  `employeeId` varchar(50) NOT NULL,
  `employeeName` varchar(255) NOT NULL,
  `daysWorked` int NOT NULL DEFAULT '0',
  `lunchShifts` int NOT NULL DEFAULT '0',
  `dinnerShifts` int NOT NULL DEFAULT '0',
  `fixedSalary` decimal(10,2) NOT NULL DEFAULT '0.00',
  `lunchTotal` decimal(10,2) NOT NULL DEFAULT '0.00',
  `dinnerTotal` decimal(10,2) NOT NULL DEFAULT '0.00',
  `grossAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `advances` decimal(10,2) NOT NULL DEFAULT '0.00',
  `deductions` decimal(10,2) NOT NULL DEFAULT '0.00',
  `netAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `paid` tinyint(1) NOT NULL DEFAULT '0',
  `paidAt` datetime(3) DEFAULT NULL,
  `notes` text,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payroll_payments_periodId_fkey` (`periodId`),
  CONSTRAINT `payroll_payments_periodId_fkey` FOREIGN KEY (`periodId`) 
    REFERENCES `payroll_periods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

#### CREATE TABLE - expenses

```sql
CREATE TABLE `expenses` (
  `id` varchar(191) NOT NULL,
  `category` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` datetime(3) NOT NULL,
  `notes` text,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

#### CREATE TABLE - revenues

```sql
CREATE TABLE `revenues` (
  `id` varchar(191) NOT NULL,
  `source` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` datetime(3) NOT NULL,
  `notes` text,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

#### CREATE TABLE - menu_categories

```sql
CREATE TABLE `menu_categories` (
  `id` varchar(191) NOT NULL,
  `name` varchar(50) NOT NULL,
  `displayName` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `menu_categories_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

#### CREATE TABLE - menu_items

```sql
CREATE TABLE `menu_items` (
  `id` varchar(191) NOT NULL,
  `categoryId` varchar(191) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `popular` tinyint(1) NOT NULL DEFAULT '0',
  `spicy` tinyint(1) NOT NULL DEFAULT '0',
  `vegetarian` tinyint(1) NOT NULL DEFAULT '0',
  `newItem` tinyint(1) NOT NULL DEFAULT '0',
  `imageUrl` varchar(500) DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `menu_items_categoryId_fkey` (`categoryId`),
  CONSTRAINT `menu_items_categoryId_fkey` FOREIGN KEY (`categoryId`) 
    REFERENCES `menu_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

#### CREATE TABLE - shift_configs

```sql
CREATE TABLE `shift_configs` (
  `id` varchar(191) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shift_configs_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

#### CREATE TABLE - login_attempts

```sql
CREATE TABLE `login_attempts` (
  `id` varchar(191) NOT NULL,
  `email` varchar(255) NOT NULL,
  `ipAddress` varchar(45) NOT NULL,
  `success` tinyint(1) NOT NULL,
  `userAgent` text,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `login_attempts_email_idx` (`email`),
  KEY `login_attempts_ipAddress_idx` (`ipAddress`),
  KEY `login_attempts_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

#### CREATE TABLE - audit_logs

```sql
CREATE TABLE `audit_logs` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `userEmail` varchar(255) NOT NULL,
  `action` varchar(50) NOT NULL,
  `resource` varchar(255) NOT NULL,
  `resourceId` varchar(50) DEFAULT NULL,
  `details` text,
  `ipAddress` varchar(45) NOT NULL,
  `userAgent` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `audit_logs_userId_idx` (`userId`),
  KEY `audit_logs_action_idx` (`action`),
  KEY `audit_logs_resource_idx` (`resource`),
  KEY `audit_logs_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 6. Autenticação e Autorização

### 6.1 Configuração NextAuth

```typescript
// src/lib/auth.ts

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // Validação de credenciais
        // Verificação de bloqueio por tentativas
        // Comparação bcrypt
        // Registro de tentativa de login
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas
  },
  callbacks: {
    jwt({ token, user }) { /* adiciona role ao token */ },
    session({ session, token }) { /* adiciona dados à sessão */ },
  },
};
```

### 6.2 Roles e Permissões

| Role | Descrição | Permissões |
|------|-----------|------------|
| **ADMIN** | Administrador | Acesso total, gerenciar usuários, configurações |
| **MANAGER** | Gerente | Acesso operacional, sem gestão de usuários |

### 6.3 Proteção de Rotas

#### No Middleware (rotas de página):
```typescript
// src/middleware.ts
if (pathname.startsWith("/admin")) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.redirect("/login");
  }
}
```

#### Nas APIs (verificação de role):
```typescript
export const POST = withApiSecurity(handler, {
  requireAuth: true,
  requiredRoles: ["ADMIN"],
});
```

### 6.4 Proteção Contra Força Bruta

- **Limite**: 5 tentativas por email ou IP
- **Bloqueio**: 15 minutos após exceder
- **Registro**: Todas tentativas salvas em `login_attempts`

---

## 7. APIs REST

### 7.1 Visão Geral

| Recurso | Base URL | Autenticação | Descrição |
|---------|----------|--------------|-----------|
| Auth | `/api/auth/*` | - | NextAuth endpoints |
| Employees | `/api/employees` | ✅ | CRUD funcionários |
| Time Entries | `/api/time-entries` | ✅ | CRUD ponto |
| Advances | `/api/advances` | ✅ | CRUD adiantamentos |
| Payroll | `/api/payroll` | ✅ | Folha de pagamento |
| Expenses | `/api/expenses` | ✅ | CRUD despesas |
| Revenues | `/api/revenues` | ✅ | CRUD receitas (legado) |
| **Sales** | `/api/sales` | ✅ | **Vendas Consumer Connect** |
| **Sales Stats** | `/api/sales/stats` | ✅ | **Estatísticas de vendas** |
| Menu | `/api/menu/*` | Parcial | Cardápio (público/privado) |
| Users | `/api/users` | ADMIN | CRUD usuários |
| Security | `/api/security/*` | ADMIN | Logs de auditoria |

### 7.2 Endpoints Detalhados

#### Funcionários

```
GET    /api/employees          # Lista todos
POST   /api/employees          # Cria novo
GET    /api/employees/:id      # Busca por ID
PUT    /api/employees/:id      # Atualiza
DELETE /api/employees/:id      # Remove
```

#### Ponto

```
GET    /api/time-entries       # Lista com filtros
POST   /api/time-entries       # Registra ponto
PUT    /api/time-entries/:id   # Atualiza
DELETE /api/time-entries/:id   # Remove
```

**Query params:**
- `employeeId` - Filtrar por funcionário
- `startDate` - Data inicial (YYYY-MM-DD)
- `endDate` - Data final (YYYY-MM-DD)

#### Adiantamentos

```
GET    /api/advances           # Lista com filtros
POST   /api/advances           # Solicita adiantamento
PUT    /api/advances/:id       # Atualiza status
DELETE /api/advances/:id       # Remove
```

#### Vendas (Consumer Connect)

```
GET    /api/sales              # Lista vendas com filtros
POST   /api/sales              # Sincroniza vendas (batch ou unitário)
GET    /api/sales/stats        # Estatísticas agregadas
```

**Query params (GET /api/sales):**
- `month` - Filtrar por mês (YYYY-MM)
- `startDate` - Data inicial (YYYY-MM-DD)
- `endDate` - Data final (YYYY-MM-DD)
- `status` - Status de pagamento (PAID, PENDING, CANCELLED)
- `orderType` - Tipo (COUNTER, TABLE, DELIVERY)
- `limit` - Limite de registros

**Query params (GET /api/sales/stats):**
- `month` - Mês para estatísticas (YYYY-MM)
- `compare` - Comparar com mês anterior (true/false)

**Body (POST /api/sales):**
```json
{
  "externalId": "185586",
  "origin": "Comanda Mobile",
  "orderType": "Mesas/Comandas 3",
  "itemsCount": 2,
  "amount": 93.30,
  "status": "Finalizado Pago",
  "openedAt": "2025-09-01T18:30:19",
  "duration": "55m 34s",
  "unit": "PIRATA PIZZARIA"
}
```

#### Cardápio (Público)

```
GET    /api/menu/public        # Lista cardápio completo (SEM AUTH)
```

#### Cardápio (Admin)

```
GET    /api/menu/categories       # Lista categorias
POST   /api/menu/categories       # Cria categoria
PUT    /api/menu/categories/:id   # Atualiza categoria
DELETE /api/menu/categories/:id   # Remove categoria

GET    /api/menu/items            # Lista itens
POST   /api/menu/items            # Cria item
PUT    /api/menu/items/:id        # Atualiza item
DELETE /api/menu/items/:id        # Remove item
```

### 7.3 Formato de Resposta

#### Sucesso
```json
{
  "id": "clx...",
  "name": "João Silva",
  "...": "..."
}
```

#### Erro
```json
{
  "error": "Mensagem de erro",
  "details": {
    "campo": ["Erro específico do campo"]
  }
}
```

#### Rate Limit
```json
{
  "error": "Muitas requisições. Tente novamente em alguns minutos.",
  "retryAfter": 60
}
```

---

## 8. Segurança

### 8.1 Camadas de Proteção

```
┌─────────────────────────────────────────────────────────┐
│                    MIDDLEWARE                           │
│  • Rate Limiting    • Security Headers                 │
│  • Auth Check       • Suspicious Path Block            │
├─────────────────────────────────────────────────────────┤
│                  API SECURITY WRAPPER                   │
│  • Autenticação     • Autorização (RBAC)              │
│  • Validação Zod    • Sanitização                      │
│  • Audit Logging    • Error Handling                   │
├─────────────────────────────────────────────────────────┤
│                    APLICAÇÃO                            │
│  • bcrypt (senhas)  • JWT (sessões)                   │
│  • CSRF Protection  • Session Timeout                  │
├─────────────────────────────────────────────────────────┤
│                    BANCO DE DADOS                       │
│  • Prisma ORM (SQL Injection Prevention)              │
│  • Conexões SSL (produção)                            │
└─────────────────────────────────────────────────────────┘
```

### 8.2 Headers de Segurança

| Header | Valor | Proteção |
|--------|-------|----------|
| Content-Security-Policy | Restritivo | XSS |
| Strict-Transport-Security | max-age=31536000 | Força HTTPS |
| X-Frame-Options | DENY | Clickjacking |
| X-Content-Type-Options | nosniff | MIME sniffing |
| X-XSS-Protection | 1; mode=block | XSS (legacy) |
| Referrer-Policy | strict-origin-when-cross-origin | Vazamento |
| Permissions-Policy | Restritivo | Recursos |

### 8.3 Rate Limiting

| Tipo | Limite | Janela |
|------|--------|--------|
| `/api/auth/*` | 10 requests | 15 min |
| APIs GET | 100 requests | 1 min |
| APIs POST/PUT/DELETE | 30 requests | 1 min |
| `/api/menu/public` | 200 requests | 1 min |

### 8.4 Hash de Senhas

```typescript
// Algoritmo: bcrypt
// Cost factor: 12 (mais seguro que o padrão 10)

import bcrypt from 'bcryptjs';

// Criar hash
const hash = await bcrypt.hash('senha123', 12);

// Verificar
const valid = await bcrypt.compare('senha123', hash);
```

### 8.5 Gerar Senha Criptografada

Via terminal:
```bash
node -e "require('bcryptjs').hash('sua-senha', 12).then(h => console.log(h))"
```

SQL para atualizar senha no MySQL:
```sql
UPDATE users 
SET password = '$2b$12$hash_aqui',
    updated_at = NOW()
WHERE email = 'admin@piratapizzaria.com.br';
```

---

## 9. Ambientes de Desenvolvimento

### 9.1 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git

### 9.2 Setup Inicial

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd pirata

# 2. Instale dependências
npm install

# 3. Configure o banco de dados (SQLite local)
npm run db:push
npm run db:seed

# 4. Inicie o servidor de desenvolvimento
npm run dev

# 5. Acesse
# Site: http://localhost:3000
# Login: http://localhost:3000/login
#   Email: admin@piratapizzaria.com.br
#   Senha: admin123
```

### 9.3 Scripts npm

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint |
| `npm run db:push` | Aplica schema ao banco |
| `npm run db:seed` | Popula dados iniciais |
| `npm run db:studio` | Abre Prisma Studio |

### 9.4 Variáveis de Ambiente

#### Desenvolvimento (.env não necessário - usa SQLite)

#### Produção (.env obrigatório)
```env
DATABASE_URL=mysql://usuario:senha@localhost:3306/banco
NEXTAUTH_SECRET=chave-secreta-32-caracteres
NEXTAUTH_URL=https://seu-dominio.com
NODE_ENV=production
```

Gerar NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## 10. Deploy em Produção (VPS Hostinger)

### 10.1 Arquitetura de Deploy

```
┌─────────────────────────────────────────────────────────────────────┐
│                        VPS HOSTINGER                                 │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                         NGINX                                │    │
│  │  • Proxy reverso (porta 80/443 → localhost:3000)            │    │
│  │  • SSL/TLS via Let's Encrypt                                │    │
│  │  • Gzip compression                                          │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                               │                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                          PM2                                 │    │
│  │  • Gerenciador de processos Node.js                         │    │
│  │  • Auto-restart em caso de falha                            │    │
│  │  • Logs centralizados                                        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                               │                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              NODE.JS APPLICATION (Next.js)                   │    │
│  │  server.js → .next/standalone → localhost:3000              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                               │                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                      MySQL 8.x                               │    │
│  │  Banco: piratapizzaria                                       │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.2 Fluxo de Deploy

```
1. Desenvolver e testar localmente
         ↓
2. Push para GitHub (branch main)
         ↓
3. SSH na VPS e pull das alterações
         ↓
4. npm install (instala dependências)
         ↓
5. npm run build (gera build standalone)
   • Copia schema.mysql.prisma → schema.prisma
   • Gera Prisma Client
   • Build Next.js
         ↓
6. pm2 restart pirata (reinicia aplicação)
```

### 10.3 Servidor Customizado

O arquivo `server.js` carrega as variáveis de ambiente antes de iniciar o Next.js:

```javascript
// server.js - Carrega .env antes de iniciar Next.js
const dotenvPath = path.join(__dirname, '.env');
if (existsSync(dotenvPath)) {
  require('dotenv').config({ path: dotenvPath });
}

// Inicia Next.js standalone
require('./.next/standalone/server.js');
```

### 10.4 Configuração do Nginx

#### Arquivo de configuração: `/etc/nginx/sites-available/pirata`

```nginx
server {
    listen 80;
    server_name piratapizzaria.com.br www.piratapizzaria.com.br;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**⚠️ Importante**: Use `127.0.0.1` em vez de `localhost` para evitar problemas com IPv6.

#### Comandos Nginx:
```bash
# Testar configuração
sudo nginx -t

# Recarregar configuração
sudo systemctl reload nginx

# Ver status
sudo systemctl status nginx
```

### 10.5 Configuração do PM2

```bash
# Iniciar aplicação
cd /var/www/pirata
pm2 start npm --name "pirata" -- start

# Ver status
pm2 status

# Ver logs
pm2 logs pirata --lines 50

# Reiniciar
pm2 restart pirata

# Salvar configuração para auto-start
pm2 save
pm2 startup
```

### 10.6 Configuração do MySQL

#### Criar banco e usuário:
```sql
CREATE DATABASE piratapizzaria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pirata'@'localhost' IDENTIFIED BY 'senha_segura';
GRANT ALL PRIVILEGES ON piratapizzaria.* TO 'pirata'@'localhost';
FLUSH PRIVILEGES;
```

#### Aplicar schema:
```bash
# Via SSH na VPS
cd /var/www/pirata
npx prisma db push
npx tsx prisma/seed.ts
```

### 10.7 Configuração de Domínio (Registro.br)

Para apontar um domínio do Registro.br para a VPS:

1. **Ativar DNS do Registro.br**:
   - Acesse o Registro.br → Meus Domínios → seu domínio
   - Clique em "Utilizar os servidores DNS do Registro.br"

2. **Configurar registros A**:
   | Tipo | Nome | Valor |
   |------|------|-------|
   | A | @ | IP_DA_VPS |
   | A | www | IP_DA_VPS |

3. **Aguardar propagação** (até 48h, geralmente 1-4h)

4. **Verificar propagação**:
   ```bash
   ping piratapizzaria.com.br
   ```

### 10.8 Configuração de SSL (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Gerar certificado SSL
sudo certbot --nginx -d piratapizzaria.com.br -d www.piratapizzaria.com.br

# Renovação automática (já configurada pelo Certbot)
# Testar renovação
sudo certbot renew --dry-run
```

### 10.9 Checklist de Deploy

#### Antes do Deploy
- [ ] VPS configurada com Ubuntu/Debian
- [ ] Node.js 18+ instalado
- [ ] Nginx instalado e configurado
- [ ] PM2 instalado globalmente (`npm i -g pm2`)
- [ ] MySQL instalado e configurado
- [ ] Domínio apontando para IP da VPS

#### Deploy Inicial
- [ ] Clonar repositório em `/var/www/pirata`
- [ ] Criar arquivo `.env` com variáveis de produção
- [ ] `npm install`
- [ ] `npm run build`
- [ ] `npx prisma db push`
- [ ] `npx tsx prisma/seed.ts`
- [ ] Iniciar com PM2
- [ ] Configurar Nginx
- [ ] Configurar SSL com Certbot

#### Após o Deploy
- [ ] Testar acesso HTTP
- [ ] Testar acesso HTTPS
- [ ] Testar login
- [ ] Alterar senha do admin
- [ ] Verificar logs (`pm2 logs pirata`)

### 10.10 Comandos SSH Úteis

```bash
# Conectar à VPS
ssh root@IP_DA_VPS

# Navegar para projeto
cd /var/www/pirata

# Ver logs da aplicação
pm2 logs pirata --lines 100

# Ver logs de erro do Nginx
sudo tail -50 /var/log/nginx/error.log

# Verificar .env
cat .env

# Reiniciar aplicação
pm2 restart pirata

# Reiniciar Nginx
sudo systemctl reload nginx

# Ver uso de memória/CPU
pm2 monit

# Atualizar código
git pull origin main
npm install
npm run build
pm2 restart pirata
```

### 10.11 Troubleshooting de Deploy

#### ❌ Site não carrega ("This site can't be reached")
1. Verificar se Nginx está rodando: `sudo systemctl status nginx`
2. Verificar se PM2 está rodando: `pm2 status`
3. Verificar firewall: `sudo ufw status`
4. Verificar logs: `sudo tail -50 /var/log/nginx/error.log`

#### ❌ Nginx retorna 502 Bad Gateway
1. Verificar se a aplicação está rodando: `pm2 status`
2. Verificar porta correta no proxy_pass: deve ser `127.0.0.1:3000`
3. Verificar logs do PM2: `pm2 logs pirata`

#### ❌ Connection refused (IPv6)
O Nginx pode tentar IPv6 em vez de IPv4. Trocar no arquivo de configuração:
```nginx
# De:
proxy_pass http://localhost:3000;

# Para:
proxy_pass http://127.0.0.1:3000;
```

---

## 11. Scripts Úteis

### 11.1 Gerar Senha Criptografada

```bash
# Terminal
node -e "require('bcryptjs').hash('nova_senha', 12).then(console.log)"
```

### 11.2 Atualizar Senha no Banco

```sql
-- MySQL
UPDATE users 
SET password = '$2b$12$hash_gerado',
    updated_at = NOW()
WHERE email = 'admin@piratapizzaria.com.br';
```

### 11.3 Exportar Dados

```bash
npx tsx scripts/export-data.ts
```

### 11.4 Importar Dados

```bash
npx tsx scripts/import-data.ts
```

### 11.5 Limpar Logs Antigos

```sql
-- Limpar logs de auditoria com mais de 90 dias
DELETE FROM audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- Limpar tentativas de login antigas
DELETE FROM login_attempts WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

---

## 12. Troubleshooting

### 12.1 Erros Comuns

#### ❌ "Environment variable not found: DATABASE_URL"

**Causa**: O arquivo `.env` não existe ou está incorreto.

**Solução**:
```bash
# Via SSH
cd ~/domains/piratapizzaria.com.br/public_html
cat > .env << 'EOF'
DATABASE_URL=mysql://usuario:senha@localhost:3306/banco
NEXTAUTH_SECRET=sua-chave
NEXTAUTH_URL=https://seu-dominio.com
NODE_ENV=production
EOF
```

#### ❌ "[next-auth][error][NO_SECRET]"

**Causa**: NEXTAUTH_SECRET não definido.

**Solução**:
```bash
# Gerar secret
openssl rand -base64 32

# Adicionar ao .env
NEXTAUTH_SECRET=chave_gerada
```

#### ❌ "Email ou senha incorretos"

**Causa**: Credenciais inválidas ou conta bloqueada.

**Solução**:
```sql
-- Verificar se conta está bloqueada
SELECT * FROM login_attempts 
WHERE email = 'admin@piratapizzaria.com.br' 
ORDER BY created_at DESC LIMIT 10;

-- Limpar tentativas para desbloquear
DELETE FROM login_attempts 
WHERE email = 'admin@piratapizzaria.com.br';

-- Resetar senha
UPDATE users 
SET password = '$2b$12$novo_hash'
WHERE email = 'admin@piratapizzaria.com.br';
```

#### ❌ Erro 429 (Too Many Requests)

**Causa**: Rate limit excedido.

**Solução**: Aguardar o tempo indicado em `retryAfter`.

#### ❌ Prisma Client não gerado

**Causa**: Build não executou `prisma generate`.

**Solução**:
```bash
npx prisma generate
npm run build
```

### 12.2 Verificar Logs

```bash
# Logs da aplicação (PM2)
pm2 logs pirata --lines 100

# Erros do Nginx
sudo tail -50 /var/log/nginx/error.log

# Acesso do Nginx
sudo tail -50 /var/log/nginx/access.log

# Logs em tempo real
pm2 logs pirata --lines 0 -f
```

### 12.3 Verificar Conexão MySQL

```bash
# Via SSH
mysql -u usuario -p banco_de_dados

# Testar query
SELECT COUNT(*) FROM users;
```

---

## 13. Manutenção e Operações

### 13.1 Backup

#### Banco de Dados (MySQL)
```bash
# Via phpMyAdmin ou mysqldump
mysqldump -u usuario -p banco > backup_$(date +%Y%m%d).sql
```

#### Arquivos
```bash
# Compactar projeto
tar -czvf backup_pirata_$(date +%Y%m%d).tar.gz public_html/
```

### 13.2 Monitoramento

- **Health Check**: GET `/api/health`
- **Logs de Auditoria**: `/admin/seguranca`
- **Logs do Sistema**: `stderr.log` e `stdout.log`

### 13.3 Atualizações

1. Fazer alterações localmente
2. Testar em desenvolvimento
3. Commit e push para GitHub
4. Hostinger faz auto-deploy
5. Verificar logs após deploy

### 13.4 Contatos

- **Desenvolvedor**: [seu-email]
- **Suporte Hostinger**: Painel hPanel

---

## 📝 Changelog

| Data | Versão | Descrição |
|------|--------|-----------|
| 2024-12 | 1.0.0 | Versão inicial |
| 2024-12 | 1.1.0 | Adicionado controle de ponto |
| 2024-12 | 1.2.0 | Adicionado cardápio dinâmico |
| 2024-12 | 1.3.0 | Adicionado fechamento de período |
| 2025-01 | 1.4.0 | Melhorias de segurança |
| 2025-12 | 1.5.0 | Deploy em VPS Hostinger com Nginx + PM2 |

---

> **Desenvolvido com ❤️ para a Pirata Pizzaria**


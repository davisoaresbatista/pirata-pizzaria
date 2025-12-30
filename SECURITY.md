# 🔐 Guia de Segurança - Pirata

Este documento descreve as medidas de segurança implementadas na plataforma e boas práticas para manter a aplicação segura.

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Autorização](#autorização)
4. [Proteção de APIs](#proteção-de-apis)
5. [Headers de Segurança](#headers-de-segurança)
6. [Rate Limiting](#rate-limiting)
7. [Auditoria](#auditoria)
8. [Validação de Dados](#validação-de-dados)
9. [Proteções Adicionais](#proteções-adicionais)
10. [Painel de Segurança](#painel-de-segurança)
11. [Checklist de Deploy](#checklist-de-deploy)

---

## 🎯 Visão Geral

A plataforma implementa múltiplas camadas de segurança baseadas nas melhores práticas para aplicações SaaS:

| Camada | Proteção |
|--------|----------|
| **Middleware** | Rate limiting, headers de segurança, bloqueio de paths suspeitos |
| **Autenticação** | NextAuth com JWT, proteção contra força bruta, sessões curtas |
| **Autorização** | RBAC (Role-Based Access Control) com roles ADMIN/MANAGER |
| **APIs** | Validação com Zod, sanitização de entrada, logs de auditoria |
| **Banco de Dados** | Prisma ORM (prevenção de SQL Injection), hashing bcrypt |

---

## 🔑 Autenticação

### Configurações de Sessão

```typescript
session: {
  strategy: "jwt",
  maxAge: 8 * 60 * 60, // 8 horas (reduzido de 30 dias)
  updateAge: 60 * 60,  // Atualiza a cada 1 hora
}
```

### Proteção Contra Força Bruta

- **Máximo de tentativas:** 5 por email ou IP
- **Tempo de bloqueio:** 15 minutos
- **Tabela `login_attempts`:** Registra todas as tentativas

### Cookies Seguros

```typescript
cookies: {
  sessionToken: {
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
}
```

### Hash de Senhas

- **Algoritmo:** bcrypt
- **Cost factor:** 12 (mais seguro que o padrão 10)

---

## 👮 Autorização

### Roles Disponíveis

| Role | Permissões |
|------|------------|
| **ADMIN** | Acesso total, gerenciamento de usuários, configurações |
| **MANAGER** | Acesso operacional, sem gerenciamento de usuários |

### Verificação nas APIs

```typescript
export const GET = withApiSecurity(handler, {
  requireAuth: true,
  requiredRoles: ["ADMIN"], // Apenas admins
});
```

---

## 🛡️ Proteção de APIs

### Wrapper de Segurança

Todas as APIs usam o wrapper `withApiSecurity` que fornece:

1. ✅ Verificação de autenticação
2. ✅ Verificação de autorização por role
3. ✅ Validação de entrada com Zod
4. ✅ Sanitização de dados
5. ✅ Log de auditoria automático
6. ✅ Tratamento de erros padronizado

### Exemplo de Uso

```typescript
import { withApiSecurity, successResponse } from "@/lib/api-security";
import { createUserSchema } from "@/lib/validation-schemas";

export const POST = withApiSecurity(
  async (request, context, data) => {
    // data já está validado e sanitizado
    return successResponse(result, 201);
  },
  {
    requireAuth: true,
    requiredRoles: ["ADMIN"],
    bodySchema: createUserSchema,
    auditAction: "CREATE_USER",
  }
);
```

---

## 📝 Headers de Segurança

Headers configurados no `middleware.ts` e `next.config.ts`:

| Header | Valor | Proteção |
|--------|-------|----------|
| Content-Security-Policy | Restritivo | XSS, injeção de código |
| Strict-Transport-Security | max-age=31536000 | Força HTTPS |
| X-Frame-Options | DENY | Clickjacking |
| X-Content-Type-Options | nosniff | MIME sniffing |
| X-XSS-Protection | 1; mode=block | XSS (navegadores antigos) |
| Referrer-Policy | strict-origin-when-cross-origin | Vazamento de dados |
| Permissions-Policy | Restritivo | Acesso a recursos |

---

## ⏱️ Rate Limiting

### Configurações

| Tipo de Rota | Limite | Janela |
|--------------|--------|--------|
| `/api/auth/*` | 10 requests | 15 minutos |
| APIs de leitura (GET) | 100 requests | 1 minuto |
| APIs de escrita (POST/PUT/DELETE) | 30 requests | 1 minuto |

### Respostas de Rate Limit

```json
{
  "error": "Muitas requisições. Tente novamente em alguns minutos.",
  "retryAfter": 60
}
```

---

## 📊 Auditoria

### Tabela `audit_logs`

Registra automaticamente:

- **userId/userEmail**: Quem executou a ação
- **action**: Tipo de ação (CREATE, UPDATE, DELETE, ACCESS_DENIED)
- **resource**: Recurso afetado (ex: /api/employees)
- **resourceId**: ID do item específico
- **details**: Detalhes adicionais em JSON
- **ipAddress/userAgent**: Origem da requisição
- **createdAt**: Timestamp

### Ações Registradas

- CREATE_USER, UPDATE_USER, DELETE_USER
- CREATE_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE
- CREATE_ADVANCE, UPDATE_ADVANCE, DELETE_ADVANCE
- CREATE_TIME_ENTRY, UPDATE_TIME_ENTRY, DELETE_TIME_ENTRY
- ACCESS_DENIED (tentativas de acesso não autorizado)

---

## ✅ Validação de Dados

### Schemas com Zod

Todos os dados de entrada são validados usando Zod:

```typescript
// Exemplo de schema
export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  password: z.string().min(6).max(100),
  role: z.enum(["ADMIN", "MANAGER"]).default("MANAGER"),
});
```

### Sanitização

- Remoção de scripts e event handlers
- Trim de espaços
- Conversão de tipos seguros

---

## 🛡️ Proteções Adicionais

### Timeout de Sessão por Inatividade

Componente `SessionTimeout` que:

- Monitora atividade do usuário (mouse, teclado, scroll)
- Após **30 minutos** de inatividade, mostra aviso
- Usuário tem **5 minutos** para responder
- Logout automático se não responder

```tsx
// Configurações em SessionTimeout.tsx
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos
const WARNING_BEFORE_LOGOUT_MS = 5 * 60 * 1000; // 5 minutos de aviso
```

### Honeypot Anti-Bot

Campo invisível no formulário de login:

```tsx
<HoneypotField name="website" />
```

- Invisível para usuários reais
- Bots preenchem automaticamente
- Requisição rejeitada silenciosamente se preenchido

### Indicador de Força de Senha

Componente `PasswordStrength` que verifica:

- ✅ Mínimo 8 caracteres
- ✅ Letra minúscula
- ✅ Letra maiúscula
- ✅ Número
- ✅ Caractere especial

### CSRF Protection

Proteção adicional via tokens:

```typescript
import { requireCSRFToken } from "@/lib/csrf";

// Em APIs sensíveis
const csrf = await requireCSRFToken(request);
if (!csrf.valid) {
  return errorResponse(csrf.error, 403);
}
```

---

## 📊 Painel de Segurança

### Acessando

1. Faça login como **ADMIN**
2. Navegue até **Segurança** no menu lateral
3. URL: `/admin/seguranca`

### Funcionalidades

**Logs de Auditoria:**
- Histórico de todas as ações (CREATE, UPDATE, DELETE)
- Filtro por tipo de ação
- IP e user agent registrados
- Paginação e busca

**Tentativas de Login:**
- Histórico de logins (sucesso/falha)
- Filtro por email
- Estatísticas das últimas 24h
- Identificação de IPs suspeitos

**Estatísticas em Tempo Real:**
- Logins bem-sucedidos (24h)
- Tentativas falhas (24h)
- Total de logs de auditoria
- Taxa de sucesso de login

### APIs de Segurança

```
GET /api/security/logs          # Logs de auditoria
GET /api/security/login-attempts # Tentativas de login
```

---

## 🚀 Checklist de Deploy

### Variáveis de Ambiente Obrigatórias

```env
# Autenticação
NEXTAUTH_SECRET=<string-aleatória-de-32+-caracteres>
NEXTAUTH_URL=https://seu-dominio.com

# Banco de Dados
DATABASE_URL=mysql://user:password@host:3306/database

# Ambiente
NODE_ENV=production
```

### Gerar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### Verificações Antes do Deploy

- [ ] `NEXTAUTH_SECRET` definido e seguro
- [ ] `NODE_ENV=production`
- [ ] HTTPS configurado
- [ ] Backup do banco de dados
- [ ] Senhas do admin alteradas
- [ ] Logs de auditoria funcionando

### Após o Deploy

- [ ] Testar login/logout
- [ ] Verificar headers de segurança (usar [securityheaders.com](https://securityheaders.com))
- [ ] Testar rate limiting
- [ ] Verificar logs de auditoria
- [ ] Testar permissões de roles

---

## 🔄 Atualizando o Banco de Dados

Após atualizar o schema, execute:

```bash
# Desenvolvimento
npx prisma db push

# Produção (com migrations)
npx prisma migrate deploy
```

---

## 📞 Resposta a Incidentes

### Em caso de suspeita de invasão:

1. **Verificar logs de auditoria** - Procurar ações suspeitas
2. **Verificar login_attempts** - Identificar IPs maliciosos
3. **Revogar sessões** - Alterar NEXTAUTH_SECRET
4. **Alterar senhas** - De todos os usuários admin
5. **Revisar permissões** - Verificar roles de usuários

### Contatos de Emergência

- Responsável técnico: [seu-email]
- Backup: [email-backup]

---

## 📚 Referências

- [OWASP Top 10](https://owasp.org/Top10/)
- [NextAuth.js Security](https://next-auth.js.org/getting-started/security)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/security)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)


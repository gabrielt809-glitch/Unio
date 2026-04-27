# Technical Debt

## 1. Prettier

Resolvido na Etapa 2. Prettier esta instalado e configurado com `format` e `format:check`.

## 2. Vitest

Resolvido na Etapa 2. Vitest esta instalado com ambiente `jsdom`.

## 3. Testing Library

Resolvido na Etapa 2. Testing Library, jest-dom e user-event estao instalados e com setup global.

## 4. Ausencia de React Router

A navegacao atual e manual. Isso e aceitavel no baseline, mas limita URLs por modulo e deep links.

## 5. Ausencia de TanStack Query

Hooks atuais gerenciam loading, erro e cache local manualmente. TanStack Query deve entrar antes de ampliar muito o CRUD.

## 6. React Hook Form

Resolvido para o baseline de Auth na Etapa 5. Login, cadastro, magic link, recuperacao e reset usam React Hook Form. Ainda falta migrar formularios de dominio quando os CRUDs forem evoluidos.

## 7. Zod

Resolvido para o baseline de Auth na Etapa 5. Schemas de login, cadastro, magic link, recuperacao e reset vivem em `src/modules/auth/schemas/authSchemas.ts`. Ainda faltam schemas de dominio.

## 8. Necessidade de .env real

Resolvido para ambiente local: `.env.local` existe e foi validado com publishable key. Ainda falta validar fluxo real de usuario no navegador antes de confiar em CRUD completo.

## 9. Types gerados do Supabase

Tipos de banco sao manuais, embora agora estejam alinhados as migrations e ligados ao client Supabase. Gerar types oficiais reduz risco de drift entre SQL e frontend.

## 10. Repeticoes em formularios e hooks

Existe repeticao em submit, loading/error e drafts de forms em `tasks`, `habits`, `finance` e `health`. A abstracao deve vir depois de React Hook Form/Zod ou TanStack Query.

## 11. Design system

Resolvido parcialmente na Etapa 4. Tokens CSS, componentes base, Auth visual e validacao responsiva foram fortalecidos. Ainda faltam componentes interativos como `Tabs`, `Switch`, `Toast`, `BottomSheet` e `Drawer`, que devem nascer apenas quando houver uso real.

## 12. Itens para proximas etapas

1. Ampliar testes de utils e componentes base.
2. Validar login real por magic link com usuario de teste.
3. Validar CRUD real e RLS com dois usuarios.
4. Gerar types Supabase.
5. Avaliar React Router.
6. Adicionar TanStack Query.
7. Expandir React Hook Form e Zod para modulos de dominio.
8. Validar login, cadastro, recuperacao e reset com usuario real de teste.
9. Aplicar manualmente a migration de hardening `20260426201000_harden_user_foundation.sql`, se ainda nao tiver sido aplicada.
10. Revisar shell autenticado com usuario real e dados suficientes para listas longas.

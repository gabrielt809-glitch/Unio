# Unio

Unio e um Life OS pessoal premium. O objetivo do app e centralizar rotina, tarefas, habitos, financas, saude, sono, agua, nutricao, bem-estar e configuracoes em um unico lugar.

## Stack

- React
- Vite
- TypeScript
- TailwindCSS
- Supabase
- TanStack Query
- PWA manual com `manifest.webmanifest` e `sw.js`
- Vercel

## Como instalar

```bash
npm install
```

## Como rodar

```bash
npm run dev
```

URL local padrao:

```text
http://127.0.0.1:5173/
```

URL inicial de producao:

```text
https://unio.vercel.app/
```

## Como fazer build

```bash
npm run build
```

## Lint e typecheck

```bash
npm run lint
npm run typecheck
```

## Formatacao

```bash
npm run format
npm run format:check
```

## Testes

```bash
npm run test
npm run test:watch
npm run test:visual
```

## Estrutura do projeto

```text
Unio/
  docs/
  public/
  src/
    app/
    components/
    config/
    constants/
    hooks/
    modules/
    services/
    store/
    styles/
    types/
    utils/
  supabase/
    migrations/
```

## Variaveis de ambiente

Crie um arquivo `.env.local` na raiz usando `.env.example` como referencia:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Nunca exponha service role key, JWT secret ou chaves administrativas no frontend.

`.env.local` e demais arquivos `.env` locais estao ignorados pelo Git. Para deploy, configure essas variaveis diretamente na Vercel.

## Preparacao para GitHub

Antes do primeiro commit, confirme que os seguintes itens nao entram no versionamento:

- `.env`, `.env.local`, `.env.*.local`
- `node_modules/`
- `dist/`
- `.npm-cache/`
- `.vercel/`
- logs `*.log` e erros `*.err`
- caches e capturas locais de validacao

Arquivos esperados no repositorio incluem `src/`, `public/`, `supabase/`, `docs/`, `package.json`, `package-lock.json`, configs de Vite/Tailwind/TypeScript/ESLint/Prettier, `README.md`, `vercel.json`, `.gitignore` e `.env.example`.

Em upload manual pelo GitHub, confira arquivos ocultos seguros como `.gitignore` e `.env.example`, pois eles podem nao aparecer quando a selecao de arquivos e feita pelo navegador.

## Supabase

As migrations ficam em `supabase/migrations`. A base atual cria `spaces`, `profiles`, `user_preferences` e tabelas de dominio com RLS por usuario. Consulte [Supabase](docs/SUPABASE.md) antes de confiar em CRUD real.

Ambiente local validado com `.env.local`, publishable key, migrations aplicadas manualmente no painel Supabase e URLs de autenticacao configuradas manualmente.

Para producao na Vercel, configurar no Supabase Auth:

- Site URL: `https://unio.vercel.app`
- Redirect URL: `https://unio.vercel.app/**`
- Redirect URL local: `http://localhost:5173/**`

Validacao controlada sem sessao confirmou que as tabelas protegidas existem e nao retornam linhas anonimas. A Etapa 5 adicionou login com senha, cadastro, magic link, recuperacao/reset de senha e garantia de `profiles`, `spaces` e `user_preferences` apos sessao valida.

Fluxos reais de email, recuperacao e CRUD devem ser testados manualmente com usuario de teste antes de novas features. Se ainda nao foram aplicadas no Supabase remoto, aplicar tambem as migrations `20260426201000_harden_user_foundation.sql` e `20260427100000_tasks_hardening.sql`.

## Status atual

O projeto existente ja possui base React/Vite/TypeScript/Tailwind, PWA, Supabase client, migrations com RLS, shell mobile-first, Design System baseline premium, Auth completo e primeiro CRUD real de Tasks com TanStack Query.

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

Ainda faltam migrar Habits/Finance/Health para TanStack Query, expandir React Hook Form/Zod para os demais modulos de dominio, gerar types oficiais pelo Supabase CLI e validar manualmente o CRUD de Tasks em producao.

## Design System

Tokens visuais vivem em `src/styles/` e componentes base reutilizaveis vivem em `src/components/`. A Etapa 4 padronizou `Button`, `IconButton`, `Input`, `Textarea`, `Select`, `Surface`, `Card`, `Badge`, `Chip`, `ProgressBar`, `Divider`, `Skeleton`, estados globais e wrappers de layout.

Validacao visual controlada confirmou Auth sem scroll horizontal em `320x568`, `390x844` e `768x900`, sem console error/warning no fluxo observado.

O Visual QA Gate agora e obrigatorio em todas as proximas etapas. Ele roda com Playwright em `320x568`, `375x667`, `390x844`, `430x932` e `768x900`, validando Auth real e um harness visual local para telas internas sem depender de usuario real.

## Documentacao

- [Architecture](docs/ARCHITECTURE.md)
- [Quality](docs/QUALITY.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Supabase](docs/SUPABASE.md)
- [Roadmap](docs/ROADMAP.md)
- [QA Checklist](docs/QA_CHECKLIST.md)
- [Release Checklist](docs/RELEASE_CHECKLIST.md)
- [Deploy](docs/DEPLOY.md)
- [Testing](docs/TESTING.md)
- [Versioning](docs/VERSIONING.md)
- [Monitoring](docs/MONITORING.md)
- [Privacy And Analytics](docs/PRIVACY_ANALYTICS.md)
- [Technical Debt](docs/TECHNICAL_DEBT.md)
- [Decisions](docs/DECISIONS.md)

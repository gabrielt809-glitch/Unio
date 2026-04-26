# Unio

Unio e um Life OS pessoal premium. O objetivo do app e centralizar rotina, tarefas, habitos, financas, saude, sono, agua, nutricao, bem-estar e configuracoes em um unico lugar.

## Stack

- React
- Vite
- TypeScript
- TailwindCSS
- Supabase
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

## Supabase

As migrations ficam em `supabase/migrations`. A base atual cria `spaces`, `profiles`, `user_preferences` e tabelas de dominio com RLS por usuario. Consulte [Supabase](docs/SUPABASE.md) antes de confiar em CRUD real.

Ambiente local validado com `.env.local`, publishable key, migrations aplicadas manualmente no painel Supabase e URLs de autenticacao configuradas manualmente.

Validacao controlada sem sessao confirmou que as tabelas protegidas existem e nao retornam linhas anonimas. Fluxo real de login por magic link e CRUD devem ser testados manualmente com usuario de teste antes de novas features.

## Status atual

O projeto existente ja possui base React/Vite/TypeScript/Tailwind, PWA, Supabase client, migrations com RLS, shell mobile-first, modulos iniciais e Design System baseline premium. A validacao atual passa em:

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

Ainda faltam TanStack Query, React Hook Form, Zod, types oficiais gerados pelo Supabase CLI e validacao com Supabase real.

## Design System

Tokens visuais vivem em `src/styles/` e componentes base reutilizaveis vivem em `src/components/`. A Etapa 4 padronizou `Button`, `IconButton`, `Input`, `Textarea`, `Select`, `Surface`, `Card`, `Badge`, `Chip`, `ProgressBar`, `Divider`, `Skeleton`, estados globais e wrappers de layout.

Validacao visual controlada confirmou Auth sem scroll horizontal em `320x568`, `390x844` e `768x900`, sem console error/warning no fluxo observado.

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

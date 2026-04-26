# Decisions

## 1. Manter projeto existente

Decidido manter o projeto ja existente em `C:\Users\gabri\Desktop\Unio`, porque ele ja possui base React/Vite/TypeScript/Tailwind/Supabase e passa em lint, typecheck e build.

## 2. Nao rodar scaffold novamente

Nao rodar `create-vite` nem `npm init`. Isso evitaria sobrescrever arquivos existentes e criar estrutura duplicada.

## 3. Preservar estrutura atual

A estrutura `src/app`, `src/components`, `src/modules`, `src/services`, `src/store`, `src/hooks`, `src/utils`, `src/types`, `src/constants`, `src/config` e `src/styles` esta alinhada ao Prompt Mestre Global.

## 4. Evoluir documentacao primeiro

Antes de novas features, registrar arquitetura, qualidade, Supabase, deploy, testes, privacidade, roadmap e dividas tecnicas.

## 5. Baseline de qualidade automatizada

Prettier, Vitest e Testing Library foram adicionados na Etapa 2. Novas etapas devem rodar format:check, lint, typecheck, test e build.

## 6. Validar Supabase real

CRUD completo so deve ser considerado confiavel depois de aplicar migration em um projeto Supabase real, configurar `.env`, autenticar e validar persistencia por usuario.

## 7. Types Supabase manuais ate CLI estar disponivel

A Supabase CLI nao esta instalada no ambiente atual. Ate existir CLI, login e project ref, o projeto mantem `src/types/database.ts` manual e coerente com as migrations.

## 8. Profiles e preferencias como base

`profiles` e `user_preferences` fazem parte do baseline de usuario. Compartilhamento completo de spaces continua fora do escopo atual.

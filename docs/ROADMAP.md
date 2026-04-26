# Roadmap

## 1. Estado atual do app

O Unio ja tem baseline funcional de PWA com React/Vite/TypeScript/Tailwind/Supabase. A UI inicial cobre autenticacao, dashboard, tarefas, habitos, financas, saude/nutricao e ajustes.

## 2. O que ja existe

- Shell mobile-first.
- Bottom navigation com safe-area.
- Service worker manual.
- Manifest PWA.
- Supabase client e migration inicial.
- RLS por usuario.
- CRUD inicial em tarefas, habitos e financas.
- Check-in de saude e refeicoes.
- Estados de loading, erro e vazio.

## 3. O que falta

- Documentacao de produto mais detalhada.
- `.env` real.
- Validacao real em Supabase.
- Types oficiais do Supabase.
- React Hook Form e Zod.
- TanStack Query.
- React Router, se URLs por modulo forem necessarias.

## 4. Ordem recomendada das proximas etapas

1. Ampliar testes para utils, componentes base e hooks.
2. Gerar types Supabase.
3. Validar Supabase real.
4. Introduzir TanStack Query.
5. Introduzir React Hook Form e Zod.
6. Evoluir modulos com features novas.

## 5. Priorizacao dos modulos

1. Auth e Spaces.
2. Tarefas.
3. Habitos.
4. Saude, agua, sono e nutricao.
5. Financas.
6. Bem-estar.
7. Ajustes e preferencias.

## 6. Estabilizar antes de novas features

Antes de ampliar escopo, estabilizar Supabase real, types de banco, padrao de formularios e cobertura de testes.

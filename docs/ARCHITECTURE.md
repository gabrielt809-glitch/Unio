# Architecture

## 1. Visao geral da arquitetura atual

O Unio e um PWA React com Vite, TypeScript, TailwindCSS e Supabase. A base atual ja possui shell principal, autenticacao por magic link, espaco pessoal padrao, navegacao mobile por estado global e modulos iniciais para dashboard, tarefas, habitos, financas, saude/nutricao e ajustes.

A aplicacao separa inicializacao, UI reutilizavel, modulos de dominio, services Supabase, hooks, tipos, utilitarios e estilos. Supabase nao aparece diretamente em componentes visuais; as chamadas ficam em `src/modules/*/*Service.ts` ou `src/services/supabase`.

## 2. Estrutura de pastas encontrada

- `src/app`: bootstrap, providers, shell, top bar, bottom nav, rotas manuais e service worker.
- `src/components`: componentes reutilizaveis como `Button`, `Field`, `Surface`, `StateView`, `ConfirmDialog`.
- `src/modules`: dominios do produto: `auth`, `dashboard`, `tasks`, `habits`, `finance`, `health`, `settings`, `spaces`.
- `src/services`: integracoes externas, hoje com Supabase.
- `src/store`: estado global minimo, hoje com rota ativa.
- `src/hooks`: hooks reutilizaveis.
- `src/utils`: funcoes puras de data, formato, erro e classes.
- `src/types`: tipos compartilhados e modelos de banco.
- `src/constants`: constantes de navegacao.
- `src/config`: leitura de ambiente.
- `src/styles`: CSS global e tokens visuais.
- `public`: manifest, service worker e icones.
- `supabase/migrations`: schema inicial com RLS.

## 3. Padrao atual de modulos

Cada modulo tende a ter:

- `*View.tsx` para tela e composicao visual.
- `use*.ts` para estado, loading, erro, refresh e acoes.
- `*Service.ts` para acesso Supabase.
- `*Types.ts` para drafts e tipos locais quando necessario.

Exemplos: `tasks`, `habits`, `finance` e `health`.

## 4. Padrao desejado de modulos

Manter a estrutura atual, mas evoluir para:

- `components/` internos quando uma tela crescer.
- `schemas/` quando Zod for adicionado.
- `queries/` ou `hooks/` de dados quando TanStack Query for adicionado.
- `utils/` locais apenas para regras especificas do dominio.
- `types.ts` ou `domain.ts` quando os tipos deixarem de ser simples.

## 5. Padrao de componentes

Componentes reutilizaveis devem ficar em `src/components`. Componentes especificos de uma tela devem ficar dentro do modulo correspondente. Componentes visuais nao devem importar `supabase`, nem conhecer detalhes de SQL, RLS ou persistencia.

## 6. Padrao de hooks

Hooks reutilizaveis ficam em `src/hooks`. Hooks de dominio ficam dentro do modulo. Eles podem coordenar services, estado assincromo, loading, erro e atualizacao otimista simples.

## 7. Padrao de services

Services devem concentrar integracoes externas. No estado atual, cada service de modulo chama `requireSupabase()`, executa a query e retorna tipos explicitos. Componentes nao devem montar queries Supabase.

## 8. Padrao de types

Tipos compartilhados ficam em `src/types`. Tipos especificos de formulario e draft ficam no modulo. `src/types/database.ts` contem tipos manuais alinhados as migrations e tambem tipa o client Supabase. No futuro, esses tipos devem ser substituidos ou reconciliados com types oficiais gerados pelo Supabase CLI.

## 9. Padrao de utils

Utils devem ser puras, pequenas e sem dependencia de React. Ja existem `date`, `format`, `errors` e `cn`. Regras de negocio complexas devem migrar para utils testaveis.

## 10. Estrategia atual de navegacao

A navegacao atual e manual, baseada em `activeRoute` no `UiStoreProvider`. `BottomNav` altera a rota ativa, e `renderRoute` escolhe a tela. Isso e suficiente para o app mobile-first inicial, mas nao cria URLs por modulo.

## 11. Decisao sobre React Router

Nao migrar imediatamente. React Router deve ser considerado quando o app precisar de:

- URLs compartilhaveis.
- Deep links por modulo.
- estados de rota mais complexos.
- rotas protegidas por layout.

Enquanto o escopo for um shell mobile com poucas abas, a navegacao manual e aceitavel.

## 12. Estrategia futura para TanStack Query

Adicionar TanStack Query antes de ampliar CRUD e sincronizacao. Ele deve assumir cache, invalidacao, retry, stale time e mutations. Os services existentes podem continuar como fonte das funcoes de fetch/mutation.

## 13. Estrategia futura para React Hook Form e Zod

Adicionar React Hook Form e Zod antes de formularios mais complexos. Formularios atuais usam `useState`, o que esta aceitavel no baseline, mas tende a repetir validacao e transformacao.

## 14. Separacao entre UI e regra de negocio

UI renderiza estados e dispara callbacks. Services persistem dados. Hooks orquestram carregamento e acoes. Utils fazem calculos puros. Validacoes futuras devem ficar em schemas Zod, nao espalhadas no JSX.

## 15. Limite de 300 linhas por arquivo

Nenhum arquivo atual passa de 300 linhas. Ao aproximar de 250 linhas, avaliar divisao em componentes, hooks ou utils menores.

## 16. Regras para evitar duplicacao

- Reaproveitar `FieldShell`, `Button`, `Surface`, `StateView`, `MetricTile`.
- Extrair helpers comuns de forms quando repetidos em 3 modulos.
- Padronizar hooks de CRUD depois que TanStack Query entrar.
- Nao criar abstra cao antes de haver repeticao real.

## 17. Camada Supabase

O client Supabase fica isolado em `src/services/supabase/client.ts`. Env fica em `src/config/env.ts`. Services de dominio chamam `requireSupabase()` e nao devem expor queries para componentes visuais. Helpers puros de erro ficam em `src/services/supabase/errors.ts`.

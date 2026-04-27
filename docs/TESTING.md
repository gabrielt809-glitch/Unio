# Testing

## 1. Estado atual dos testes

O projeto usa Vitest com ambiente `jsdom`, Testing Library e matchers do `@testing-library/jest-dom`.

Scripts disponiveis:

```bash
npm run test
npm run test:watch
```

## 2. Estrutura de testes

Testes ficam proximos do codigo testado quando forem pequenos e diretos:

- `src/app/App.test.tsx`
- `src/components/Button.test.tsx`
- `src/utils/format.test.ts`

Setup global:

- `src/test/setup.ts`

## 3. Padrao de nome de arquivos

Usar:

- `*.test.ts` para utils e funcoes puras.
- `*.test.tsx` para componentes React.

## 4. O que ja esta coberto

- Smoke test do `App` no estado de configuracao Supabase.
- `AuthGate` sem sessao, com sessao mockada, modo de reset e conteudo protegido.
- Schemas de Auth para login, cadastro, magic link, recuperacao e reset.
- Services de Auth com mocks para magic link, login com senha, cadastro, recuperacao, reset, logout e `ensure_user_foundation`.
- Renderizacao e interacao basica do `Button`.
- Utils puras de moeda, tempo e clamp.
- Client Supabase com `auth.getSession()` seguro.
- Env Supabase e fallback legado.
- Schemas, filtros, datas, service mockado e componentes principais de Tasks.

## 5. O que ainda precisa ser coberto

- Hooks de dominio alem de Tasks.
- Services com mocks do Supabase alem de Auth e Tasks.
- Fluxos de formularios dos modulos de dominio alem de Auth e Tasks.
- Estados de loading, erro e vazio por modulo.
- Validacoes futuras com Zod para tarefas, habitos, financas, saude e nutricao.
- Testes E2E depois do Supabase real.

## 6. Testes que nao devem ser automatizados sem cuidado

- Envio real de magic link.
- Criacao de usuario real.
- Insercao de dados persistentes em producao.
- Testes que dependem de email externo.

## 7. Calculos financeiros

Ja existe cobertura inicial para `parseCurrencyToCents`. Futuro: testar sumarios de receitas, despesas, saldo positivo, saldo negativo e arredondamentos.

## 8. Datas

Futuro: testar `toDateKey`, `getMonthKey` e filtros mensais.

## 9. Schemas futuros

Zod ja cobre o baseline de Auth e Tasks. Futuro: testar schemas de habitos, transacoes, metricas diarias e refeicoes.

## 10. Auth

Os testes de Auth nao criam usuario real, nao enviam email real e nao dependem de internet. Eles usam mocks para confirmar:

- Submit de login com senha.
- Submit de cadastro.
- Envio mockado de magic link.
- Envio mockado de recuperacao.
- Reset de senha em modo de recuperacao.
- Logout via service.
- Chamada de `ensure_user_foundation` apos sessao valida.

Fluxos reais de email, confirmacao e recuperacao devem ser validados manualmente com conta de teste.

## 11. Tasks

Os testes de Tasks nao criam dados reais e nao dependem de Supabase real. Eles cobrem:

- Schema de tarefa com titulo obrigatorio.
- Tarefa com data opcional.
- Filtros Hoje, Proximas, Sem data, Concluidas e Todas.
- Garantia de que tarefa sem data nao aparece em Hoje.
- Formatacao de data por chave local.
- Service com mocks para listar, criar, editar, concluir, reabrir e excluir.
- Componentes `TaskFilterTabs` e `TaskCard`.

CRUD real deve ser validado manualmente com conta de teste apos aplicar a migration de hardening de tasks.

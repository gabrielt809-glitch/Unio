# Supabase

## 1. Estrutura atual

O app usa `@supabase/supabase-js` em `src/services/supabase/client.ts`. A configuracao vem de `src/config/env.ts`, lendo `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.

O client esta tipado com `Database` de `src/types/database.ts`. Esses tipos sao manuais e coerentes com as migrations atuais, mas ainda nao substituem os types oficiais gerados pelo Supabase CLI.

## 2. Migrations existentes

- `20260426120000_initial_schema.sql`: cria `spaces` e tabelas de dominio iniciais.
- `20260426133000_user_foundation.sql`: adiciona `profiles`, `user_preferences`, bootstrap de usuario e espaco pessoal.
- `20260426201000_harden_user_foundation.sql`: reforca a RPC `ensure_user_foundation` para impedir uso autenticado em outro usuario e restringe execucao a usuarios autenticados.

## 3. Tabelas existentes

- `spaces`
- `profiles`
- `user_preferences`
- `tasks`
- `habits`
- `habit_logs`
- `daily_metrics`
- `finance_transactions`
- `meal_logs`

## 4. user_id e owner

As tabelas com dados do usuario usam `user_id` referenciando `auth.users(id)`. `spaces` ainda usa `user_id` como dono do espaco pessoal. Um futuro modelo de compartilhamento pode introduzir membros/roles sem alterar o baseline pessoal.

## 5. space_id

Tabelas de dominio possuem `space_id`. `user_preferences` tambem usa `space_id`, permitindo preferencias por espaco. `profiles` nao usa `space_id` porque e um registro global do usuario.

## 6. created_at, updated_at e updated_at automatico

Todas as tabelas criadas nas migrations possuem `created_at` e `updated_at`. A funcao `public.set_updated_at()` atualiza `updated_at` via triggers.

## 7. RLS e policies

RLS esta ativado em todas as tabelas com dados do usuario. As policies atuais permitem acesso apenas quando `user_id = auth.uid()`. Inserts e updates de tabelas com `space_id` validam que o espaco pertence ao usuario autenticado.

## 8. Bootstrap de usuario

A migration `20260426133000_user_foundation.sql` cria:

- `public.ensure_user_foundation(target_user_id, target_email)`
- `public.handle_new_user()`
- trigger `on_auth_user_created` em `auth.users`

Esse fluxo prepara `profiles`, espaco pessoal `Pessoal` e `user_preferences` para novos usuarios. O app ainda mantem `ensurePersonalSpace` no frontend como fallback operacional.

Na Etapa 5, o frontend tambem passou a chamar `ensure_user_foundation` apos login com senha, cadastro com sessao imediata e reset de senha com sessao valida. A chamada fica em `src/modules/auth/services/userFoundationService.ts` e nao e feita diretamente por componentes visuais.

## 9. Configurar .env local

Criar `.env.local` na raiz:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Usar apenas valores publicos. Nunca colocar service role key, secret key ou senha no frontend. `VITE_SUPABASE_ANON_KEY` ainda e aceito temporariamente como fallback legado, mas o padrao novo e `VITE_SUPABASE_PUBLISHABLE_KEY`.

## 10. Criar projeto no Supabase

1. Criar projeto no painel Supabase.
2. Copiar Project URL para `VITE_SUPABASE_URL`.
3. Copiar publishable key para `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. Configurar Auth email/magic link e URL do app.

## 11. Aplicar migrations

Com Supabase CLI instalada e projeto linkado:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

Sem CLI, executar os arquivos SQL em ordem no SQL Editor do Supabase:

1. Abrir o painel do projeto Supabase.
2. Ir em SQL Editor.
3. Criar uma query nova.
4. Copiar o conteudo de `supabase/migrations/20260426120000_initial_schema.sql`.
5. Executar e confirmar ausencia de erro.
6. Criar outra query.
7. Copiar o conteudo de `supabase/migrations/20260426133000_user_foundation.sql`.
8. Executar e confirmar ausencia de erro.
9. Criar outra query.
10. Copiar o conteudo de `supabase/migrations/20260426201000_harden_user_foundation.sql`.
11. Executar e confirmar ausencia de erro.
12. Conferir tabelas, RLS e policies no Table Editor/Auth Policies.

Nao executar SQL remoto automaticamente por scripts locais nesta etapa. A aplicacao das migrations em producao deve ser feita conscientemente pelo painel ou por CLI autenticada pelo usuario.

## 12. Gerar types oficiais futuramente

A CLI `supabase` nao esta disponivel no ambiente atual, entao os types oficiais nao foram gerados nesta etapa.

Quando houver CLI, login e project ref:

```bash
supabase gen types typescript --project-id <project-id> > src/types/supabase.ts
```

Depois disso, trocar ou reconciliar `src/types/database.ts` com o arquivo gerado.

## 13. Validar RLS

Checklist minimo:

- Entrar com usuario real.
- Confirmar `profiles`, `spaces` e `user_preferences`.
- Criar registros em tarefas, habitos, financas e saude.
- Confirmar que todos possuem `user_id` e `space_id` corretos.
- Testar que outro usuario nao consegue ler dados alheios.

## 14. Fluxos de Auth da Etapa 5

O modulo `src/modules/auth/` agora cobre:

- Login com email e senha via `signInWithPassword`.
- Cadastro com email, senha e nome via `signUpWithPassword`.
- Magic link via `signInWithOtp`, mantendo o fluxo existente.
- Recuperacao de senha via `resetPasswordForEmail`.
- Reset de senha via `updateUser`.
- Logout via `signOut`.
- Sessao persistida com `persistSession`, `autoRefreshToken` e `detectSessionInUrl`.

Redirects esperados no Supabase Auth:

- Site URL: `https://unio.vercel.app`
- Redirect URL de producao: `https://unio.vercel.app/**`
- Redirect URL local: `http://localhost:5173/**`

O helper `getAuthRedirectUrl` normaliza `127.0.0.1:5173` para `localhost:5173`, evitando divergencia com a redirect URL local recomendada.

## 15. Antes de confiar em CRUD real

- `.env` real configurado localmente.
- Migrations aplicadas.
- Login por senha, cadastro, magic link, recuperacao e reset validados manualmente com conta de teste.
- RLS testado com ao menos dois usuarios.
- Types oficiais gerados ou divergencias manuais revisadas.
- Nenhuma secret administrativa no frontend.

## 16. Status local da Etapa 3.5B

- `.env.local` existe localmente e usa `VITE_SUPABASE_URL` com `VITE_SUPABASE_PUBLISHABLE_KEY`.
- As migrations foram aplicadas manualmente no painel Supabase.
- As URLs de autenticacao foram configuradas manualmente no painel Supabase.
- O client local foi validado com `auth.getSession()` sem criar usuario e sem inserir dados.
- O servidor Vite local iniciou com sucesso e respondeu a raiz do app.

Proxima etapa recomendada: validar um fluxo real de autenticacao no navegador e, depois, testar CRUD com dados controlados.

## 17. Validacao controlada da Etapa 3.5C

Validado automaticamente, sem sessao real e sem inserir dados:

- `auth.getSession()` funciona e retorna ausencia de sessao sem erro.
- As tabelas `spaces`, `profiles`, `user_preferences`, `tasks`, `habits`, `habit_logs`, `daily_metrics`, `finance_transactions` e `meal_logs` existem.
- Consultas anonimas com publishable key retornaram zero linhas nas tabelas protegidas.
- Nenhum dado foi criado, alterado ou removido.

Isso confirma que o client consegue acessar o projeto e que RLS nao expos dados para uma sessao anonima.

## 18. Teste manual de Auth e sessao real

Nao enviar magic link automaticamente. Para validar manualmente:

1. Rodar `npm run dev`.
2. Abrir `http://127.0.0.1:5173/`.
3. Criar uma conta de teste com email e senha temporaria.
4. Confirmar o email se o projeto Supabase exigir confirmacao.
5. Entrar com email e senha.
6. Recarregar a pagina e confirmar que a sessao permanece.
7. Usar Ajustes para sair.
8. Solicitar recuperacao de senha para a conta de teste.
9. Abrir o link recebido e definir nova senha.
10. Entrar novamente com a nova senha.
11. Testar magic link conscientemente, sem envio automatico.
12. Confirmar que a area interna aparece apos cada fluxo valido.

## 19. Teste manual de persistencia e limpeza

Depois do login real:

1. Criar uma tarefa com prefixo `TESTE UNIO -`.
2. Recarregar o app e confirmar que a tarefa permanece.
3. Marcar a tarefa como concluida e confirmar que o estado persiste.
4. Excluir a tarefa pela UI.
5. Recarregar e confirmar que ela nao aparece.
6. Repetir com um habito ou lancamento financeiro apenas se for necessario.

No painel Supabase, validar que registros criados possuem `user_id` e `space_id` esperados. Limpar qualquer dado de teste criado.

## 20. Teste manual de RLS com dois usuarios

1. Criar/logar com Usuario A.
2. Criar dado de teste com prefixo `TESTE UNIO - A`.
3. Fazer logout.
4. Criar/logar com Usuario B.
5. Confirmar que Usuario B nao ve dados do Usuario A.
6. Criar dado de teste do Usuario B.
7. Confirmar no painel que os `user_id` sao diferentes.
8. Excluir os dados de teste de ambos os usuarios.

## 21. ensure_user_foundation

Sem sessao real, a funcao nao foi chamada para criar dados. Validar manualmente apos login:

- `profiles` contem um registro para o usuario.
- `spaces` contem um espaco pessoal `Pessoal`.
- `user_preferences` contem preferencias para o par usuario/espaco.
- Repetir reload/login nao duplica os registros base.

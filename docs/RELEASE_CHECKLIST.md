# Release Checklist

## 1. Antes de enviar para GitHub

- Confirmar `.env`, `.env.local` e `.env.*.local` fora do commit.
- Confirmar `dist/`, `node_modules/`, `.npm-cache/`, `.vercel/`, caches locais, logs e erros ignorados.
- Confirmar que `.env.example` contem apenas nomes de variaveis e placeholders vazios.
- Procurar termos sensiveis antes do primeiro commit: `service_role`, `JWT_SECRET`, `DATABASE_PASSWORD`, `postgres://`, `PRIVATE_KEY`.
- Rodar format:check, lint, typecheck, test e build.
- Revisar arquivos grandes.
- Atualizar documentacao relevante.
- Nao configurar remote nem executar `git push` sem revisao final.

## 2. Antes de deploy na Vercel

- Build local aprovado.
- `vercel.json` revisado.
- Variaveis de ambiente configuradas.
- Supabase migration aplicada.
- Supabase Auth revisado com Site URL e Redirect URLs de producao/local.
- Em upload manual pelo GitHub, conferir se `.env.example` e `.gitignore` aparecem no repositorio.

## 3. Variaveis de ambiente

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Nunca configurar service role key, senha do banco, JWT secret ou private key no frontend.

## 4. Supabase

- Migrations aplicadas, incluindo `20260426201000_harden_user_foundation.sql` quando o Auth completo for publicado.
- RLS ativo.
- Policies testadas com usuario autenticado.
- Login por senha habilitado no Supabase Auth.
- Cadastro por email revisado conforme decisao de confirmacao de email.
- Magic link configurado com URL da Vercel.
- Recuperacao de senha configurada com redirect para o app.
- Site URL: `https://unio.vercel.app`
- Redirect URL: `https://unio.vercel.app/**`
- Redirect URL local: `http://localhost:5173/**`

## 5. PWA

- Manifest valido.
- `sw.js` servido com cache revalidavel.
- Icones carregam.
- `theme_color` correto.

## 6. Testes

- Rodar `npm run test`.
- Ampliar cobertura quando novas regras de negocio forem criadas.
- Futuro: testes E2E.

## 7. Auth em producao

- Cadastrar conta de teste.
- Confirmar email se a configuracao exigir.
- Entrar com email e senha.
- Recarregar e confirmar sessao persistida.
- Fazer logout.
- Solicitar recuperacao de senha.
- Abrir link de recuperacao e definir nova senha.
- Testar magic link manualmente.
- Confirmar `profiles`, `spaces` e `user_preferences` no painel Supabase.
- Remover dados de teste quando terminar.

## 8. Versao

- Atualizar `package.json` quando houver release formal.
- Registrar mudancas em `CHANGELOG.md` quando criado.

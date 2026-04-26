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

## 3. Variaveis de ambiente

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Nunca configurar service role key, senha do banco, JWT secret ou private key no frontend.

## 4. Supabase

- Migration aplicada.
- RLS ativo.
- Policies testadas com usuario autenticado.
- Magic link configurado com URL da Vercel.

## 5. PWA

- Manifest valido.
- `sw.js` servido com cache revalidavel.
- Icones carregam.
- `theme_color` correto.

## 6. Testes

- Rodar `npm run test`.
- Ampliar cobertura quando novas regras de negocio forem criadas.
- Futuro: testes E2E.

## 7. Versao

- Atualizar `package.json` quando houver release formal.
- Registrar mudancas em `CHANGELOG.md` quando criado.

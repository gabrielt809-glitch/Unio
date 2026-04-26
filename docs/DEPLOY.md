# Deploy

## 1. Rodar localmente

```bash
npm install
npm run dev
```

URL local padrao:

```text
http://127.0.0.1:5173/
```

## 2. Configurar .env.local

Criar `.env.local` na raiz:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Nao usar service role key, secret key ou senha no frontend.

## 3. Fazer build

```bash
npm run build
```

O build gera `dist/`.

## 4. Publicar na Vercel

- Enviar ao GitHub apenas arquivos versionaveis do projeto.
- Nao commitar `.env.local`, `node_modules/`, `dist/`, `.npm-cache/`, `.vercel/`, logs ou caches locais.
- Importar o repositorio no dashboard da Vercel.
- Framework preset: Vite.
- Build command: `npm run build`.
- Output directory: `dist`.

## 5. Variaveis na Vercel

Configurar:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Depois redeployar.

As variaveis devem ser configuradas no painel da Vercel. Nao copiar `.env.local` para o repositorio.

## 6. Validar rotas

O `vercel.json` reescreve rotas para `index.html`, preservando assets de PWA. Validar refresh da raiz e assets:

- `/`
- `/manifest.webmanifest`
- `/sw.js`
- `/favicon.svg`

## 7. Validar PWA

- Abrir app publicado.
- Conferir manifest no DevTools.
- Conferir service worker em producao.
- Testar instalacao.

## 8. Status local validado

Na Etapa 3.5B, o ambiente local foi validado com `.env.local`, publishable key, migrations aplicadas manualmente no painel Supabase e URLs de autenticacao configuradas manualmente. Nenhuma secret administrativa deve ser usada na Vercel.

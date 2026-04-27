# Quality

## 1. Criterios de qualidade do Unio

O Unio deve parecer produto real, nao prototipo. Cada entrega precisa preservar build limpo, tipagem estrita, UX mobile-first, PWA funcional, Supabase seguro, codigo modular e testes automatizados quando houver superficie critica.

## 2. Checklist obrigatorio antes de cada etapa

- Confirmar que o trabalho ocorre em `C:\Users\gabri\Desktop\Unio`.
- Revisar arquivos existentes antes de editar.
- Evitar arquivos acima de 300 linhas.
- Evitar dependencias sem justificativa.
- Rodar `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test` e `npm run build` quando aplicavel.
- Revisar estados de loading, erro, vazio e sucesso quando houver UI.

## 3. Criterios de aceite

- Sem erro de formatacao.
- Sem erro de TypeScript.
- Sem erro de build.
- Sem erro de lint.
- Sem teste quebrado.
- Sem console error em fluxo validado.
- Sem scroll horizontal indevido.
- Sem elementos sobrepostos.
- Acoes destrutivas com confirmacao.

## 4. Regras para Prettier

Prettier esta configurado em `prettier.config.js`.

Comandos:

```bash
npm run format
npm run format:check
```

Arquivos de build, cache, logs, `.env` e `package-lock.json` ficam fora da formatacao via `.prettierignore`. Prettier cobre TypeScript, React, CSS, JSON e Markdown. Ordenacao automatica de classes Tailwind nao foi adicionada para evitar dependencia extra nesta etapa.

## 5. Regras para lint

`npm run lint` usa ESLint flat config com TypeScript, React Hooks e React Refresh. `any` explicito e proibido. Regras desligadas hoje: `react-hooks/set-state-in-effect` e `react-refresh/only-export-components`.

## 6. Regras para typecheck

`npm run typecheck` executa `tsc -b`. O projeto usa `strict`, `noUnusedLocals`, `noUnusedParameters` e `noFallthroughCasesInSwitch`.

## 7. Regras para testes

`npm run test` executa Vitest em modo run. `npm run test:watch` inicia o modo interativo. Testes devem ser estaveis, pequenos e evitar texto volatil quando houver alternativa melhor.

## 8. Regras para build

`npm run build` executa `tsc -b && vite build`. Build deve completar sem erro. O output vai para `dist/`.

## 9. Regras para revisao visual

Validar mobile primeiro, depois desktop estreito e largo. Conferir contraste, hierarquia, toque confortavel, foco visivel, empty states e feedback de acoes.

Na Etapa 4, a tela de Auth foi validada em `320x568`, `390x844` e `768x900` via Chrome headless/CDP, sem scroll horizontal e sem console error/warning.

## 10. Regras para responsividade iPhone

- Usar `viewport-fit=cover`.
- Respeitar `env(safe-area-inset-*)`.
- Bottom navigation deve usar padding inferior com `var(--safe-bottom)`.
- Evitar conteudo atras do nav fixo.
- Containers de Auth devem limitar largura com `max-w-[calc(100vw-2rem)]`.

## 11. Regras para evitar layout quebrado

- Usar `min-w-0` em textos truncados dentro de flex.
- Evitar larguras fixas sem constraints.
- Nao deixar tabelas ou strings longas causarem overflow.
- Testar formularios com valores longos.
- Preferir `Badge`, `ProgressBar`, `Surface`, `Card` e `StateView` em vez de recriar classes visuais por modulo.

## 12. Regras para evitar UX amadora

- Nao usar textos explicativos em excesso dentro do app.
- Nao fingir que recurso esta pronto sem persistencia.
- Mostrar loading discreto e erro util.
- Preferir comandos claros e poucos toques.
- Manter visual dark premium sem efeitos decorativos exagerados.

## 13. Design system baseline

- Tokens globais ficam em `src/styles/tokens.css`, `theme.css`, `animations.css`, `globals.css` e `tokens.ts`.
- Componentes base ficam em `src/components`.
- Novos modulos devem reutilizar `Screen`, `PageContainer`, `SectionHeader`, `Surface` e estados padronizados.
- Componentes novos precisam ter API pequena, acessivel e teste quando virarem superficie compartilhada.

## 14. Visual QA Gate

Toda etapa futura so pode ser aprovada se passar tambem no Visual QA Gate. O gate cobre:

- Viewports obrigatorias: `320x568`, `375x667`, `390x844`, `430x932` e `768x900`.
- Auth, shell autenticado, Dashboard, Tarefas, Habitos, Financas, Saude, Ajustes e agrupamento Mais quando houver.
- Ausencia de scroll horizontal indevido em `html` e `body`.
- Ausencia de inputs, selects, textareas, cards, botoes, dialogs e containers extrapolando a viewport.
- Safe-area correta no topo e rodape.
- `BottomNav` sem cobrir conteudo acionavel.
- `TopBar` sem sobrepor conteudo.
- Estados vazios, loading e erro visualmente consistentes.
- Area de toque confortavel e foco visivel.
- Aparencia dark premium preservada.

Comandos:

```bash
npm run test:visual
```

O teste visual usa Playwright nos viewports obrigatorios. Ele valida a tela real de Auth e um harness visual local controlado para telas internas sem depender de usuario real, dados reais ou rede Supabase.

## 15. Bloco obrigatório para próximas etapas

"Antes de aprovar esta etapa, execute o Visual QA Gate em todos os viewports obrigatórios. Se qualquer elemento extrapolar a tela, gerar scroll horizontal indevido, quebrar container, sobrepor outro elemento ou prejudicar a experiência mobile, a etapa deve ser marcada como Reprovada e o problema deve ser corrigido antes do relatório final."

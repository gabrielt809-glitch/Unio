# Design System

## 1. Paleta oficial

- Background: `#08090D`
- Surface: `#11131A`
- Surface Elevated: `#181B24`
- Primary: `#7C5CFF`
- Accent: `#38BDF8`
- Text Primary: `#F8FAFC`
- Text Secondary: `#94A3B8`
- Success: `#22C55E`
- Warning: `#F59E0B`
- Danger: `#EF4444`

## 2. Tipografia

Fonte oficial: Inter. O app importa Inter no CSS global e expande `fontFamily.sans` no Tailwind. Usar peso 600/700 para hierarquia funcional e evitar escala hero dentro de paineis compactos.

## 3. Tokens visuais

Tokens CSS foram separados em:

- `src/styles/tokens.css`: cores, bordas, radius, sombras, espacamentos, transicoes e safe-area.
- `src/styles/theme.css`: tema dark premium e background base.
- `src/styles/animations.css`: animacoes discretas reutilizaveis.
- `src/styles/globals.css`: resets, foco visivel, overflow horizontal e utilitarios safe-area.
- `src/styles/tokens.ts`: tokens compartilhaveis em TypeScript.

## 4. Espacamentos

Interfaces compactas devem priorizar `gap-3`, `gap-4`, `p-3`, `p-4` e `p-5`. Containers principais usam `PageContainer` com `max-w-2xl`. Telas de entrada usam limite responsivo com `max-w-[calc(100vw-2rem)]`.

## 5. Radius

- `rounded-app`: 8px, padrao para controles.
- `rounded-panel`: 12px, padrao para superficies.
- `rounded-shell`: 16px, reservado para blocos maiores.

## 6. Sombras

- `shadow-panel`: profundidade discreta para superficies.
- `shadow-glow`: destaque controlado para paineis importantes.
- `shadow-accent`: realce leve para estados ativos.

## 7. Componentes base existentes

- `Button`
- `IconButton`
- `Input`, `Textarea`, `Select`
- `FieldShell`
- `Surface`
- `Card`
- `Badge`
- `Chip`
- `ProgressBar`
- `Divider`
- `Skeleton` e `SkeletonStack`
- `EmptyState`, `LoadingState`, `ErrorState` via `StateView`
- `ConfirmDialog`
- `MetricTile`
- `PageContainer`, `PageHeader`, `SafeArea`, `Screen`
- `SectionHeader`

## 8. Componentes ainda desejados

- `Tabs`
- `SegmentedControl`
- `Switch`
- `Slider`
- `Toast`
- `BottomSheet`
- `Drawer`
- `FormError`

Criar apenas quando houver uso real na etapa ou modulo seguinte.

## 9. Regras de uso de cards

Cards devem representar itens repetidos, modais ou ferramentas realmente enquadradas. Evitar cards dentro de cards. Secoes de pagina devem ser layouts livres ou superficies simples.

## 10. Regras de botoes

Usar `Button` para comandos textuais e `IconButton` para comandos compactos. Botoes devem ter area minima confortavel, estado disabled, foco visivel e `aria-label` quando forem apenas icone.

## 11. Regras de formularios

Todo campo deve estar dentro de `FieldShell` ou ter label acessivel equivalente. Inputs atuais sao dark, com borda sutil, foco em accent e `color-scheme: dark`.

## 12. Estados vazios/loading/erro

Usar `EmptyState`, `LoadingState` e `ErrorState` quando o estado for dedicado, ou `StateView` quando a tela precisar escolher dinamicamente. Loading deve ser discreto e erro deve orientar a proxima acao.

## 13. Navegacao mobile

`BottomNav` e fixa, usa icones `lucide-react`, respeita `safe-area-bottom` e tem area de toque confortavel. Labels devem continuar curtos.

## 14. Safe-area para iPhone

CSS global define `--safe-top`, `--safe-right`, `--safe-bottom`, `--safe-left` e utilitarios `safe-area-x`, `safe-area-top`, `safe-area-bottom`. Novos elementos fixos devem usar esses tokens.

## 15. Validacao visual da Etapa 4

Validado em ambiente local:

- Auth em viewport iPhone pequeno `320x568`: sem scroll horizontal.
- Auth em viewport iPhone moderno `390x844`: sem scroll horizontal.
- Auth em desktop estreito `768x900`: sem scroll horizontal.
- Console sem erros/warnings capturados na validacao visual.

## 16. Pontos de cuidado

- Evitar animacoes em telas criticas de autenticacao para nao capturar estados opacos.
- Evitar textos longos em badges no topo mobile.
- Revisar o shell autenticado com usuario real na proxima etapa manual de QA.

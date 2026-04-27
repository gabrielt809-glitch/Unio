# QA Checklist

## 1. Login/autenticacao

- Tela de configuracao aparece quando `.env` nao esta pronto.
- Client Supabase cria sessao local com `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
- `auth.getSession()` pode ser chamado localmente sem criar usuario e sem inserir dados.
- Migrations foram aplicadas manualmente no painel Supabase antes de validar CRUD real.
- URLs de autenticacao foram configuradas manualmente no painel Supabase.
- Login com email e senha funciona com conta de teste.
- Cadastro com email, senha e nome mostra sucesso ou aviso de confirmacao de email.
- Login por magic link envia email quando Supabase esta configurado.
- Envio de magic link deve ser feito manualmente pelo usuario durante QA.
- Recuperacao de senha envia email apenas apos acao manual do usuario.
- Link de recuperacao abre o app em modo de reset de senha.
- Reset de senha valida senha minima e confirmacao.
- Reload apos login mantem a sessao.
- Logout funciona em Ajustes com loading e tratamento de erro.
- Tela de Auth nao deve enviar magic link sem acao manual do usuario.
- Tela de Auth deve caber em 320px sem scroll horizontal.
- Usuario autenticado nao volta para login em reload comum.
- Usuario sem sessao nao acessa a area interna.

## 2. Navegacao

- Bottom nav troca entre Hoje, Tarefas, Habitos, Financas, Saude e Ajustes.
- Item ativo fica visualmente claro.
- Conteudo nao fica escondido atras do nav.

## 3. Dashboard

- Mostra data atual.
- Mostra resumo de tarefas, habitos, saldo e agua.
- Atalhos levam aos modulos corretos.

## 4. Tarefas

- Criar tarefa de teste com prefixo `TESTE UNIO -`.
- Criar tarefa sem data e confirmar que aparece apenas em Sem data/Todas.
- Criar tarefa com data de hoje e confirmar que aparece em Hoje.
- Criar tarefa futura e confirmar que aparece em Proximas.
- Confirmar que tarefa sem data nao aparece em Hoje.
- Editar titulo, descricao, data, prioridade e categoria.
- Marcar como concluida.
- Reabrir tarefa.
- Excluir com confirmacao.
- Recarregar e confirmar persistencia das criacoes/edicoes/conclusoes.
- Confirmar no Supabase que `user_id` e `space_id` foram preenchidos.
- Ver empty, loading e erro.

## 5. Habitos

- Criar habito.
- Registrar conclusao do dia.
- Remover registro do dia.
- Ver progresso.

## 6. Financas

- Criar receita.
- Criar despesa.
- Ver entradas, saidas e saldo.
- Excluir lancamento com confirmacao.

## 7. Agua

- Salvar agua em ml.
- Ver resumo no dashboard e saude.

## 8. Saude

- Salvar humor, energia, foco e calorias.
- Validar se numeros nao quebram layout.

## 9. Sono

- Salvar minutos de sono.
- Ver formatacao em horas/minutos.

## 10. Nutricao

- Criar refeicao.
- Ver calorias e proteina do dia.

## 11. Bem-estar

- Ainda nao ha modulo dedicado. Validar campos atuais de humor, energia e foco em Saude.

## 12. Configuracoes

- Ver usuario, user id e space id.
- Ver status de Supabase e PWA.
- Logout sem erro.

## 13. Responsividade iPhone

- Testar largura 320px, 375px, 390px e 430px.
- Testar tambem `768x900` para desktop estreito/tablet.
- Confirmar safe-area no topo e rodape.
- Confirmar ausencia de scroll horizontal.
- Confirmar que login, cadastro, magic link, recuperacao e reset nao geram overflow horizontal.
- Confirmar que filtros horizontais de Tarefas nao geram scroll horizontal na pagina.
- Confirmar que Auth, formularios e bottom nav nao cortam texto nem botoes.
- Confirmar que cards de metricas continuam legiveis em duas colunas.
- Confirmar que inputs de data, selects, textareas e botoes ficam dentro do container em Tarefas, Financas e Saude.
- Confirmar que dialogs respeitam `max-width` no iPhone.

## 14. PWA

- Manifest carregado.
- Service worker registrado em build/preview.
- App abre em modo standalone quando instalado.

## 15. Console

- Sem `console.error`.
- Sem warnings criticos.
- Sem requests 404 inesperadas para assets essenciais.
- Validacao visual automatizada da Etapa 4 deve permanecer sem console error/warning.

## 16. Build

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:visual`
- `npm run build`

## 17. RLS

- Sem sessao, tabelas protegidas nao retornam linhas.
- Com Usuario A, criar dado de teste e validar que Usuario B nao ve esse dado.
- Confirmar `user_id` e `space_id` no painel Supabase.
- Excluir todos os dados de teste.

## 18. ensure_user_foundation

- Apos primeiro login, verificar `profiles`.
- Verificar espaco pessoal `Pessoal` em `spaces`.
- Verificar `user_preferences`.
- Repetir login/reload e confirmar que nao duplica registros.

## 19. Visual QA Gate permanente

Executar em toda etapa futura:

```bash
npm run test:visual
```

Validar manualmente nos viewports `320x568`, `375x667`, `390x844`, `430x932` e `768x900` quando a etapa alterar UI, layout, formulario, nav, modal, estado vazio/loading/erro ou componente base.

Telas obrigatorias:

- Auth: login, cadastro, magic link, recuperacao e reset.
- Area logada: Dashboard, Tarefas, Habitos, Financas, Saude, Ajustes e agrupamento Mais quando existir.
- Tarefas: formulario de criacao/edicao, campo de data, filtros, cards, empty/loading/error e confirmacao de exclusao.
- Modulos secundarios: Agua, Sono, Nutricao e Bem-estar enquanto estiverem agrupados em Saude.

Reprovar a etapa se houver input extrapolando, scroll horizontal indevido, card saindo da tela, botao cortado, dialog quebrado, header/nav cobrindo conteudo ou qualquer tela com aparencia de prototipo.

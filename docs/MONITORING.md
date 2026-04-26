# Monitoring

## 1. Estrategia futura

Monitoramento deve entrar depois de Supabase real, testes e deploy. Priorizar erros de runtime, falhas de autenticacao, falhas de persistencia e performance inicial.

## 2. Possivel uso de Sentry

Sentry pode ser usado para erros frontend com source maps controlados. Antes disso, definir politica de privacidade e filtros de dados sensiveis.

## 3. Tratamento global de erros

Futuro:

- error boundary no shell.
- logging centralizado.
- mensagens amigaveis para usuario.
- captura de falhas em mutations.

## 4. O que nao implementar ainda

- Analytics detalhado.
- Gravacao de sessoes.
- Captura de payloads sensiveis.
- Monitoramento sem politica de privacidade.

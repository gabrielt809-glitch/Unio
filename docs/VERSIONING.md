# Versioning

## 1. Estrategia de versionamento

Usar Semantic Versioning quando o app tiver releases publicos:

- `MAJOR`: mudancas incompativeis.
- `MINOR`: novas funcionalidades.
- `PATCH`: correcoes.

## 2. Versao inicial

Versao atual em `package.json`: `1.0.0`. Enquanto o produto estiver em baseline interno, pode-se considerar `0.x` em release formal.

## 3. Registrar mudancas futuras

Cada etapa deve registrar:

- o que mudou.
- arquivos principais.
- validacoes executadas.
- riscos conhecidos.

## 4. CHANGELOG futuro

Criar `CHANGELOG.md` antes do primeiro release externo. Sugestao: formato "Keep a Changelog".

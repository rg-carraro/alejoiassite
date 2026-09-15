# Usar Codex no AleJoias Site

Este projeto já possui configuração e documentação compatíveis com o Codex. A pasta oficial é `C:\Users\rgcar\git\alejoiassite`; o repositório usa o branch `master` e é separado do aplicativo Python em `C:\Users\rgcar\git\alejoias`.

## O que o Codex deve ler

Na raiz do projeto, leia nesta ordem:

1. `AGENTS.md`.
2. `docs/PROJECT_CONTEXT.md`.
3. `docs/DESENVOLVIMENTO.md`.
4. A skill aplicável em `.agents/skills/`.
5. `docs/CATALOGO_E_ATENDIMENTO.md` para produtos, importações, promoções e histórico.

O contexto vigente e as decisões recentes nos documentos têm prioridade sobre anotações antigas.

## Ambiente necessário

- Windows com PowerShell.
- Node 24 LTS.
- pnpm 11.19.0.
- Dependências instaladas com o lockfile.
- Codex aberto na raiz do site.
- Microsoft Edge e Playwright do runtime Codex para os testes de navegador.

Instalação e validação:

```powershell
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

Para iniciar o modo local, use `iniciar-dev.bat` ou `iniciar-site.ps1`. O painel fica em `/admin`; os dados locais ficam em `.data` e não devem ser versionados.

## Runtime Codex no Windows

Os scripts do projeto localizam o runtime em:

```text
%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies
```

Se Node e pnpm não estiverem no PATH da sessão:

```powershell
$runtime = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies'
$env:Path = "$runtime\node\bin;$runtime\bin\fallback;$env:Path"
```

## Testes seguros

- Use banco isolado com `ALEJOIAS_DATA_DIR`; nunca rode testes administrativos contra `.data` da loja.
- Os testes usam dados fictícios e interceptam o WhatsApp; nenhum envio real deve ser feito.
- Para regressão administrativa: `node tests/admin-integration.cjs`.
- Para PDF e compartilhamento: `node tests/order-pdf.cjs` e `node tests/share-pdf.cjs`.
- Para Cloudflare: `pnpm build:cloudflare` e `pnpm test:cloudflare`.
- Não publique, altere DNS ou aplique migração remota apenas porque um build local passou.

## Dados privados e operação

Nunca enviar ao Git, ao Codex ou em logs: `.data`, banco SQLite, uploads, tokens, senha administrativa, contatos, PDFs de clientes e arquivos de migração real. Backup completo local é a cópia da pasta `.data` com o servidor parado; exportação JSON não substitui esse backup.

## Relação com o aplicativo Python

O site não deve importar módulos do app Python nem acessar o PostgreSQL dele diretamente. Uma integração futura precisa de API ou contrato de importação/exportação, identificador estável e decisão explícita sobre qual sistema é a fonte oficial dos produtos e preços.

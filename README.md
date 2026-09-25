# Ale Carraro — site da loja

Primeira versão desenvolvida e implantada: **v1.0.0**, em 25/09/2026.

- Loja: https://alejoias.com
- Painel: https://alejoias.com/admin
- [Entrega, validação e operação da versão 1.0.0](docs/RELEASE_V1.0.0.md)

Astro + TypeScript em Cloudflare Workers com D1. O site funciona independentemente deste computador. Catálogo, sacola, atendimento com PDF e painel administrativo implementados; pagamento online não implementado.

## Desenvolvimento local
Dê dois cliques em iniciar-dev.bat. Loja local: http://localhost:4321; painel: http://localhost:4321/admin. Mantenha o terminal aberto. Credenciais locais em .data não são as credenciais da produção. Nunca copiar o SQLite histórico sobre o banco remoto.

## Publicação
```powershell
pnpm check
pnpm build:cloudflare
pnpm exec wrangler deploy --config dist-cloudflare/server/wrangler.json
```
Validar o domínio após cada implantação. Push no Git e deploy são operações distintas; conferir o resultado do build integrado quando usado.

## Documentação
- [Contexto vigente](docs/PROJECT_CONTEXT.md)
- [Implantação e DNS](docs/CLOUDFLARE.md)
- [Desenvolvimento e dados](docs/DESENVOLVIMENTO.md)
- [Roteiro de testes](docs/ROTEIRO_TESTES.md)
- [Catálogo e atendimento](docs/CATALOGO_E_ATENDIMENTO.md)
- [Histórico de decisões](docs/DECISION_LOG.md)

Credenciais, contatos, banco e backups privados ficam fora do Git. A tag não substitui backup D1. Aplicativo Android e sistema de notas continuam independentes.

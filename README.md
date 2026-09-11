# AleJoias Site

Novo site oficial da AleJoias para catálogo de joias, sacola e pedidos pelo WhatsApp, com evolução futura para pagamento online.

## Desenvolvimento
- Pasta oficial: `C:\Users\rgcar\git\alejoiassite`.
- Repositório: https://github.com/rg-carraro/alejoiassite
- Branch inicial: `master`.
- Direção técnica aprovada: Astro + TypeScript, React onde necessário e Cloudflare como plataforma de hospedagem.
- Domínio: `alejoias.com`, já administrado na Cloudflare segundo o usuário. Deploy do novo site ainda não configurado.
- Estado: protótipo navegável com catálogo, detalhes, sacola e resumo WhatsApp implementado; dados demonstrativos.

## Documentação
- [Contexto atual](docs/PROJECT_CONTEXT.md)
- [Histórico de decisões](docs/DECISION_LOG.md)
- [Proposta técnica](docs/PROPOSTA_TECNICA.md)
- [Referências visuais](docs/REFERENCIAS_VISUAIS.md)

O aplicativo AleJoias Vendas SQLite Sync v2 é um projeto separado e deve permanecer preservado.

## Iniciar localmente
Consultar [estrutura e comandos](docs/DESENVOLVIMENTO.md).

A pasta anterior alejoiassite_old é apenas uma cópia de recuperação; desenvolver sempre no clone alejoiassite.

## Painel e execução local
Inicie com dois cliques em iniciar-dev.bat. Painel em /admin; senha inicial em .data/acesso-admin.txt. Cadastro, importação CSV/JSON, histórico e solicitações usam SQLite local. Consulte docs/DESENVOLVIMENTO.md para dados e cópias de segurança. Deploy Cloudflare segue pendente.

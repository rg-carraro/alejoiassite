# AleJoias Site

Catálogo de joias com sacola, solicitação pelo WhatsApp e painel administrativo local.

## Testar
1. Dê dois cliques em **iniciar-dev.bat**.
2. Loja: http://localhost:4321/ — Painel: http://localhost:4321/admin.
3. No primeiro acesso, veja a senha em `.data/acesso-admin.txt`; troque-a no painel.
4. Mantenha o terminal aberto; Ctrl+C encerra o servidor.

## Estado atual
Astro + TypeScript, servidor Node e SQLite local. Painel com cadastro, edição, upload, promoções, ativação/desativação, histórico e importação CSV/JSON. Solicitações preservam dados da cliente e itens; mensagem WhatsApp usa tabela de valores. Pagamento online e publicação Cloudflare ainda pendentes.

O banco, contatos, senha e fotos enviadas ficam em `.data`, fora do Git. Exportar o catálogo JSON não substitui backup completo. O aplicativo AleJoias Vendas SQLite Sync v2 permanece separado.

## Documentação
- [Contexto vigente](docs/PROJECT_CONTEXT.md)
- [Como executar e preservar os dados](docs/DESENVOLVIMENTO.md)
- [Roteiro de testes](docs/ROTEIRO_TESTES.md)
- [Catálogo, importação e atendimento](docs/CATALOGO_E_ATENDIMENTO.md)
- [Arquitetura](docs/PROPOSTA_TECNICA.md)
- [Referências visuais](docs/REFERENCIAS_VISUAIS.md)
- [Histórico de decisões](docs/DECISION_LOG.md)

Pasta oficial: `C:\Users\rgcar\git\alejoiassite`. Pasta `_old` apenas para recuperação. Repositório: https://github.com/rg-carraro/alejoiassite — branch `master`. Domínio previsto: `alejoias.com`, administrado na Cloudflare; site ainda não publicado.

# AleJoias Site

Catálogo de joias com sacola, solicitação em PDF pelo WhatsApp e painel administrativo.

## Testar
1. Dê dois cliques em **iniciar-dev.bat**.
2. Loja: http://localhost:4321/ — Painel: http://localhost:4321/admin.
3. No primeiro acesso, veja a senha em `.data/acesso-admin.txt`; troque-a no painel.
4. Mantenha o terminal aberto; Ctrl+C encerra o servidor.

## Estado atual
Astro + TypeScript. A publicação atual usa Node/SQLite neste PC via Cloudflare Tunnel. A versão gratuita com Workers/D1 está preparada e testada localmente, ainda sem substituir o túnel. Painel com cadastro, edição, fotos, promoções, histórico e importação CSV/JSON. Solicitações preservam dados e itens; o WhatsApp recebe somente o link privado do PDF. Pagamento online não está implementado.

O banco, contatos, senha e fotos enviadas ficam em `.data`, fora do Git. Exportar o catálogo JSON não substitui backup completo. O aplicativo AleJoias Vendas SQLite Sync v2 permanece separado.

## Documentação
- [Preparação da publicação gratuita](docs/PUBLICACAO_GRATUITA.md)
- [Contexto vigente](docs/PROJECT_CONTEXT.md)
- [Como executar e preservar os dados](docs/DESENVOLVIMENTO.md)
- [Roteiro de testes](docs/ROTEIRO_TESTES.md)
- [Catálogo, importação e atendimento](docs/CATALOGO_E_ATENDIMENTO.md)
- [Arquitetura](docs/PROPOSTA_TECNICA.md)
- [Referências visuais](docs/REFERENCIAS_VISUAIS.md)
- [Histórico de decisões](docs/DECISION_LOG.md)

Pasta oficial: `C:\Users\rgcar\git\alejoiassite`. Pasta `_old` apenas para recuperação. Repositório: https://github.com/rg-carraro/alejoiassite — branch `master`. Domínio: `alejoias.com`, administrado na Cloudflare; publicação atual depende do PC ligado.

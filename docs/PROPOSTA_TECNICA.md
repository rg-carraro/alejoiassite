# Arquitetura técnica — AleJoias Site

Atualizado em 11/09/2026. Substitui a proposta preliminar; o histórico permanece em DECISION_LOG.md.

## Implementação atual
Astro + TypeScript com adapter Node para execução local. Páginas são renderizadas no servidor e leem SQLite. Interações usam TypeScript no navegador; React ainda não foi necessário.

Fluxo do catálogo: painel autenticado → API → SQLite + histórico → páginas públicas.
Fluxo de atendimento: sacola → nome/telefone → validação de preços/disponibilidade no servidor → snapshot da solicitação → mensagem WhatsApp para revisão e envio manual.

Responsabilidades:
- src/server/store.ts: persistência, revisões, promoções, sessões e solicitações.
- src/server/importer.ts: prévia e aplicação transacional de CSV/JSON.
- src/data/catalog.ts: contrato e preços efetivos em centavos.
- src/data/order-message.ts: tabela de texto compartilhada entre mensagem e resumo.
- src/pages/api: interfaces autenticadas e endpoint público de solicitação.
- src/pages/admin e src/scripts/admin.ts: administração.
- src/scripts/shop.ts: sacola e consumo do catálogo.

Produtos desativados ficam no histórico, fora do catálogo. Disponibilidade é independente da publicação. Preço e situação são revalidados ao registrar a seleção. Contatos ficam no banco privado; Git versiona código e documentação.

## Publicação ainda pendente
Cloudflare é a direção aprovada, com domínio já administrado nela. O adapter Node/SQLite em disco não deve ser enviado como se fosse um projeto Workers pronto. Antes do deploy, configurar adapter e armazenamento compatíveis, planejar migração dos dados e fotos e validar autenticação e backup no ambiente hospedado. D1 e R2 foram considerados; não foram provisionados.

Nenhuma mudança de DNS foi feita. Custos devem ser reavaliados no momento da escolha, sem presumir custo total zero.

## Evolução posterior
Produtos reais e retorno dos testes primeiro. Checkout exige provedor definido, validação no servidor, notificações autenticadas e prevenção de processamento duplicado. Retorno do navegador não comprova pagamento. Integração com AleJoias Vendas depende de definição explícita e não modifica sua base SQLite Sync v2 automaticamente.

## Referências técnicas usadas no desenvolvimento
- https://docs.astro.build/en/concepts/islands/
- https://docs.astro.build/en/guides/on-demand-rendering/
- https://docs.astro.build/en/guides/integrations-guide/node/
- https://nodejs.org/api/sqlite.html

Para operação local, veja DESENVOLVIMENTO.md; para regras comerciais/importação, CATALOGO_E_ATENDIMENTO.md.

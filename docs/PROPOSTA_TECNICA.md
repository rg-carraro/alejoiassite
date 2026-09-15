# Arquitetura técnica — AleJoias Site

Atualizado em 15/09/2026. Substitui a proposta preliminar; o histórico permanece em DECISION_LOG.md.

## Dois modos de execução

O modo padrão mantém Node/SQLite e o build `dist/`, atualmente atendido pelo Tunnel. `scripts/cloudflare.mjs` define `ALEJOIAS_TARGET=cloudflare` somente no processo filho e gera `dist-cloudflare/`. O adaptador Cloudflare usa Workers + D1, sem R2/KV/Images. Esse modo foi testado localmente e ainda não está publicado.

`astro.config.mjs` seleciona os módulos de servidor por aliases: páginas usam `view-store` assíncrono; as rotas de API e fotos delegam aos handlers Node ou Cloudflare. Os módulos Node de filesystem, SQLite, PDFKit e Sharp não são necessários no Worker. `product-validation.ts` centraliza as regras comuns de cadastro. A importação Cloudflare mantém a mesma política de campos e usa operações D1 assíncronas.

No D1, uma revisão global do catálogo e uma verificação dentro de `DB.batch` impedem gravar lotes ou pedidos calculados sobre estado antigo. O lote reúne a validação da revisão, a gravação e o histórico em uma transação. A chave única do pedido permite recuperar a solicitação anterior quando duas requisições idênticas chegam juntas. A imagem fica no snapshot de cada item.

`pdf-client.ts` aceita PDF binário do Node ou snapshot JSON privado da nuvem. `pdf-render.ts` gera o documento com pdf-lib no navegador, preservando fotos e dados do registro. `auth-client.ts` deriva a senha com PBKDF2-SHA256/600 mil iterações para o modo Cloudflare; o servidor verifica SHA256 dessa prova e cria sessão D1. No modo Node a autenticação scrypt anterior é mantida. A prova derivada é credencial e não deve ser logada ou persistida no navegador.

`migrations/0001_store.sql` define tabelas, índices, controle de revisão e limite de fotos. `prepare-cloudflare-data.mjs` produz uma importação privada a partir de leitura consistente do SQLite. Procedimentos e limites: [PUBLICACAO_GRATUITA.md](PUBLICACAO_GRATUITA.md).

## Implementação Node preservada
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

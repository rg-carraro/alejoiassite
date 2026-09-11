# Proposta técnica — AleJoias Site

Data: 11/09/2026. Status: direção técnica aprovada pelo usuário em 11/09/2026; implementação ainda não iniciada. Detalhes de painel, banco e infraestrutura serão fechados durante o desenvolvimento.

## Caminho recomendado
- Site próprio com Astro e TypeScript; React somente nos componentes interativos que justificarem seu uso, como sacola e filtros.
- Páginas de categoria e produto com conteúdo em HTML, títulos e URLs próprios. Astro permite páginas pré-geradas e renderização sob demanda.
- Protótipo com catálogo demonstrativo em arquivo estruturado e imagens locais autorizadas. Alterações nesse modelo exigem nova publicação; não confundir com painel de gestão.
- Sacola local no navegador e mensagem de pedido pelo WhatsApp. O clique não confirma envio, venda ou reserva de estoque.
- Para operação com atualização frequente: painel autenticado, API e banco do site. Cloudflare Workers + D1 e R2 são candidatos, sujeitos ao fechamento dos requisitos e custos.
- Cloudflare como candidata à hospedagem sob a conta do usuário. Ter o domínio nela não obriga hospedar nela. Sites também foi considerado como fluxo de construção/publicação; nenhuma plataforma de publicação foi escolhida.
- Código e documentação versionados em Git e futuramente GitHub; banco e fotos de produção precisam de backup próprio.
- Aplicativo SQLite Sync v2 permanece independente.

## Evolução
1. Protótipo local: identidade, categorias, produtos de exemplo, sacola e WhatsApp.
2. Operação: forma de cadastro definida, dados reais, painel se necessário, disponibilidade, testes e publicação.
3. Checkout: selecionar provedor, validar preços e disponibilidade no servidor, persistir pedidos e confirmar pagamento por notificação autenticada do provedor, com prevenção de duplicidades. Retorno do navegador não comprova pagamento.

## Alternativa
Uma plataforma pronta de comércio eletrônico reduz a programação de gestão e checkout, mas traz mensalidade e restrições de personalização. Shopify permite incorporar produtos e checkout em site existente; avaliar somente se isso se alinhar à operação desejada. Não há provedor de pagamento escolhido.

## Custos
A Cloudflare documenta requisições de arquivos estáticos gratuitas e ilimitadas; processamento, banco e armazenamento têm limites e preços próprios. Não prometer custo total zero. Estimar após tamanho do catálogo e rotina de gestão.

## Questão principal pendente
O usuário quer cadastrar fotos, preços e disponibilidade por um painel próprio desde a primeira versão operacional, ou aceita inicialmente atualizar o catálogo junto com o desenvolvimento?

## Referências oficiais consultadas
- https://docs.astro.build/en/concepts/islands/
- https://docs.astro.build/en/guides/on-demand-rendering/
- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/d1/
- https://developers.cloudflare.com/use-cases/web-apps/store-data/
- https://www.shopify.com/buy-button


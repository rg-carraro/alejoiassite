# PROJECT_CONTEXT.md — Novo Site AleJoias

**Atualizado em:** 11/09/2026
**Status:** protótipo navegável implementado e validado; dados reais e publicação pendentes

## 1. Visão
Criar o novo site oficial da AleJoias: moderno, elegante, intuitivo e com excelente experiência no celular. A primeira versão será um catálogo com seleção de produtos, sacola e envio do pedido pelo WhatsApp. Pagamento diretamente no site é uma evolução futura.

## 2. Localização e continuidade
- Pasta atual confirmada pelo usuário: `C:\Users\rgcar\git\alejoiassite`.
- Nome anterior: `alejoias_site`. Não usar o caminho incorreto `alejoias\_site`.
- Repositório GitHub criado e sincronizado na master. O usuário clonou o repositório nesta pasta e preservou a pasta anterior como alejoiassite_old.
- Registrar decisões neste documento e manter o histórico em `docs/DECISION_LOG.md`.

## 3. Ecossistema e domínio
- AleJoias é a marca/negócio principal.
- Domínio escolhido: `alejoias.com`, mantido na Cloudflare.
- Registro documentado em 08/09/2026: ativo, expiração em 08/09/2027, renovação automática ativa e preço de renovação então exibido de US$ 10,46/ano. Dados históricos, não verificados novamente nesta sessão.
- Cloudflare aprovada como direção de hospedagem. Deploy e configuração definitiva de DNS ainda pendentes.
- AleJoias Vendas é um aplicativo auxiliar separado, cuja base oficial estável é SQLite Sync v2. Não alterar seu backend, schema, IDs ou funcionalidades para desenvolver o site.
- Reaproveitamento visual do aplicativo foi autorizado; integração de dados permanece pendente de definição explícita.

## 4. Referência anterior e identidade visual
- Site Wix informado pelo usuário: https://alejoiasninafiori.wixsite.com/alejoias
- O Wix será referência de identidade e conteúdo, sem impor a arquitetura do novo site.
- Logos locais do Wix localizados e amostras inspecionadas. Versões de referência copiadas para public/images/brand; seleção visual final pendente.
- Podem ser aproveitados ícones e pontos visuais do aplicativo AleJoias Vendas, adaptados à experiência web.
- Direção visual inicial aceita: fundo claro, detalhes discretos em dourado, fotos grandes, tipografia elegante e legível, navegação simples e prioridade ao celular.
- O visual poderá ser ajustado após avaliação do protótipo.
- Página inicial do Wix lida por HTTP em 11/09/2026 após falha do navegador. Conteúdo textual confirmado: categorias Anéis, Brincos, Colares e Pulseiras, links Sobre e Contato, produtos com preços e indicação de esgotado. Layout completo não inspecionado. Referência salva em docs/wix-reference.html.
- Informações comerciais antigas, incluindo materiais, garantia e consignação, precisam de validação antes de publicação.

## 5. Escopo inicial definido
- Catálogo de produtos com fotos, preços e detalhes.
- Seleção de peças e sacola para organizar o pedido.
- Envio do resumo do pedido pelo WhatsApp.
- Categorias iniciais informadas pelo usuário: brincos, pulseiras, anéis e colares.
- Categorias adicionais aprovadas: Conjuntos e Tornozeleiras. Coleções aprovadas: Novidades e Presentes. Não presumir produtos disponíveis nessas categorias.
- Compra e pagamento diretamente no site ficam para uma fase posterior.

## 6. Propostas de experiência ainda sujeitas a detalhamento
- Fluxo: início → catálogo → detalhes do produto → sacola → WhatsApp.
- Páginas: início, catálogo, produto, sacola, sobre e atendimento.
- Mensagem de WhatsApp com códigos dos produtos, variações, quantidades e resumo dos valores.
- Novidades e Presentes foram aprovadas como coleções transversais.
- Conjuntos e Tornozeleiras foram aprovadas para a estrutura do catálogo; popular conforme produtos reais.
- Abrir o WhatsApp não comprova envio da mensagem nem confirmação de venda. Definir o tratamento de pedidos antes de qualquer integração ou baixa de estoque.

## 7. Decisões pendentes
- Origem e organização dos produtos, códigos, fotos, preços e disponibilidade.
- Forma de cadastrar e atualizar o catálogo: rotina do usuário e necessidade de painel administrativo.
- Arquivos dos logos do Wix e seleção dos ícones/elementos do aplicativo.
- Variações, tamanhos, quantidades e regras de disponibilidade.
- Número de WhatsApp e formato final do resumo do pedido.
- Entrega, retirada, frete e confirmação de pedidos.
- Navegação final, filtros e conteúdo institucional atualizado.
- Detalhamento de banco/CMS e deploy; Astro + TypeScript e Cloudflare já aprovados.
- SEO, analytics e políticas de privacidade aplicáveis.
- Checkout e integração com o aplicativo em etapas futuras.

## 8. Princípios e próximos passos
Preferir baixo custo, desempenho, acessibilidade, segurança e manutenção simples. Não superdimensionar a solução nem escolher a tecnologia antes dos requisitos.

Próximos passos:
1. Localizar e revisar os ativos visuais do Wix e do aplicativo.
2. Definir a origem do catálogo e como será atualizado.
3. Fechar a navegação e preparar um protótipo visual com peças representativas.
4. Escolher tecnologia e hospedagem com base nas necessidades definidas.
5. Implementar, testar e preparar o repositório para GitHub.
6. Conectar o domínio somente na etapa de publicação, após definição do deploy.

Não alterar DNS ou publicar automaticamente. Não colocar credenciais no repositório.

## 9. Ativos locais e análise da referência — 11/09/2026
- Usuário forneceu `C:\Pessoal\AleJoias\Site` e autorizou usar suas imagens como exemplos.
- Inventário de 45 imagens nas pastas Inicio, Coleção, Looks, Natal, Sobre e raiz.
- Inspeção visual realizada de Inicio/logos.png (diamante coral em círculo e nome preto), Inicio/teste_logo1.jpg (assinatura manuscrita preta Ale Joias), Inicio/8688.jpg (colares em uso) e Inicio/8748.jpg (pulseira em fundo branco).
- Sugestão, ainda sem escolha final: logo manuscrito no cabeçalho e símbolo de diamante em espaços compactos. Preservar as versões originais.
- Fotos de produto e uso podem compor o protótipo. Muitas possuem 400–500 pixels; evitar ampliação em banners de largura total.
- Preços, disponibilidade e contatos do Wix são referências antigas, não dados comerciais aprovados para publicação.
- Fotografias autorizadas como exemplos não significam confirmação de estoque atual. Identificar dados demonstrativos no protótipo.
- Detalhes da análise em docs/REFERENCIAS_VISUAIS.md.

## 10. Discussão técnica — 11/09/2026
Proposta registrada em docs/PROPOSTA_TECNICA.md: Astro + TypeScript, interações com React quando justificadas, possível hospedagem Cloudflare e evolução de catálogo demonstrativo para painel/API/banco. A direção técnica foi posteriormente aprovada; a estrutura inicial foi criada. Próxima definição: rotina de cadastro e atualização dos produtos.

## 11. Decisões vigentes — GitHub e desenvolvimento
Em 11/09/2026, o usuário aprovou a direção técnica descrita em PROPOSTA_TECNICA.md (Astro + TypeScript, React quando necessário e Cloudflare). Esta aprovação substitui o status anterior de recomendação em discussão. O detalhamento do painel e infraestrutura permanece aberto.

Repositório oficial: https://github.com/rg-carraro/alejoiassite.git. Branch solicitada: master. Pasta permanente: C:\Users\rgcar\git\alejoiassite. Commit e push iniciais autorizados. Domínio alejoias.com confirmado pelo usuário na Cloudflare; nenhum deploy do novo site ou alteração de DNS foi realizado nesta sessão.

## Estado após preparação da estrutura
- Clone ativo em C:\Users\rgcar\git\alejoiassite; pasta antiga alejoiassite_old mantida para recuperação, sem alterações.
- Base Astro + TypeScript com páginas, layouts, componentes, estilos, dados e tipos.
- React será acrescentado quando houver componente interativo que o justifique.
- Logos e duas fotos de exemplo copiados para o repositório, com origem documentada.
- Página inicial apenas de verificação da estrutura, com noindex; não é o protótipo visual completo.
- Sem deploy, alteração de DNS, checkout, painel ou integração com o app.
- Próximo trabalho: catálogo demonstrativo, detalhes do produto, sacola e fluxo WhatsApp, com revisão visual mobile.

## Protótipo navegável — 11/09/2026
- Implementados início, catálogo com busca/filtros/ordenação, três páginas de produto, sacola persistente, sobre e atendimento.
- Categorias e coleções aprovadas disponíveis; categorias sem amostras mostram estado vazio.
- Fotos de exemplo: anel entrelaçado, pulseira coração e composição de colares. Sem preços ou estoque inventados; valores sob consulta.
- Usuário confirmou WhatsApp 5519988038395. Link abre mensagem para revisão/envio manual; nenhum pedido foi enviado nos testes.
- Sacola: quantidade, remoção, persistência no navegador, resumo copiável e link WhatsApp.
- Implementação usa Astro e TypeScript; não houve necessidade de React nesta etapa.
- Painel, banco, pagamento online, integração com o aplicativo e deploy permanecem fora desta etapa de protótipo.
- Testes de navegador aprovados: filtros, estado vazio, detalhes, quantidades, persistência após recarga, remoção, resumo WhatsApp e seis rotas no celular sem rolagem horizontal ou erros JavaScript.
- WebMCP opcional de leitura da sacola com detecção de suporte; validação em contexto WebMCP real indisponível.
- Criado iniciar-site.ps1 para configurar Node/pnpm do runtime local na sessão e iniciar o servidor.

## Preços demonstrativos — 11/09/2026
Usuário solicitou R$ 0,10 nas peças para visualizar valores. Três produtos agora têm priceInCents=10; catálogo, detalhes, sacola e resumo WhatsApp exibem preços demonstrativos. Subtotal calculado em centavos conforme quantidades; preços reais seguem pendentes.

## Skills e gestão de catálogo — 11/09/2026
Skills locais de manutenção técnica e catálogo salvas em .agents/skills e referenciadas por AGENTS.md. Usuário definiu importação automática de lista, campos editáveis, promoções, disponibilidade, habilitar/desabilitar sem excluir e histórico. Requisitos em docs/CATALOGO_E_ATENDIMENTO.md; painel/banco/importador ainda pendentes. Sacola agora exige nome e telefone para abrir WhatsApp e inclui identificação no resumo, sem armazenar esses dados em cadastro central.

## Painel local e inicializador — atualização vigente
- Painel /admin concluído: cadastro/edição, fotos, preços e promoções com período, tags, disponibilidade e habilitar/desabilitar.
- SQLite exclusivo do site em .data; histórico de alterações preservado. Arquivo de senha inicial privado em .data/acesso-admin.txt; troca disponível no painel.
- Catálogo público lê o banco e oculta desativados. Importação CSV/JSON tem prévia, transação, conciliação por código e preservação padrão dos registros existentes.
- Sacola registra nome, telefone e snapshot da seleção antes de abrir WhatsApp, com validação de preço/disponibilidade no servidor e prevenção de repetição. Solicitações acessíveis no painel.
- Script iniciar-dev.bat solicitado pelo usuário permite iniciar o ambiente com dois cliques. iniciar-site.ps1 compartilha o mesmo bootstrap.
- Runtime local Node + SQLite implementado para testes. Deploy Cloudflare/D1 e checkout seguem pendentes; não há alteração do domínio nem do aplicativo Android.
- Testes de integração passaram em banco isolado; checagem TypeScript e build de servidor concluídos. Documentação operacional em docs/DESENVOLVIMENTO.md e docs/CATALOGO_E_ATENDIMENTO.md.

## Resumo WhatsApp em tabela
A pedido do usuário, itens numerados com nome, código e opção são acompanhados de tabela monoespaçada com Item, Qtd, Unit. e Total em reais. Formatação compartilhada entre resumo copiável e mensagem gerada no servidor; nomes não são truncados. Solicitações antigas preservam o snapshot original.

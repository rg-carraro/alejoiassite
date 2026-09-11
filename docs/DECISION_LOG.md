# Histórico de decisões — AleJoias Site

## 11/09/2026 — Idealização e primeira versão

### Decisões do usuário
- Criar site moderno, elegante e intuitivo para clientes consultarem peças e fazerem pedidos via WhatsApp.
- Evoluir futuramente para compra e pagamento diretamente no site.
- Manter categorias do antigo Wix: brincos, pulseiras, anéis e colares; considerar outras quando aplicáveis.
- Aceitar como ponto de partida fundo claro, detalhes discretos em dourado, fotos grandes e tipografia elegante, permitindo ajustes posteriores.
- Reutilizar logos usados no Wix e considerar ícones e elementos visuais do aplicativo existente.
- Renomear a pasta para `C:\Users\rgcar\git\alejoiassite`.
- Levar o projeto ao GitHub quando houver uma base inicial.
- Documentar continuamente as conversas e decisões para facilitar retomadas.

### Sugestões apresentadas, ainda não especificadas em detalhe
- Jornada com catálogo, página do produto, sacola e resumo enviado pelo WhatsApp.
- Páginas de início, sobre e atendimento.
- Coleções Novidades e Presentes; categorias Conjuntos e Tornozeleiras se fizerem sentido para o catálogo.
- Definir administração dos produtos antes de escolher tecnologia.
- Prototipar com peças representativas antes da implementação completa.

### Evidências e pendências
- Contexto e skill locais lidos; pasta renomeada localizada.
- URL do Wix: https://alejoiasninafiori.wixsite.com/alejoias
- Consulta ao Wix falhou nesta sessão; logos e imagens não foram visualmente inspecionados nem extraídos.
- Nenhuma implementação, publicação, configuração de DNS ou integração com o aplicativo foi realizada.
- Permanecem abertas a origem dos dados do catálogo, a gestão dos produtos, os ativos visuais, a tecnologia e a hospedagem.

## 11/09/2026 — Categorias aprovadas e imagens de referência
- Usuário aprovou acrescentar Conjuntos e Tornozeleiras e as coleções Novidades e Presentes.
- Forneceu a pasta C:\Pessoal\AleJoias\Site para uso das imagens como exemplos.
- Página inicial do Wix recuperada por HTTP (200), com menus, catálogo, preços, itens esgotados e contato. Isso resolve a pendência de leitura textual registrada antes; inspeção visual completa do site continua pendente.
- Dois logos e duas fotos locais inspecionados visualmente. Sugestão de logo manuscrito para cabeçalho ainda não é decisão final.
- Documentado uso demonstrativo das imagens e necessidade de validar os dados comerciais antes de publicar.

## 11/09/2026 — Discussão técnica
- Apresentada recomendação de Astro + TypeScript, com React para interações quando necessário; Cloudflare como candidata à hospedagem.
- Diferenciados protótipo com dados em arquivo e operação com painel/API/banco.
- Registrada alternativa de plataforma pronta de comércio eletrônico e evolução futura para checkout.
- Proposta completa em docs/PROPOSTA_TECNICA.md. Stack, hospedagem e painel ainda não aprovados pelo usuário.

## 11/09/2026 — Aprovação técnica e GitHub
- Usuário aprovou desenvolver conforme a proposta: Astro + TypeScript, React quando necessário e Cloudflare como direção de hospedagem.
- Confirmou domínio alejoias.com na Cloudflare; a publicação do novo site ainda não foi configurada.
- Criou https://github.com/rg-carraro/alejoiassite.git e autorizou commit e push na master.
- Fixou C:\Users\rgcar\git\alejoiassite como pasta oficial de desenvolvimento.
- Momento de inclusão do painel administrativo e detalhes de infraestrutura continuam sujeitos ao detalhamento da implementação.

# Catálogo e atendimento — implementação local

## Painel disponível
Em /admin, com senha, é possível cadastrar e editar código/SKU, nome, endereço, descrição, categoria, imagem, texto alternativo, opções, tags, coleções, preço em centavos, preço promocional, início/fim da promoção e situações.

Habilitar/desabilitar controla exposição no catálogo e páginas públicas. Disponível/indisponível controla solicitação. Desativar não apaga; pode reativar. Histórico registra antes/depois, data, origem e responsável administrativo. Revisão evita sobrescrever edição mais recente de outra aba.

Produtos sem foto exibem estado de imagem pendente. Upload aceita JPEG, PNG e WebP até 5 MB. Promoção válida usa preço menor que o normal, respeitando datas; catálogo e pedido calculam o preço efetivo.

## Importação automática
CSV ou JSON, até 500 linhas e 1 MB, com prévia antes da confirmação. Código é a chave de conciliação; duplicatas e dados inválidos bloqueiam a gravação do lote. A transação impede aplicação parcial.

Por padrão, produtos existentes são ignorados para preservar edição manual. A opção de atualizar permite sobrescrever somente os campos fornecidos. Campo vazio não apaga valor. Para limpar promoção/descrição, editar pelo painel. Exportação JSON pode ser reimportada; metadados de revisão/datas não substituem os do banco.

Novos registros são desativados por padrão, exceto habilitado=sim. O modelo está em public/modelo-produtos.csv. CSV usa nomes como codigo, nome, categoria, preco, descricao, imagem, texto_imagem, preco_promocional, inicio_promocao, fim_promocao, tags, opcoes, colecoes, habilitado, disponivel, demonstrativo. Listas usam |; categorias usam slugs (aneis, brincos etc.). preco é em reais; JSON também aceita priceInCents em centavos.

A prévia se torna inválida se os produtos ou a lista mudarem. Descrições ausentes recebem apenas um texto neutro pelo nome; o botão de rascunho no painel é determinístico, não uma integração de IA. Descrições elaboradas e sugestões comerciais podem ser trabalhadas com Codex pelas skills salvas.

## Solicitações de atendimento
Ao clicar em Registrar e abrir WhatsApp, nome e telefone são validados. O servidor confere disponibilidade, opções, quantidade e preço atual, grava cópia dos itens/valores e gera a mensagem. Mudança de preço ou indisponibilidade exige atualizar a sacola antes de prosseguir.

Cada clique lógico usa identificador para evitar duplicação em repetição de rede. Nome/telefone não são persistidos no localStorage. Solicitações ficam no banco local e aparecem apenas no painel; situação: nova, em atendimento, concluída ou cancelada. O registro NÃO comprova envio no WhatsApp, compra, pagamento ou reserva. A mensagem é revisada/enviada pela cliente para 5519988038395.

Dados destinam-se a retorno sobre a solicitação, sem marketing automático. Contatos, banco, imagens enviadas e senha não entram no Git.

## Ainda pendente
Lista real de produtos do usuário; publicação e banco hospedado na Cloudflare; integração futura com pagamento e aplicativo. O ambiente atual é local Node/SQLite. Não há checkout financeiro.

## Formatação do WhatsApp
Resumo copiável e mensagem do servidor compartilham src/data/order-message.ts. Nomes/códigos/opções completos ficam numerados acima de tabela monoespaçada Item/Qtd/Unit./Total (em R$); isso evita truncar nomes longos. Subtotal continua fora da tabela. Solicitações anteriores mantêm a mensagem histórica original. O alinhamento no WhatsApp real será avaliado nos testes do usuário.

## Mensagem simplificada — decisão mais recente
Usuário pediu somente Produto | Valor. A tabela agora usa texto simples, sem bloco de crases ou títulos com asteriscos; quantidade (quando maior que um) e opção ficam na coluna Produto, e Valor é o total da linha. Removidas da nova mensagem as frases sobre peças/preços demonstrativos e sobre não ser compra/reserva, conforme solicitado. Nome, telefone, identificador da solicitação, subtotal e observação permanecem. Regras do backend e avisos no site não mudam; solicitações antigas preservam seu texto original.

## Bordas alinhadas da tabela WhatsApp
Usuário solicitou alinhar as barras verticais como bordas. Mantidas duas colunas Produto e Valor, agora preenchidas com espaços e envolvidas em bloco monoespaçado do WhatsApp. Nomes longos continuam na linha seguinte sem truncamento; valores ficam à direita. Prévia na sacola também usa fonte monoespaçada. Substitui a decisão anterior de usar texto sem bloco. Teste verificou posições idênticas das barras em todas as linhas.

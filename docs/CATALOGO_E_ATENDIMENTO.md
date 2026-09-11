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

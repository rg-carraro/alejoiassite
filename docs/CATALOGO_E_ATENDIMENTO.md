# Catálogo e atendimento — requisitos aprovados

## Cadastro futuro
O usuário fornecerá uma lista para cadastrar produtos automaticamente e deseja poder editar nome, descrição, preço, tags de promoção, disponibilidade e demais campos depois. Formato da lista ainda não fornecido. Painel autenticado, banco e importador ainda não implementados.

Modelo proposto: ID estável, código/SKU, nome, descrição, categoria, imagens, variações, preço em centavos, preço promocional opcional, tags, disponibilidade e habilitado/publicado. Datas de criação/atualização e origem de importação. Campos finais dependem da lista real.

Habilitar/desabilitar sem apagar cadastro. Manter histórico de alterações e possibilidade de reativação. Separar visibilidade de disponibilidade. Importações precisam conciliar códigos, não duplicar e preservar edições manuais. Histórico operacional persistente não é substituído por commits Git.

Fluxo de implementação futuro: banco e painel com autenticação → cadastro/edição e histórico → importação com prévia de conflitos e resultado → catálogo público ligado aos registros habilitados. Não expor funções administrativas ao público. O banco do aplicativo Android permanece separado.

## Descrições e valores
Codex auxilia na escrita e propõe melhorias sem inventar especificações. Valores fornecidos são preservados; sugestões de preços devem indicar premissas. Preço promocional e tags são campos editáveis, sem descontos fictícios. Os R$ 0,10 atuais são somente demonstração.

## Atendimento implementado nesta etapa
Sacola solicita nome e telefone antes de abrir o WhatsApp. Resumo inclui identificação, itens, códigos, opções, quantidades, valores e subtotal. Cliente revisa e envia manualmente para 5519988038395.

Nome e telefone ficam nos campos da página e na mensagem, sem cadastro central nem persistência em localStorage. O atendimento terá esses dados quando a cliente enviar a mensagem. Histórico de clientes/pedidos no site exige backend posterior. Dados destinam-se ao retorno sobre a solicitação, não a marketing automático.

## Próximos insumos
Lista de produtos com códigos, valores e fotos/referências. Após conhecer o formato, especificar importação e iniciar o painel. Não é necessário recadastrar manualmente tudo antes de fornecer a lista.

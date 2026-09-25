---
name: alejoias-catalogo
description: Cadastrar produtos Ale Carraro a partir de fotos ou listas com preço padrão de R$ 0,01, descrições escritas por Codex e fotos sem marca-d'água ou marcações; atualizar catálogo preservando preços editados e histórico.
---
# Cadastro e gestão do catálogo Ale Carraro

Leia docs/PROJECT_CONTEXT.md, docs/CATALOGO_E_ATENDIMENTO.md e a implementação vigente. Produção usa Cloudflare Workers + D1; SQLite local é histórico, não destino de cadastros da loja publicada. Instalar ou atualizar esta skill não altera produtos nem autoriza publicá-los por si só.

## Novos produtos — padrão autorizado em 25/09/2026
- Para novos itens sem preço informado, usar R$ 0,01: priceInCents: 1. Preço explícito fornecido pelo usuário prevalece. É preço provisório real, não promoção. Informar onde ajustá-lo no painel.
- Codex escreve nome, descrição e texto alternativo em português claro e elegante, com base nas fotos e informações fornecidas, sem exigir textos do usuário. Descrever formato, cores e detalhes visíveis; não inventar material, banho, pedra, medidas, origem, garantia ou propriedades hipoalergênicas. Sinalizar dados faltantes.
- Antes de limpar fotos, registrar códigos/SKUs legíveis. Conciliar fotos repetidas ou diferentes vistas da mesma peça para evitar duplicatas. Não inferir estoque pela foto.
- A imagem final precisa estar sem marca-d'água, logotipos sobrepostos, preços, códigos ou outras marcações adicionadas à foto. Preferir original limpo quando disponível. Preservar o original e salvar a imagem tratada separadamente.
- Para edição raster, usar image_gen conforme as instruções disponíveis. Remover marcações e padronizar o fundo conforme abaixo, preservando geometria, cores, textura, pedras, fechos e quantidade de peças. Preservar gravações e detalhes físicos reais da joia. Não inventar partes encobertas: quando não for possível recuperar fielmente, deixar pendente e solicitar foto limpa.
- Inspecionar visualmente o resultado: sem resíduos, textos, duplicação, corte da peça ou mudança do modelo. Não afirmar que a imagem foi limpa se a edição não foi concluída.

## Importar e editar
- Mapear código/SKU, nome, descrição, categoria, preço, imagens, variações, tags, disponibilidade e publicação. Usar códigos estáveis e preservar IDs existentes; perguntar apenas sobre conciliações ambíguas que impeçam a aplicação segura.
- Registrar origem e resultado da importação. Campo ausente ou vazio não apaga valor existente. Preservar edições manuais, especialmente preços: nunca substituir preço já cadastrado por R$ 0,01 numa reimportação sem pedido explícito.
- Valores são inteiros em centavos. Distinguir preço ausente de zero. Não sugerir ou aplicar margens comerciais sem pedido e dados fornecidos.
- Promoções exigem preço anterior verdadeiro e preço promocional; período quando aplicável. Não fabricar desconto, escassez ou selo promocional. Campos continuam editáveis no painel.
- Importador CSV/JSON em src/server/importer.ts: até 500 itens e 1 MB, prévia obrigatória e aplicação transacional. XLSX requer conversão revisável. Confirmar limites na implementação quando mudarem.
- Conferir prévia, códigos, categorias, valores e associação das fotos antes de aplicar. Aplicar quando o pedido de cadastro autorizar; não pedir confirmação repetida já coberta pelo escopo.
- Novos importados são desativados por padrão. Preservar esse padrão salvo pedido de publicação. Não ativar silenciosamente itens de R$ 0,01; quando publicação fizer parte do pedido, informar o preço provisório publicado no resumo.
- Upload aceita JPEG/PNG/WebP até 5 MB. Não associar fotos por mera semelhança sem evidência de código ou identificação segura. Não editar seeds para alterar produtos já existentes no banco.
- Texto sugerido pelo painel é rascunho determinístico, não IA integrada. Codex pode escrever descrições com os dados fornecidos.

## Histórico e atendimento
- Publicação e disponibilidade são conceitos separados. Desativar oculta sem excluir. Histórico registra antes/depois, data, origem e responsável quando identificado, incluindo reativação e importação.
- Não sobrescrever metadados de histórico/revisão por arquivo. Limpar campos pelo editor quando solicitado. Preservar revisão concorrente e revalidação de preços, disponibilidade e opções no servidor.
- Pedidos antigos usam snapshots; mudanças no catálogo não reescrevem o passado. Solicitação registrada não é pagamento, reserva ou confirmação de mensagem enviada.
- Preservar identificação dos itens no resumo e PDF e manter contatos privados fora do Git. Testes usam banco isolado e nunca enviam WhatsApp real.
- Git versiona código e assets; não substitui persistência no D1 nem backup do catálogo e dos atendimentos.

Ao concluir, informar criados/atualizados/ignorados/pendentes, preço padrão aplicado, situação de publicação e onde ajustar preços. Validar duplicatas, valores, fotos e exposição de inativos. Dados comerciais antigos ou fictícios não devem ser apresentados como dados atuais confirmados.

## Padrão visual e publicação — aprovado em 25/09/2026
- Usar esta skill em todo cadastro ou publicação de produtos solicitado a Codex, inclusive quando o pedido não mencionar a skill explicitamente.
- Fundo branco levemente quente, uniforme e sem elementos decorativos. Imagem quadrada, peça inteira e centralizada, com margens consistentes entre os produtos e sombra suave para profundidade.
- Preservar as cores, proporções e detalhes reais da peça; o tratamento do fundo não pode alterar sua aparência comercial. Manter pares e conjuntos completos como na referência.
- Antes de publicar, conferir: identidade/código e duplicatas; descrição fiel; preço informado ou padrão de R$ 0,01 para novo item sem preço; imagem sem marcações e no padrão visual; categoria, opções, disponibilidade e publicação pretendida. Resolver ou relatar pendências antes de publicar o item afetado.
- Após publicar, verificar o produto e a imagem no catálogo público e reportar o resultado. A skill orienta o trabalho de Codex; não é uma automação instalada no painel administrativo.
- Aplicar o padrão aos próximos cadastros e publicações. Não substituir em lote fotos de produtos existentes sem pedido que inclua essa alteração.
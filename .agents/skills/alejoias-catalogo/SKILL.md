---
name: alejoias-catalogo
description: Cadastrar produtos Ale Carraro a partir de fotos ou listas com preços padrão por categoria e fotos tratadas em produtos_cadastrar/copias, descrições escritas por Codex e fotos sem marca-d'água ou marcações; atualizar catálogo preservando preços editados e histórico.
---
# Cadastro e gestão do catálogo Ale Carraro

Leia docs/PROJECT_CONTEXT.md, docs/CATALOGO_E_ATENDIMENTO.md e a implementação vigente. Produção usa Cloudflare Workers + D1; SQLite local é histórico, não destino de cadastros da loja publicada. Instalar ou atualizar esta skill não altera produtos nem autoriza publicá-los por si só.

## Novos produtos — padrão vigente por categoria
Para novos itens sem outro preço explícito do usuário, aplicar sempre:

| Categoria | Preço | priceInCents |
| --- | --- | --- |
| Brincos | R$ 59,90 | 5990 |
| Colares | R$ 119,90 | 11990 |
| Anéis | R$ 99,90 | 9990 |
| Pulseiras | R$ 119,90 | 11990 |
| Demais itens, incluindo Conjuntos e Tornozeleiras | R$ 149,90 | 14990 |

- Preços normais por categoria da peça (chamada de coleção pelo usuário), não promoções. Substituem o antigo padrão de um centavo. Novidades e Presentes não alteram o preço da categoria. Preço explícito do usuário prevalece; informar onde ajustá-lo no painel.
- Codex escreve nome, descrição e texto alternativo em português claro e elegante, com base nas fotos e informações fornecidas, sem exigir textos do usuário. Descrever formato, cores e detalhes visíveis; não inventar material, banho, pedra, medidas, origem, garantia ou propriedades hipoalergênicas. Sinalizar dados faltantes.
- Antes de limpar fotos, registrar códigos/SKUs legíveis. Conciliar fotos repetidas ou diferentes vistas da mesma peça para evitar duplicatas. Não inferir estoque pela foto.
- A imagem final precisa estar sem marca-d'água, logotipos sobrepostos, preços, códigos ou outras marcações adicionadas à foto. Preferir original limpo quando disponível. Preservar o original e salvar a imagem tratada separadamente.
- Para edição raster, usar image_gen conforme as instruções disponíveis. Remover marcações e padronizar o fundo conforme abaixo, preservando geometria, cores, textura, pedras, fechos e quantidade de peças. Preservar gravações e detalhes físicos reais da joia. Não inventar partes encobertas: quando não for possível recuperar fielmente, deixar pendente e solicitar foto limpa.
- Inspecionar visualmente o resultado: sem resíduos, textos, duplicação, corte da peça ou mudança do modelo. Não afirmar que a imagem foi limpa se a edição não foi concluída.

## Pastas de entrada, tratamento e publicação
- Sempre ler produtos de `C:\Users\rgcar\git\alejoiassite\produtos_cadastrar` (`produtos_cadastrar`), salvo outra origem explícita do usuário.
- Preservar originais e salvar imagens tratadas em `C:\Users\rgcar\git\alejoiassite\produtos_cadastrar\copias` (`produtos_cadastrar/copias`). Criar a saída se necessário; registrar correspondência entre originais, imagens finais e códigos/produtos.
- Quando o usuário pedir a exclusão dos originais, apagar somente os arquivos correspondentes a cadastros e imagens já verificados na loja pública; manter os originais de itens pendentes ou com falha. Registrar a correspondência e a verificação antes de apagar.
- Excluir `copias` da busca de novos originais. Cópias tratadas e diferentes vistas da mesma peça não geram cadastros duplicados.
- Nos pedidos de cadastro deste fluxo, usar imagens finais de `copias` para upload e publicar nas respectivas categorias/coleções. Respeitar pedidos específicos de somente preparar ou salvar rascunhos. Classificar pela peça; não atribuir Presentes indiscriminadamente.
- Salvar em `copias` não publica por si só: concluir cadastro e upload na loja ativa Cloudflare/D1 e verificar produto, imagem e categoria/coleção no catálogo público. Não cadastrar no SQLite histórico.

## Importar e editar
- Mapear código/SKU, nome, descrição, categoria, preço, imagens, variações, tags, disponibilidade e publicação. Usar códigos estáveis e preservar IDs existentes; perguntar apenas sobre conciliações ambíguas que impeçam a aplicação segura.
- Registrar origem e resultado da importação. Campo ausente ou vazio não apaga valor existente. Preservar edições manuais, especialmente preços: nunca substituir preço já cadastrado pelo padrão da categoria numa reimportação sem pedido explícito. A tabela se aplica a novos produtos; atualizar esta skill não reajusta o catálogo existente.
- Valores são inteiros em centavos. Distinguir preço ausente de zero. Não sugerir ou aplicar margens comerciais sem pedido e dados fornecidos.
- Promoções exigem preço anterior verdadeiro e preço promocional; período quando aplicável. Não fabricar desconto, escassez ou selo promocional. Campos continuam editáveis no painel.
- Importador CSV/JSON em src/server/importer.ts: até 500 itens e 1 MB, prévia obrigatória e aplicação transacional. XLSX requer conversão revisável. Confirmar limites na implementação quando mudarem.
- Conferir prévia, códigos, categorias, valores e associação das fotos antes de aplicar. Aplicar quando o pedido de cadastro autorizar; não pedir confirmação repetida já coberta pelo escopo.
- Novos importados são desativados por padrão no importador. No fluxo de cadastro e publicação acima, publicar após validar os itens; em pedidos limitados a preparação/rascunhos, manter desativados. Informar preços aplicados e situação de publicação no resumo.
- Produção Cloudflare aceita imagem otimizada de até 300.000 bytes; usar JPEG com no máximo 1000 px, conforme o fluxo documentado. O limite de 5 MB pertence ao backend local antigo. Não associar fotos por mera semelhança sem evidência de código ou identificação segura. Não editar seeds para alterar produtos já existentes no banco.
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
- Antes de publicar, conferir: identidade/código e duplicatas; descrição fiel; preço informado ou padrão da categoria para novo item sem preço; imagem de `copias` sem marcações e no padrão visual; categoria, opções, disponibilidade e publicação pretendida. Resolver ou relatar pendências antes de publicar o item afetado.
- Após publicar, verificar o produto e a imagem no catálogo público e reportar o resultado. A skill orienta o trabalho de Codex; não é uma automação instalada no painel administrativo.
- Aplicar o padrão aos próximos cadastros e publicações. Não substituir em lote fotos de produtos existentes sem pedido que inclua essa alteração.
## Nitidez e fidelidade da foto
- Priorizar fotos nítidas, bem iluminadas e em resolução suficiente para avaliar a peça na página de produto. Usar o original de maior qualidade disponível e evitar compressão que apague textura, contornos, fechos ou detalhes.
- Conferir a imagem final no tamanho de exibição e ampliada a 100%: foco adequado, detalhes visíveis, sem pixelização evidente, halos de nitidez, suavização excessiva ou reflexos que escondam a peça. Conferir também o arquivo servido após upload.
- Ajustar nitidez com moderação, preservando cores e aparência reais. Aumentar resolução não recupera detalhes ausentes; não inventar textura, pedras, gravações ou acabamento para parecer mais definido.
- Quando desfoque ou baixa resolução impedirem avaliar o produto fielmente, relatar a limitação e pedir uma foto melhor para o item afetado antes de publicá-lo. Não tratar uma reconstrução artificial como evidência do produto real.

## Procedimento validado para próximos lotes
Leia [docs/FLUXO_CADASTRO_PRODUTOS.md](../../../docs/FLUXO_CADASTRO_PRODUTOS.md) a partir da raiz do projeto antes de preparar um lote. O documento registra o prompt de tratamento, conversão Sharp para JPEG, manifesto, backup, importação sem sobrescrita, verificação pública e exclusão autorizada dos originais. Credenciais e evidências comerciais ficam nas pastas privadas ignoradas; nunca armazenar senhas nesta skill.

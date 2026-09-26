# Cadastro de produtos por fotos

Fluxo aprovado e usado em 26/09/2026. A orientação permanente está em [alejoias-catalogo](../.agents/skills/alejoias-catalogo/SKILL.md). Não é uma automação instalada no admin.

## Entrada e tratamento

Ler `produtos_cadastrar/`, na raiz deste projeto, sem incluir `copias/` na busca de novos produtos. Salvar os arquivos tratados e o manifesto de correspondência original → foto final → produto em `produtos_cadastrar/copias/`. Essas pastas permanecem locais e ignoradas pelo Git.

Antes da edição, inspecionar as fotos, anotar códigos legíveis e reunir vistas da mesma peça. Usar `image_gen` para o tratamento raster, a partir do original inspecionado. Remover mãos, cartões, fundo e marcações sobrepostas, mantendo os detalhes físicos reais. Não reconstruir como fato partes encobertas ou desfocadas.

Referência de instrução para a edição:

> Fotografia de catálogo da mesma joia da referência. Remover mãos, cartões, textos e fundo. Preservar exatamente modelo, cores, proporções, textura, pedras, fechos e quantidade de peças; manter pares e conjuntos completos. Fundo branco levemente quente, uniforme, enquadramento quadrado, margens consistentes e sombra suave. Não acrescentar nem duplicar elementos. Se um detalhe não estiver visível, não inventá-lo.

Conferir o resultado ao lado do original, também ampliado a 100%. Corrigir resíduos de pele, textos, alterações de modelo e duplicação de elementos antes do cadastro. Itens cuja identificação ou fidelidade continue duvidosa ficam pendentes; os demais podem prosseguir.

Guardar a versão tratada em PNG. Para upload, converter com Sharp para JPEG, fundo `#fffefa` quando houver transparência, largura e altura máximas de 1000 px, ajuste `inside`, sem ampliação. No lote validado, usar `mozjpeg`, qualidade inicial 90 e reduzir para 85, 80, 75 ou 70 apenas se necessário para ficar em até 300.000 bytes. Conferir a nitidez após a conversão; não confundir esse limite de produção com os 5 MB do backend local antigo.

## Cadastro e preços

Usar a tabela vigente da skill: Brincos R$ 59,90; Colares e Pulseiras R$ 119,90; Anéis R$ 99,90; demais itens R$ 149,90. Preço explícito do usuário prevalece. Aplicar o padrão somente aos novos itens, preservando preços já editados no admin.

Escrever nome, descrição e texto alternativo em português com características observáveis, sem inventar material, banho, dimensões ou garantias. Categoria identifica a peça; `novidades` e `presentes` são coleções adicionais. Não classificar pela posição da joia na mão ou no pulso quando isso for ambíguo. Reutilizar código legível; para peças sem código, gerar ID estável e slug único, registrando-os no manifesto. Uma segunda vista não é outro produto.

## Publicação e verificação

1. Usar a loja ativa em `https://alejoias.com`, Cloudflare Workers/D1. Não gravar no SQLite histórico nem alterar seeds para publicar.
2. Ler credenciais do arquivo privado local indicado pelo usuário. Nunca copiar senhas, cookies, tokens, exports ou backups para a skill ou Git. O arquivo usado neste lote é `.data/cloudflare-migration-1790288322003/acesso-admin.txt`; confirmar sua validade sem mostrar o conteúdo.
3. Autenticar pelo fluxo vigente do admin e exportar todos os cadastros, inclusive inativos, para backup privado antes da alteração. Conferir IDs, slugs e possíveis duplicatas também pelas fotos.
4. Enviar os JPEGs de `copias` por `/api/upload`; registrar as URLs devolvidas. Preparar importação JSON com valores inteiros em centavos, categoria e publicação explícitas (`enabled: true` para os itens cuja publicação foi solicitada).
5. Usar `/api/import-preview` com `overwrite: false`. Conferir que a prévia contém apenas os novos itens esperados e aplicar com o token retornado em `/api/import-apply`. Comparar o catálogo com o backup antes da aplicação; reconciliar mudanças concorrentes, sem sobrescrevê-las.
6. Verificar cada item no catálogo público: ID, preço, categoria, URL da imagem e página `/produto/<slug>`. No lote validado, os bytes servidos de cada imagem foram comparados com o JPEG local. Conferir que todos os campos dos cadastros anteriores continuam iguais, inclusive preços e estado de publicação.
7. Salvar resultado, horário e correspondências no manifesto privado. Se houver interrupção, reconciliar IDs e uploads já realizados antes de repetir a importação.
8. Quando a exclusão dos originais estiver autorizada, apagar somente os arquivos associados aos produtos efetivamente publicados e verificados. Validar que cada caminho está dentro da pasta de entrada; preservar `copias`, itens pendentes e arquivos com falha. Não fazer exclusão recursiva da pasta.

Usar a implementação atual em `src/server/cloudflare/api.ts`, o cliente admin e o importador como referência para contratos e limites; este documento não congela a API. Alterar a skill ou fazer push não publica produtos. Ajustes posteriores de preço são feitos em `/admin`.

## Resultado do lote de 26/09/2026

- 45 fotos tratadas, 40 novos produtos publicados e verificados, 26 cadastros anteriores preservados integralmente; catálogo público com 61 produtos naquele momento.
- 40 originais excluídos depois da verificação; as 45 imagens tratadas foram mantidas em `copias`.
- Quatro produtos pendentes: três correntes aguardam classificação como pulseira ou colar, e um conjunto oval necessita de foto mais nítida. Uma quinta foto é outra vista de uma das correntes, sem cadastro duplicado.
- Evidências privadas em `.data/catalogo-20260926/`, incluindo `admin-before.json`, `uploaded.json`, `verified.json` e `deletion-plan.json`. Manifesto em `produtos_cadastrar/copias/cadastros-20260926.json`. Não versionar esses dados.

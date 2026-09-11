# Roteiro para testar o site local

## Abrir e encerrar
- Feche o terminal anterior e abra iniciar-dev.bat com dois cliques.
- Confira se a loja abre e se /admin mostra o login.
- Abrir o BAT de novo com servidor ativo deve apenas abrir o site existente.
- Deixe a janela aberta enquanto testa; Ctrl+C encerra.

## Loja e sacola
- Navegue por categorias, Novidades e Presentes; teste busca e limpeza de filtros.
- Abra uma peça e adicione quantidades/opções à sacola.
- Altere quantidade, remova e recarregue para conferir persistência e subtotal.
- Confira mensagem e copie o resumo: nomes e opções completos, tabela Item/Qtd/Unit./Total em R$, identificação e subtotal.
- Nome/telefone vazios ou inválidos devem bloquear Registrar e abrir WhatsApp.
- Se quiser testar a abertura, use seus próprios dados. A solicitação será registrada antes do WhatsApp; envie a mensagem somente se desejar.
- Confira a tabela no seu WhatsApp, especialmente alinhamento e leitura no celular, e relate diferenças.

## Painel
- Entre com senha inicial (.data/acesso-admin.txt); salve a nova senha em lugar seguro ao trocá-la.
- Cadastre uma peça de teste com código próprio; use demonstrativo e prefira desativado enquanto edita.
- Edite descrição, foto, opções, tags e valores; habilite e confira na loja.
- Teste promoção menor que o preço normal, incluindo datas, e veja o total na sacola.
- Desative: deve sumir do catálogo e a URL não deve exibir o produto. Reative: mesmo cadastro e histórico permanecem.
- Marque indisponível: continua visível se habilitado, mas não pode ser solicitado.
- Abra Histórico para conferir antes/depois das alterações.
- Veja solicitações e atualize a situação do atendimento. Não são vendas automaticamente confirmadas.

## Importação
- Baixe o modelo CSV, use códigos de teste e confira a prévia.
- Importar novamente deve preservar existentes por padrão; a opção de atualização permite substituir os campos fornecidos.
- Linhas inválidas/duplicadas devem impedir confirmar o lote.
- Exporte JSON e guarde como referência do catálogo. Não inclui histórico, contatos ou imagens.

## Dados e retorno dos testes
Dados cadastrados são reais no banco local e permanecem após reiniciar. Não existe botão de apagar todo o ambiente. Desative produtos de teste para preservar histórico. Para backup completo, pare o servidor e copie .data inteira; não envie essa pasta ao GitHub.

Ao relatar um problema, informe a página, o passo executado, o esperado e o ocorrido. Capturas ajudam; oculte senhas e dados de outras pessoas.

Ainda fora desta rodada: publicação no domínio, pagamento online, banco hospedado e integração com o app Android.

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
- Confira o PDF: fotos, nomes, opções reais, quantidades, valores, identificação e subtotal. WhatsApp e cópia devem conter somente o link privado do documento.
- Nome/telefone vazios ou inválidos devem bloquear Preparar pedido com PDF.
- Se quiser testar a abertura, use seus próprios dados. A solicitação será registrada antes do WhatsApp; envie a mensagem somente se desejar.
- Confira se o destinatário abre o link e baixa o PDF no celular.

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

A loja está publicada em `https://alejoias.com/` pelo Tunnel local. Ainda fora desta rodada: pagamento online, banco hospedado, integração com o app Android e rota pública das notas.

## Tela de celular
Confira menu, categorias, fotos, campos e sacola com a tela estreita e ao girar o aparelho. No painel, produtos devem aparecer como cartões, com ações e rótulos legíveis. A adaptação é automática pela largura da tela. Testes automatizados em navegador não substituem sua avaliação no aparelho real.

## PDF com fotos
- Preparar seleção com 1 e várias peças; conferir fotos, valores, nome, telefone e subtotal.
- Baixar PDF; no painel baixar pela solicitação correspondente.
- No celular, testar Compartilhar PDF com WhatsApp, conferir destino e se o texto acompanha o arquivo. Quando não acompanhar, copiar resumo.
- Conferir alternativa baixar/abrir WhatsApp/anexar Documento.
- Alterar quantidade, remover peça ou editar nome após preparar: botões do PDF anterior devem desaparecer.
- Cancelar compartilhamento: registro permanece, mas não significa envio.
- Validação automatizada: integração do painel/sacola, token privado, documento multipágina, compartilhamento simulado e falha de geração. Revisão visual em três páginas e sacola 360px; teste no WhatsApp real cabe ao usuário.

### Link do PDF
Conferir que WhatsApp, prévia e cópia contêm o mesmo link, sem tabela. Abrir o link em navegador sem login e baixar o PDF. Link incompleto deve mostrar erro legível. O teste tests/share-pdf.cjs cobre esse fluxo sem enviar mensagens reais. Para teste pelo WhatsApp fora do ambiente local é necessária hospedagem acessível.

## Sistema de notas no mesmo computador

- Abra `http://127.0.0.1:8009/entrar/`; o login é independente do painel da loja. O acesso inicial está no arquivo privado `../alejoias/.tools/notas-admin-access.txt`.
- Em **Minha senha**, é possível definir a mesma senha usada na loja, digitando a senha atual das notas. Alterações posteriores não são sincronizadas automaticamente.
- Cadastre uma revendedora fictícia; crie e revise um rascunho com descrição manual e outra peça escolhida nas sugestões. Confira preço e desconto, especialmente quando a origem for o cadastro legado.
- Emita, imprima, registre devolução parcial e feche uma nota de teste. Essas ações gravam no banco web local. Consulte o histórico legado separadamente; valores de notas automáticas antigas podem refletir o cadastro atual, não o preço original.
- O servidor de notas na porta 8008 é preparado para o Tunnel. `https://notas.alejoias.com/entrar/` ainda precisa da rota no Tunnel e validação por HTTPS; o link no admin da loja permanece oculto até então.
- O procedimento técnico e os limites estão em `../alejoias/docs/NOTAS_WEB.md`.

---
name: alejoias-catalogo
description: Preparar importações de listas de produtos AleJoias, escrever descrições fiéis, manter preços, promoções e disponibilidade editáveis e planejar histórico sem apagar produtos.
---
# Gestão do catálogo AleJoias

Leia docs/CATALOGO_E_ATENDIMENTO.md e a implementação atual. Não alegar que há painel, banco ou importador antes de existirem. O usuário deseja importar listas automaticamente e poder corrigir os campos depois.

## Importar e editar
- Inspecione o formato da lista fornecida e mapeie código/SKU, nome, descrição, categoria, preço, imagens, variações, tags, disponibilidade e situação de publicação.
- Use código estável para conciliar importações e evitar duplicatas; preserve IDs existentes. Se a lista não permitir identificar atualizações com segurança, mantenha os casos ambíguos pendentes e pergunte apenas o necessário.
- Registre origem e resultado da importação. Campo ausente não significa apagar valor existente. Preserve edições manuais ao reimportar, salvo instrução explícita de sobrescrita.
- Converta valores brasileiros em centavos; diferencie preço ausente de zero. Não substituir preços reais por R$ 0,10: esse valor foi autorizado apenas para as amostras iniciais.
- Escreva em português claro e elegante, com informação útil sobre a peça. Não inventar material, banho, pedra, medidas, origem, garantia ou qualidades hipoalergênicas a partir de foto. Sinalize dados faltantes.
- Sugira preços quando solicitado, usando custo, margem e regras fornecidos; não aplicar sugestão comercial como preço confirmado sem autorização.
- Promoções precisam de preço anterior verdadeiro, preço promocional e período quando aplicável. Não fabricar desconto, escassez ou selo promocional. Descrição, preços, tags e disponibilidade devem ser editáveis no painel futuro.

## Preservar histórico
- Habilitado/publicado e disponível para venda são conceitos separados. Desativar oculta do catálogo público sem excluir o cadastro.
- Histórico futuro deve registrar antes/depois, data, origem e responsável quando identificado. Inclua reativação e importações. Git do código não substitui histórico operacional do catálogo.
- Produtos em pedidos antigos usam cópia dos dados no momento do pedido; alterações futuras não reescrevem o passado.
- Produto desativado ou indisponível não pode permanecer comprável por uma sacola antiga. Revalidar no servidor quando houver backend.

Antes de concluir uma importação implementada, reporte novos/atualizados/ignorados/pendentes e valide duplicidades, valores e exposição de produtos inativos. Não publicar dados comerciais antigos ou fictícios como reais.

---
name: alejoias-manutencao
description: Manter o site AleJoias em Astro e TypeScript, corrigir catálogo e sacola, validar alterações e sugerir evoluções técnicas dentro do projeto alejoiassite.
---
# Manutenção técnica AleJoias

Leia docs/PROJECT_CONTEXT.md e o estado Git antes de editar. Pasta oficial C:\Users\rgcar\git\alejoiassite; a pasta _old é apenas recuperação. Consulte docs/DESENVOLVIMENTO.md para execução.

- Preserve Astro + TypeScript e lockfile pnpm; acrescente React apenas quando a interação justificar. Não substituir stack por starter de outro framework.
- Astro check exige atualmente TypeScript 6; não atualizar automaticamente para 7 sem verificar compatibilidade. Node 24.19.0 e pnpm 11.19.0 foram validados. Consulte manifests atuais e fontes oficiais antes de recomendar upgrades.
- Site é separado do app AleJoias Vendas SQLite Sync v2. Não modificar app, IDs ou backend Apps Script para tarefas web.
- Sementes demonstrativas em src/data/products.ts; catálogo ativo em SQLite via src/server/store.ts; preços inteiros em centavos. Não usar ponto flutuante para acumulados monetários.
- Preserve filtros, páginas de produto, sacola persistente e resumo do WhatsApp com quantidades, opções, valores, nome e telefone da cliente.
- WhatsApp confirmado: 5519988038395. Abrir link não confirma envio, compra, reserva ou pagamento. Nunca enviar mensagem real em testes.
- Dados pessoais de atendimento não devem entrar no Git, telemetria ou armazenamento persistente do navegador por conveniência. Solicitações agora são persistidas no banco privado .data, após ação da cliente, e incluídas no resumo. Nunca versionar .data.
- Rode check/build nas alterações de código e teste fluxos afetados no navegador quando comportamento mudar. Testes devem usar dados fictícios. Não duplicar servidores se o localhost já estiver ativo.
- Atualize contexto e histórico após decisões relevantes. Commit/push conforme autorização da sessão; publicação e DNS não são consequência automática de push.
- Ao sugerir atualizações, explique benefício, impacto e prioridade; diferencie sugestão de implementação autorizada. Não criar automações recorrentes sem pedido.
- Para importação, edição comercial, promoções e histórico, use a skill alejoias-catalogo e docs/CATALOGO_E_ATENDIMENTO.md.

Runtime atual: adapter Node + SQLite para execução local; migrar adapter/storage para Cloudflare antes de publicação. Painel /admin implementado. Consultar docs/DESENVOLVIMENTO.md e usar banco isolado para testes administrativos.

## Retomada e validação
- iniciar-dev.bat é a entrada de dois cliques; scripts/dev-windows.ps1 configura somente a sessão. Preservar compatibilidade Windows e não duplicar o servidor ativo.
- src/data/order-message.ts centraliza tabela monoespaçada Produto | Valor do WhatsApp com barras alinhadas e quebra de nomes longos e resumo copiável. Preservar nomes/opções completos e quantidade na coluna Produto; manter códigos no snapshot interno, valores em centavos e snapshot das solicitações antigas.
- Testes administrativos usam ALEJOIAS_DATA_DIR separado (.data/qa-admin) e interceptam WhatsApp. Nunca apontar testes que alteram produtos ao banco do usuário.
- Backend revalida preço, publicação, disponibilidade e opções; preserve revisão concorrente e idempotência das solicitações.
- Exportação JSON é catálogo, não backup completo. Para cópia completa local, parar o servidor e copiar .data inteira, sem versionar dados privados.
- Antes de afirmar conclusão, atualizar documentação vigente e registrar o que foi testado; a aparência da tabela no WhatsApp real depende do teste do usuário.

- Responsividade usa largura da tela e pointer:coarse, não identificação por user-agent. Preservar campos mobile com fonte de pelo menos 16px, alvos de toque confortáveis e painel em cartões. Validar 320/360/390px, tablet e desktop ao alterar layout; tests/responsive.cjs usa servidor isolado na porta 4322.

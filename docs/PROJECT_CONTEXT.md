# Contexto atual — AleJoias Site

Atualizado em 11/09/2026. Estado: protótipo local funcional, com painel e persistência, pronto para testes do usuário.

## Projeto e continuidade
- Pasta oficial: C:\Users\rgcar\git\alejoiassite.
- Repositório: https://github.com/rg-carraro/alejoiassite.git; branch master.
- Pasta anterior alejoiassite_old é somente recuperação.
- Domínio confirmado pelo usuário: alejoias.com, administrado na Cloudflare. Nenhum deploy ou alteração de DNS foi feito.
- O app AleJoias Vendas SQLite Sync v2 é separado. Preservar app, IDs e backend Apps Script.
- Histórico cronológico em docs/DECISION_LOG.md. Este arquivo descreve o estado vigente, sem repetir pendências já resolvidas.

## Direção aprovada
Catálogo moderno, elegante e intuitivo, priorizando celular, seleção em sacola e pedido pelo WhatsApp. Pagamento direto será uma etapa futura.

Visual: fundo claro, fotos grandes, tipografia elegante, detalhes dourados e contraste escuro. Logo manuscrito e fotos anteriores do Wix usados no protótipo; ajustes podem seguir os testes do usuário.

Categorias: Brincos, Pulseiras, Anéis, Colares, Conjuntos e Tornozeleiras. Coleções: Novidades e Presentes. Categorias sem produtos mostram estado vazio.

## Implementado
- Início, catálogo com busca/filtros/ordenação, detalhes de produto, sacola, sobre e atendimento.
- Sacola persiste IDs, opções e quantidades no navegador. Nome/telefone não são armazenados no localStorage.
- Nome e telefone obrigatórios para registrar solicitação. Backend valida preços, opções e disponibilidade; salva cópia dos itens e valores antes de abrir WhatsApp.
- WhatsApp confirmado: 5519988038395. Cliente revisa e envia a mensagem. Registro não comprova envio, compra, pagamento ou reserva.
- Mensagem e resumo copiável usam itens numerados com nomes/códigos/opções completos e tabela monoespaçada Item/Qtd/Unit./Total em reais. Subtotal e identificação são preservados. Formatação comum em src/data/order-message.ts.
- Painel /admin autenticado: cadastro/edição, fotos, descrição, preços, promoções com período, tags, opções, coleções e situações.
- Habilitado controla publicação; disponível controla solicitação. Desativar não apaga e permite reativar. Histórico registra antes/depois, data, origem e responsável administrativo.
- Importação CSV/JSON até 500 registros/1 MB com prévia, validação, transação e conciliação por código. Existentes preservados por padrão; atualização explícita sobrescreve apenas campos fornecidos. Campos vazios não apagam. Modelo em public/modelo-produtos.csv.
- Painel de solicitações com nome, telefone, itens, valores e situação (nova, em atendimento, concluída, cancelada).
- Upload JPEG/PNG/WebP até 5 MB. Exportação JSON do catálogo; não inclui fotos, contatos ou histórico.
- Rascunho de descrição pelo nome é recurso determinístico; não há serviço de IA integrado ao painel. Codex auxilia descrições/importações pelas skills.

## Tecnologia e dados
- Astro + TypeScript, pnpm com lockfile. React aprovado quando necessário, mas ainda não utilizado.
- Ambiente validado com Node 24.19.0 e TypeScript 6. TypeScript 7 apresentou incompatibilidade com astro check.
- Adapter Node e SQLite local em src/server/store.ts. Build atual é de servidor, não estático e não diretamente publicável em Workers.
- Banco: .data/alejoias-site.sqlite. Uploads: .data/uploads. Sementes em src/data/products.ts só alimentam banco novo.
- .data e backups são ignorados pelo Git. Contatos, banco e credenciais não são sincronizados com GitHub.
- Senha inicial privada em .data/acesso-admin.txt. Troca pelo painel encerra sessões e remove o arquivo da senha inicial.
- Para backup local completo: parar o servidor e copiar .data inteira. Exportação do catálogo não substitui esse backup.

## Uso local
Dois cliques em iniciar-dev.bat: configura Node/pnpm do runtime Codex na sessão, confere dependências e abre navegador. Detecta servidor AleJoias já ativo. Não muda PATH permanentemente. Manter janela aberta; Ctrl+C encerra. iniciar-site.ps1 usa o mesmo bootstrap.

Loja: http://localhost:4321/ — painel: http://localhost:4321/admin. A porta efetiva é exibida no terminal. Detalhes em docs/DESENVOLVIMENTO.md.

## Referências e dados demonstrativos
- Wix: https://alejoiasninafiori.wixsite.com/alejoias. Página inicial lida por HTTP; layout completo não inspecionado naquele acesso.
- Originais: C:\Pessoal\AleJoias\Site, 45 imagens inventariadas. Amostras copiadas para public/images.
- Três sementes: anel entrelaçado, pulseira coração, colares em camadas. Usuário pediu R$ 0,10 para visualizar preços; não usar esse valor como padrão para produtos reais.
- Materiais, preços antigos, garantias e condições comerciais do Wix não foram confirmados para publicação.
- Registro histórico de domínio em 08/09/2026: expiração exibida 08/09/2027, renovação automática ativa, preço então mostrado US$ 10,46/ano; não revalidado e não é orçamento atual de hospedagem.

## Validação concluída e próximos passos
Checagem Astro/TypeScript e build passaram. Testes em banco isolado cobriram autenticação, origem de requisições, revisão concorrente, promoções, inativos, histórico, importação, upload, edição, solicitação idempotente e snapshot. WhatsApp interceptado nos testes; nenhuma mensagem real enviada. Capturas de painel revisadas; mobile sem overflow no teste. BAT testado com servidor já ativo. Formatação da tabela validada; aparência no aplicativo WhatsApp será avaliada pelo usuário.

Próximos passos:
1. Usuário testar loja/painel/BAT e trazer ajustes (docs/ROTEIRO_TESTES.md).
2. Receber a lista e fotos reais, importar e revisar dados comerciais.
3. Preparar hospedagem Cloudflare, adapter compatível e migração de armazenamento (D1/R2 ou alternativa definida). Nenhuma configuração hospedada existe ainda.
4. Definir conteúdo comercial, entrega, políticas e requisitos de produção antes do lançamento.
5. Pagamento online e integração com Android são futuras decisões, sem implementação atual.

Documentar resultados e decisões de novos testes; não recriar a base nem tratar recursos concluídos como pendências.

## Adaptação ao celular
Usuário pediu identificação do dispositivo e ajuste de tela. Implementada adaptação por largura disponível e capacidade de toque (CSS media queries), sem rastrear aparelho nem depender de user-agent. Loja: navegação, botões, filtros, sacola e campos ajustados. Painel: produtos viram cartões em telas estreitas, editor se adapta à altura visível e campos usam fonte de 16px. Desktop preservado. Testes passaram em oito rotas nas larguras 320/360/390/768/1440px, sem overflow da página, sem erros JavaScript e com editor dentro da tela. Capturas mobile da loja e painel revisadas em banco isolado. Check e build passaram antes da interrupção; retomada concluiu revisão visual e documentação.

## Mensagem simplificada — decisão mais recente
Usuário pediu somente Produto | Valor. A tabela agora usa texto simples, sem bloco de crases ou títulos com asteriscos; quantidade (quando maior que um) e opção ficam na coluna Produto, e Valor é o total da linha. Removidas da nova mensagem as frases sobre peças/preços demonstrativos e sobre não ser compra/reserva, conforme solicitado. Nome, telefone, identificador da solicitação, subtotal e observação permanecem. Regras do backend e avisos no site não mudam; solicitações antigas preservam seu texto original.

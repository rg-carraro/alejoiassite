# Histórico de decisões — AleJoias Site

## 24/09/2026 — Retomada e sincronização

Revisadas as alterações do catálogo de setembro que permaneciam sem commit. Atualizadas as pendências de catálogo, hospedagem e mensagens nas documentações. Originais/intermediários de fotos permanecem locais; imagens otimizadas, manifesto e script da operação são versionados. Testes passaram a usar fixtures próprias, preservando banco novo vazio; PDF e capturas respeitam QA_DATA_DIR.

Validação em 24/09: Astro check (51 arquivos, zero erros/avisos/hints), build Node isolado e build Cloudflare aprovados. Regressões Node e Cloudflare passaram: painel, autenticação, concorrência, importação, sacola, PDF privado, compartilhamento simulado, troca de senha e backup/restauração D1 local. Responsividade aprovada em oito rotas e cinco larguras (320 a 1440 px); capturas mobile da loja e painel revisadas. Nenhuma mensagem real enviada nem pedido fictício criado no banco da loja.

O domínio inicialmente retornou 530: servidor Node e conector estavam parados. Reativados os iniciadores existentes, sem alterar DNS, banco ou build publicado. Verificação HTTPS final: início, catálogo e login 200, com 23 produtos públicos. A disponibilidade ainda depende do PC ligado e dos processos ativos; a inicialização após reinício permanece a testar.

Pendências reais: revisão comercial e testes no aparelho do usuário, curadoria de Presentes, ativação remota Workers/D1 e rota pública das notas no projeto independente. Pagamento e integração Android continuam futuros. Sincronização solicitada com origin/master, preservando dados privados fora do Git.

## Catálogo de setembro publicado — 16/09/2026

Das 25 imagens recebidas, 23 modelos distintos foram cadastrados (20 brincos, 3 pulseiras) a R$ 59,90 cada, com edição posterior pelo painel. Duas imagens repetidas não geraram produtos extras. As três amostras anteriores foram desativadas sem exclusão, preservando histórico e pedidos. Fotos antigas deixaram a vitrine, mas permanecem disponíveis aos PDFs históricos. Avisos de prévia foram retirados. Build, simulação em banco isolado e consulta à loja pública passaram. Correspondência das fotos e códigos em `scripts/catalogo-setembro-2026.json`.

## 11/09/2026 — Idealização e primeira versão

### Decisões do usuário
- Criar site moderno, elegante e intuitivo para clientes consultarem peças e fazerem pedidos via WhatsApp.
- Evoluir futuramente para compra e pagamento diretamente no site.
- Manter categorias do antigo Wix: brincos, pulseiras, anéis e colares; considerar outras quando aplicáveis.
- Aceitar como ponto de partida fundo claro, detalhes discretos em dourado, fotos grandes e tipografia elegante, permitindo ajustes posteriores.
- Reutilizar logos usados no Wix e considerar ícones e elementos visuais do aplicativo existente.
- Renomear a pasta para `C:\Users\rgcar\git\alejoiassite`.
- Levar o projeto ao GitHub quando houver uma base inicial.
- Documentar continuamente as conversas e decisões para facilitar retomadas.

### Sugestões apresentadas, ainda não especificadas em detalhe
- Jornada com catálogo, página do produto, sacola e resumo enviado pelo WhatsApp.
- Páginas de início, sobre e atendimento.
- Coleções Novidades e Presentes; categorias Conjuntos e Tornozeleiras se fizerem sentido para o catálogo.
- Definir administração dos produtos antes de escolher tecnologia.
- Prototipar com peças representativas antes da implementação completa.

### Evidências e pendências
- Contexto e skill locais lidos; pasta renomeada localizada.
- URL do Wix: https://alejoiasninafiori.wixsite.com/alejoias
- Consulta ao Wix falhou nesta sessão; logos e imagens não foram visualmente inspecionados nem extraídos.
- Nenhuma implementação, publicação, configuração de DNS ou integração com o aplicativo foi realizada.
- Permanecem abertas a origem dos dados do catálogo, a gestão dos produtos, os ativos visuais, a tecnologia e a hospedagem.

## 11/09/2026 — Categorias aprovadas e imagens de referência
- Usuário aprovou acrescentar Conjuntos e Tornozeleiras e as coleções Novidades e Presentes.
- Forneceu a pasta C:\Pessoal\AleJoias\Site para uso das imagens como exemplos.
- Página inicial do Wix recuperada por HTTP (200), com menus, catálogo, preços, itens esgotados e contato. Isso resolve a pendência de leitura textual registrada antes; inspeção visual completa do site continua pendente.
- Dois logos e duas fotos locais inspecionados visualmente. Sugestão de logo manuscrito para cabeçalho ainda não é decisão final.
- Documentado uso demonstrativo das imagens e necessidade de validar os dados comerciais antes de publicar.

## 11/09/2026 — Discussão técnica
- Apresentada recomendação de Astro + TypeScript, com React para interações quando necessário; Cloudflare como candidata à hospedagem.
- Diferenciados protótipo com dados em arquivo e operação com painel/API/banco.
- Registrada alternativa de plataforma pronta de comércio eletrônico e evolução futura para checkout.
- Proposta completa em docs/PROPOSTA_TECNICA.md. Stack, hospedagem e painel ainda não aprovados pelo usuário.

## 11/09/2026 — Aprovação técnica e GitHub
- Usuário aprovou desenvolver conforme a proposta: Astro + TypeScript, React quando necessário e Cloudflare como direção de hospedagem.
- Confirmou domínio alejoias.com na Cloudflare; a publicação do novo site ainda não foi configurada.
- Criou https://github.com/rg-carraro/alejoiassite.git e autorizou commit e push na master.
- Fixou C:\Users\rgcar\git\alejoiassite como pasta oficial de desenvolvimento.
- Momento de inclusão do painel administrativo e detalhes de infraestrutura continuam sujeitos ao detalhamento da implementação.

## 11/09/2026 — Clone e estrutura inicial
- Usuário confirmou clone na pasta oficial e renomeou a pasta anterior com sufixo _old.
- Solicitou atualizar documentação, sincronizar Git e iniciar a estrutura do primeiro protótipo.
- Criada base Astro + TypeScript, catálogo de categorias tipado e página inicial de verificação.
- Copiados dois logos e duas fotos locais autorizadas para que as referências acompanhem o clone.
- React adiado até haver necessidade de interação. Nenhum deploy realizado.
- Validação da estrutura: astro check sem erros ou avisos; astro build concluído. Revisão visual do protótipo completo permanece para a próxima etapa.

## 11/09/2026 — Protótipo completo de navegação e pedido
- Usuário pediu substituir a página provisória pelo fluxo discutido e confirmou WhatsApp (19) 98803-8395.
- Implementadas oito rotas com identidade visual, três referências de produtos, filtros e sacola persistente.
- Valores sob consulta até fornecimento do catálogo real; envio pelo WhatsApp depende de ação manual da cliente.
- Testes funcionais em Edge e revisão de captura desktop realizados; layout mobile sem overflow nas rotas verificadas.
- Checkout, administração e publicação continuam como etapas futuras.

## Preços demonstrativos — 11/09/2026
Usuário solicitou R$ 0,10 nas peças para visualizar valores. Três produtos agora têm priceInCents=10; catálogo, detalhes, sacola e resumo WhatsApp exibem preços demonstrativos. Subtotal calculado em centavos conforme quantidades; preços reais seguem pendentes.

## Skills e gestão de catálogo — 11/09/2026
Skills locais de manutenção técnica e catálogo salvas em .agents/skills e referenciadas por AGENTS.md. Usuário definiu importação automática de lista, campos editáveis, promoções, disponibilidade, habilitar/desabilitar sem excluir e histórico. Requisitos em docs/CATALOGO_E_ATENDIMENTO.md; painel/banco/importador ainda pendentes. Sacola agora exige nome e telefone para abrir WhatsApp e inclui identificação no resumo, sem armazenar esses dados em cadastro central.

## Retomada após limite — painel e BAT
- Backend parcial estava salvo no commit 63146de. Retomada preservou esse trabalho.
- Concluído painel com gestão, promoções, importação CSV/JSON, upload, histórico e solicitações de contato.
- Implementado iniciar-dev.bat após pedido adicional do usuário; configura ambiente da sessão e abre navegador.
- Testes passaram em banco isolado, sem mensagem real enviada e sem misturar dados fictícios com o banco principal.
- Publicação Cloudflare e pagamento online não executados.

## Resumo WhatsApp em tabela
A pedido do usuário, itens numerados com nome, código e opção são acompanhados de tabela monoespaçada com Item, Qtd, Unit. e Total em reais. Formatação compartilhada entre resumo copiável e mensagem gerada no servidor; nomes não são truncados. Solicitações antigas preservam o snapshot original.

## Consolidação antes dos testes do usuário
- Usuário pediu atualização das skills, documentação restante e sincronização Git antes de testar e retornar com novidades.
- Contexto e arquitetura consolidados para remover pendências obsoletas (painel/banco/importação já concluídos localmente).
- Skills atualizadas com BAT, banco privado, validação de solicitações, importação e tabela WhatsApp compartilhada.
- Criado docs/ROTEIRO_TESTES.md; documentados limites de backup/exportação e diferença entre solicitação registrada e mensagem enviada.
- Pendências reais: dados definitivos, retorno de testes, publicação Cloudflare e checkout futuro.
- Esta rodada altera apenas instruções/documentação, sem modificar comportamento do site.

## Adaptação ao celular
Usuário pediu identificação do dispositivo e ajuste de tela. Implementada adaptação por largura disponível e capacidade de toque (CSS media queries), sem rastrear aparelho nem depender de user-agent. Loja: navegação, botões, filtros, sacola e campos ajustados. Painel: produtos viram cartões em telas estreitas, editor se adapta à altura visível e campos usam fonte de 16px. Desktop preservado. Testes passaram em oito rotas nas larguras 320/360/390/768/1440px, sem overflow da página, sem erros JavaScript e com editor dentro da tela. Capturas mobile da loja e painel revisadas em banco isolado. Check e build passaram antes da interrupção; retomada concluiu revisão visual e documentação.

## Mensagem simplificada — decisão mais recente
Usuário pediu somente Produto | Valor. A tabela agora usa texto simples, sem bloco de crases ou títulos com asteriscos; quantidade (quando maior que um) e opção ficam na coluna Produto, e Valor é o total da linha. Removidas da nova mensagem as frases sobre peças/preços demonstrativos e sobre não ser compra/reserva, conforme solicitado. Nome, telefone, identificador da solicitação, subtotal e observação permanecem. Regras do backend e avisos no site não mudam; solicitações antigas preservam seu texto original.

## Bordas alinhadas da tabela WhatsApp
Usuário solicitou alinhar as barras verticais como bordas. Mantidas duas colunas Produto e Valor, agora preenchidas com espaços e envolvidas em bloco monoespaçado do WhatsApp. Nomes longos continuam na linha seguinte sem truncamento; valores ficam à direita. Prévia na sacola também usa fonte monoespaçada. Substitui a decisão anterior de usar texto sem bloco. Teste verificou posições idênticas das barras em todas as linhas.

Mensagem WhatsApp: opções provisórias contendo 'a confirmar' (como Composição, Tamanho ou Medida a confirmar) não são mais exibidas na tabela, a pedido do usuário. Opções reais permanecem; cadastro e snapshot interno não são alterados.

## 11/09/2026 — PDF para separar as peças
Usuário aprovou PDF anexo como alternativa à foto dentro da tabela textual do WhatsApp. Implementados documento com fotos e dados da seleção, download administrativo e fluxo de preparo/compartilhamento na sacola. Não existe anexo automático via link wa.me; cliente escolhe destino no compartilhamento nativo ou anexa o arquivo baixado. Registro continua independente do envio. Check/build e testes de integração passaram; revisão visual incluiu documento de três páginas.

## 11/09/2026 — Link no lugar da tabela
A pedido do usuário, novas mensagens passam a conter apenas o link para obter o PDF. Criada página de download para o destinatário, com token privado no fragmento e consulta POST, preservando a proteção da API. Não houve publicação: acesso remoto aos links depende de hospedagem acessível. Testes cobrem mensagem exata, prévia, abertura sem login, download e link inválido.

## 14/09/2026 — Miniatura na gestão de produtos
Por solicitação do usuário, a lista do painel mostra a foto cadastrada ao lado do nome e código. Sem imagem ou com imagem indisponível, mostra “Sem foto”. A mudança é apenas de apresentação; check e build passaram.
Na sequência, o formulário de edição passou a exibir a mesma miniatura junto ao campo de imagem, atualizada ao mudar o caminho ou enviar outra foto.

## 14/09/2026 — Preparação do domínio
Usuário optou por mostrar “Em breve” em `alejoias.com` enquanto cadastra os produtos definitivos. Criada página estática isolada em `holding/`, com configuração própria de Worker. Revisão visual em 390/1440 px e simulação de deploy com Wrangler 4.131.1 passaram. Cloudflare abriu em tela de login; nenhum recurso remoto, deploy ou DNS foi alterado. A loja Astro/Node/SQLite permanece local até migração de banco, uploads e PDF.

## 14/09/2026 — Mudança para publicação da loja local
Usuário mudou a decisão para colocar a loja e o painel atuais em `alejoias.com` com o menor custo. Preparado Cloudflare Tunnel como conexão provisória ao servidor Node local em `127.0.0.1:4323`; backup SQLite consistente criado antes da abertura pública. Site de produção respondeu localmente em cinco rotas. Cloudflared foi baixado, mas túnel e DNS ainda não foram configurados. A alternativa “Em breve” não foi publicada.
Na continuação, o túnel remoto `alejoias-local` foi criado na conta Cloudflare. Conector ainda não instalado, sem rota pública ou DNS.
O conector `cloudflared` foi iniciado como processo local e exibiu estado íntegro. A instalação como serviço Windows falhou por falta de acesso ao gerenciador de serviços. Após confirmação específica do usuário para exposição pública, a rota `alejoias.com` foi associada à origem `http://127.0.0.1:4323`; a Cloudflare criou CNAME automaticamente. HTTPS respondeu 200 na página inicial, catálogo e login administrativo. O banco real não recebeu registros de teste nesta validação; a alternativa “Em breve” não foi publicada. A disponibilidade depende do computador ligado e do processo local.
Criado iniciador na pasta Inicializar do usuário Windows; funcionará após login, mas ainda não foi testado por reinício. O script manual `scripts/start-public.ps1` foi testado com ambos os processos já ativos.

## 15/09/2026 — Correção de origem no pedido público
Usuário relatou “Origem inválida” na sacola. Reproduzido 403 no domínio com consulta de PDF sem ID. Configurado `security.allowedDomains` para `alejoias.com`, permitindo ao Astro reconstruir HTTPS encaminhado pelo Tunnel sem desabilitar CSRF. Check/build e regressão `tests/proxy-origin.cjs` passaram, incluindo pedido/PDF em banco exclusivo, origem externa bloqueada, cookie Secure e compartilhamento no navegador. Build anterior copiado para `backups/pre-correcao-origem-*`; produção reiniciada. Verificação pública final: sacola 200, consulta de PDF sem ID 404 com origem legítima e 403 com origem externa. Sem pedidos fictícios no banco real e sem envio de WhatsApp.

## 15/09/2026 — Preparação para publicação gratuita

Usuário definiu orçamento mensal zero e pediu preparar tudo. Implementado modo Cloudflare com build separado e D1, mantendo a execução Node/SQLite. Fotos são otimizadas para até 300 KB / 1.000 px e armazenadas no D1, com capacidade inicial de 100 MB. Evitados R2, KV e serviços de PDF com cobrança por uso. PDF e derivação PBKDF2 da senha passam a ocorrer no navegador na alternativa gratuita; o servidor mantém autorização, validação, snapshots, histórico, sessões e proteção de origem.

Preparado exportador local de SQLite/fotos para SQL D1 em diretório privado, com acesso administrativo novo e preservação de IDs, pedidos e histórico. Configuração remota permanece sem ID real e sem rotas do domínio. Documentados ativação, cotas, backup, restauração e corte sem perda de pedidos em `docs/PUBLICACAO_GRATUITA.md`.

Testes passaram em Node e workerd/D1 local: painel, upload, importação, promoções, desativação, revisão concorrente, pedidos idempotentes, links/PDF, compartilhamento simulado, troca de senha e revogação. PDF de três páginas revisado visualmente. Acrescentados CSP/no-transform à página privada para bloquear scripts externos e redirecionamento canônico de GET/HEAD de www. A configuração DNS de www ainda depende da ativação remota. A medição de CPU no plano gratuito e o teste com PC desligado ficam para a publicação real.

Usuário solicitou documentação e commit de todas as alterações. Encontrado commit `c4a1e3d` com a preparação inicial; preservado para receber a continuação em novo commit. Não houve envio real de WhatsApp, publicação do Worker, importação de clientes na nuvem, troca de DNS nem alteração do aplicativo Android.

Conclusão da revisão: teste final também cobriu foto migrada, exportação SQL do D1 local e restauração com integridade preservada. Simulação de deploy aprovada, aproximadamente 168 KB gzip e somente bindings DB/ASSETS. Check: 50 arquivos, zero erros, avisos ou hints. Documentação de contexto, arquitetura, desenvolvimento, catálogo, testes e publicação atualizada.

## 15/09/2026 — Produtos com medida padrão

Usuário informou que as medidas são padrão e o campo não faz sentido. Ocultado o seletor na página de produtos com uma única opção; a sacola também omite essa opção. Produtos com mais de uma alternativa continuam selecionáveis. Preservados cadastro, variante interna, validação e snapshots antigos. Check, builds Node/Cloudflare e regressão de painel/sacola/PDF passaram. Verificação em navegador mobile confirmou ausência do seletor, adição e sacola sem medida provisória. Build anterior guardado em backups/pre-opcao-padrao-* e servidor publicado reiniciado com o ajuste.


## Configuração remota D1 — 24/09/2026

Usuário forneceu captura do banco remoto alejoias-loja com ID b71e9298-e0d5-44b9-8d15-bb5dfd56efbe e zero tabelas. wrangler.jsonc atualizado localmente com esse ID e nome do Worker alejoiassite, mantendo binding DB. Isso substitui as menções anteriores ao ID placeholder. Schema, importação real, deploy e corte do domínio ainda não executados. Configuração JSON validada; alterações ainda não enviadas ao GitHub nesta etapa.

## Worker e D1 publicados para validação — 24/09/2026

Executada, por autorização do usuário, a migração inicial para D1 alejoias-loja (b71e9298-e0d5-44b9-8d15-bb5dfd56efbe). Destino conferido vazio antes da aplicação de 0001_store.sql. Importados 26 produtos (23 publicados), 35 históricos de produtos, 9 solicitações e 9 históricos de solicitações. Não havia uploads locais; fotos estáticas acompanham o build. Origem preservada e import.sql/acesso-admin.txt privados em .data/cloudflare-migration-1790288322003.

Worker alejoiassite publicado em https://alejoiassite.rgcarraro.workers.dev, versão de4b3e5b-244d-4b44-99c0-c3f965c4b56b. Validação remota aprovou cinco rotas, 23 fotos, catálogo público, login/cookie Secure, 26 cadastros administrativos, bloqueio de acesso anônimo e de origem externa e seis snapshots de PDFs existentes com token, comparados com a origem. Não foram criados pedidos fictícios no banco real. A renderização e os fluxos de escrita continuam cobertos pelos testes locais anteriores; ainda falta medir CPU e testar os fluxos completos em homologação remota antes do corte.

Três caminhos antigos de fotos ainda eram usados pelo banco migrado; adicionadas cópias estáticas compatíveis para pulseira-madreperola-geometrica.jpg, brinco-argola-cristais.jpg e brinco-perola-pendente.jpg, preservando os cadastros e os PDFs históricos.

O domínio alejoias.com continua no Tunnel/PC. Esta é uma cópia inicial: novas gravações no PC não são sincronizadas com D1. Antes de trocar o domínio, interromper gravações e reconciliar ou migrar uma cópia final em destino vazio; não reaplicar import.sql sobre este D1 preenchido. Evitar cadastrar pedidos ou alterar produtos no Worker de validação até definir o corte.

Nenhum plano foi contratado. A consulta de assinaturas retornou 403 por permissão insuficiente; o plano vigente ainda deve ser conferido no painel. Backup remoto autorizado explicitamente pelo usuário e concluído em 24/09/2026: .data/cloudflare-migration-1790288322003/remote-backup-20260924-192631.sql (66.990 bytes), ignorado pelo Git. Restauração em SQLite em memória aprovada com integrity_check=ok, 26 produtos, 35 históricos de produtos, 9 solicitações e 9 históricos de solicitações. A cópia de migração local continua preservada.
## Validação de homologação — 24/09, registrada em 25/09/2026

Criados Worker e D1 separados alejoias-qa-20260924, banco 03e37da3-88b4-4468-b1f8-ece5f5e192af, somente com dados fictícios. Testes remotos passaram: autenticação, CSRF, edição concorrente, promoções, inativos, importação, exportação, upload, painel mobile, solicitação idempotente, snapshot, compartilhamento simulado, download/PDF multipágina e troca de senha com revogação. Importações de 25 e 500 produtos fictícios também passaram. Nenhuma mensagem real enviada e nenhum pedido fictício adicionado ao banco da loja. Recursos de QA permanecem separados para investigação; não apontar o domínio para eles.

CPU observada via tail do QA: catálogo até 15 ms, criação de solicitação até 14 ms, prévia de importação até 17 ms e aplicação até 29 ms. Nenhuma execução observada terminou com erro, mas exceder 10 ms impede afirmar adequação garantida ao Workers Free. Confirmar plano atual no painel e decidir entre otimização adicional ou Workers Paid antes do corte; nenhum upgrade foi contratado.

Comparação restrita entre origem e D1 real: contagens, datas máximas e tamanhos agregados coincidem para produtos (26), histórico (35), solicitações (9) e histórico das solicitações (9). Não houve sinal de divergência nesses indicadores; isso não comprova igualdade campo a campo. A revisão automática bloqueou a consulta completa de registros; usada a alternativa agregada sem baixar dados pessoais. Repetir conferência na janela final de corte.

Versão real conferida b6fddf4f-b63b-467e-9729-dd05f036fd78, posterior aos pushes, com bindings DB correto e ASSETS. Catálogo real com 23 produtos e 23 fotos OK; Worker e domínio atual responderam 200, API administrativa sem sessão 401. A lista de deployments mostra publicações posteriores aos pushes, mas a configuração exata do build automático e seu log ainda precisam ser conferidos no painel.

Corrigido tests/cloudflare.cjs: exportação de backup local agora utiliza o mesmo database_id do build, em vez de zeros fixos. Suíte Cloudflare local completa passou, incluindo backup/restauração, após o ajuste. Artefatos privados de homologação em .data/qa-remote-20260924 e .data/cloudflare-migration-1790289197153. Domínio não alterado. Pendem plano/CPU, conferência final dos dados com gravações interrompidas e teste final no domínio após corte; validação no celular real do usuário continua recomendada.
## Workers Paid e limite de CPU — 25/09/2026

Usuário informou contratação do Workers Paid (US$ 5/mês + uso) e pediu nova tentativa. Definido limits.cpu_ms=100 no wrangler.jsonc: margem sobre o pico de 29 ms medido na homologação, sem representar teto de cobrança mensal. Build Cloudflare e deploy aprovados, versão e4d59bac-7119-4550-83d5-d5fa1b1312fc. A Cloudflare aceitou a configuração de CPU; nenhuma assinatura foi alterada pelo agente.

Teste após deploy: cinco rotas responderam 200, catálogo com 23 produtos e todas as 23 fotos acessíveis, API administrativa sem sessão 401 e origem externa bloqueada com 403. Nenhum pedido de teste criado. Domínio ainda no Tunnel/PC. Pendem janela de corte com conferência final dos dados, associação do domínio ao Worker e verificação HTTPS/PDF no domínio com origem local desligada. A decisão anterior de orçamento mensal zero foi substituída pela contratação informada pelo usuário.
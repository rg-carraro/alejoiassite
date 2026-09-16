# Contexto atual — AleJoias Site

## Estado das notas em 16/09/2026

O Django em `../alejoias` usa PostgreSQL 17 local com histórico importado, sugestões de peças e troca da própria senha. `scripts/start-public.ps1` inicia notas, loja e Tunnel no mesmo PC. A loja responde em `https://alejoias.com/` e o teste local das notas usa `http://127.0.0.1:8009/entrar/`. A rota pública `notas.alejoias.com` ainda não foi criada; `PUBLIC_NOTAS_URL` e o link no admin continuam inativos. Roteiro de teste em `docs/ROTEIRO_TESTES.md` e operação em `../alejoias/docs/NOTAS_WEB.md`.

## Sistema de notas independente — preparação

O projeto Django de notas de consignação foi iniciado em `C:\Users\rgcar\git\alejoias`, separado do site e do aplicativo Android. O admin Astro mostra “Notas e devoluções” somente quando `PUBLIC_NOTAS_URL` estiver definido no build. A URL deve apontar para o Django publicado e testado, por exemplo `https://notas.alejoias.com/`; os dois sistemas usam logins e bancos separados. O link ainda não está ativo na publicação atual. O servidor PostgreSQL legado 9.5 não atende aos requisitos do Django 5.2; preparar banco novo e isolado antes de ativar a rota. Detalhes operacionais em `alejoias/docs/NOTAS_WEB.md`.

Atualizado em 15/09/2026. Estado: loja publicada pelo PC via Tunnel; alternativa gratuita Workers/D1 preparada e validada localmente, ainda sem ativação remota.

## Decisão vigente de hospedagem

Produtos com uma única opção padrão não exibem seletor de medida/opção na página nem repetem essa opção na sacola. Produtos com alternativas reais mantêm o seletor. O valor interno, a validação do servidor e os pedidos antigos são preservados (15/09/2026).

- Usuário escolheu orçamento mensal zero e pediu preparar a publicação gratuita. Implementados dois modos de execução, preservando Astro + TypeScript e a loja atual.
- `pnpm build` continua gerando Node em `dist/`. `pnpm build:cloudflare` gera Workers em `dist-cloudflare/`, com D1 para catálogo, solicitações, histórico, sessões e fotos. Não usa R2, KV ou serviços pagos de PDF.
- Fotos novas são otimizadas no navegador para JPEG de até 300 KB / 1.000 px. O D1 limita fotos a 100 MB inicialmente, sem apagar arquivos automaticamente. Originais locais permanecem no PC.
- Na nuvem, PDF é montado por pdf-lib no navegador a partir de snapshot autorizado. No Node, continua PDFKit/Sharp. A autenticação remota usa PBKDF2-SHA256/600 mil iterações no navegador, com outro hash no servidor; sessões e controle de origem continuam protegidos.
- Migração é preparada por `scripts/prepare-cloudflare-data.mjs`, com origem SQLite somente leitura, IDs/histórico/tokens preservados, fotos otimizadas e nova senha administrativa privada. Não migra sessões nem reescreve links antigos.
- Procedimento completo: [PUBLICACAO_GRATUITA.md](PUBLICACAO_GRATUITA.md). O ID do banco em `wrangler.jsonc` ainda é um placeholder. Nenhum Worker/D1 real foi criado nesta preparação e o domínio não foi trocado.
- Check, builds, fluxos Node/Cloudflare, concorrência, senha, PDF e compartilhamento foram testados em bancos fictícios. O PDF de três páginas foi revisado visualmente. CPU/cotas do plano gratuito precisam ser verificadas no serviço remoto antes do corte definitivo.
- Usuário pediu documentar e commitar tudo. O commit `c4a1e3d` já contém a preparação inicial; a revisão final e a documentação são uma continuação, sem reescrever esse commit.

As seções cronológicas abaixo preservam decisões anteriores; esta seção e as decisões mais recentes prevalecem sobre menções antigas à hospedagem e ao formato da mensagem.

## Projeto e continuidade
- Pasta oficial: C:\Users\rgcar\git\alejoiassite.
- Repositório: https://github.com/rg-carraro/alejoiassite.git; branch master.
- Pasta anterior alejoiassite_old é somente recuperação.
- Domínio confirmado pelo usuário: alejoias.com, administrado na Cloudflare. Em 14/09, a loja local atual foi publicada pelo Cloudflare Tunnel `alejoias-local` para o servidor de produção em `127.0.0.1:4323`, com backup prévio. HTTPS respondeu 200 na loja, catálogo e login; a disponibilidade depende deste computador. Procedimento em `docs/CLOUDFLARE.md`.
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
- A lista de produtos e o formulário de edição mostram a mesma miniatura de 60 × 60 px da foto cadastrada; produtos sem imagem mostram “Sem foto”. A prévia acompanha mudanças no caminho ou novo upload.
- Habilitado controla publicação; disponível controla solicitação. Desativar não apaga e permite reativar. Histórico registra antes/depois, data, origem e responsável administrativo.
- Importação CSV/JSON até 500 registros/1 MB com prévia, validação, transação e conciliação por código. Existentes preservados por padrão; atualização explícita sobrescreve apenas campos fornecidos. Campos vazios não apagam. Modelo em public/modelo-produtos.csv.
- Painel de solicitações com nome, telefone, itens, valores e situação (nova, em atendimento, concluída, cancelada).
- Upload JPEG/PNG/WebP até 5 MB. Exportação JSON do catálogo; não inclui fotos, contatos ou histórico.
- Rascunho de descrição pelo nome é recurso determinístico; não há serviço de IA integrado ao painel. Codex auxilia descrições/importações pelas skills.

## Tecnologia e dados
- Astro + TypeScript, pnpm com lockfile. React aprovado quando necessário, mas ainda não utilizado.
- Ambiente validado com Node 24.19.0 e TypeScript 6. TypeScript 7 apresentou incompatibilidade com astro check.
- Adapter Node e SQLite local em src/server/store.ts; alternativa Cloudflare/D1 em src/server/cloudflare. Ambos usam validação comum de produtos. Cada modo possui build separado.
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
3. Ativar e validar a alternativa gratuita Workers/D1, importar a cópia final dos dados e trocar o domínio. A publicação atual ainda usa o túnel local.
4. Definir conteúdo comercial, entrega, políticas e requisitos de produção antes do lançamento.
5. Pagamento online e integração com Android são futuras decisões, sem implementação atual.

Documentar resultados e decisões de novos testes; não recriar a base nem tratar recursos concluídos como pendências.

## Adaptação ao celular
Usuário pediu identificação do dispositivo e ajuste de tela. Implementada adaptação por largura disponível e capacidade de toque (CSS media queries), sem rastrear aparelho nem depender de user-agent. Loja: navegação, botões, filtros, sacola e campos ajustados. Painel: produtos viram cartões em telas estreitas, editor se adapta à altura visível e campos usam fonte de 16px. Desktop preservado. Testes passaram em oito rotas nas larguras 320/360/390/768/1440px, sem overflow da página, sem erros JavaScript e com editor dentro da tela. Capturas mobile da loja e painel revisadas em banco isolado. Check e build passaram antes da interrupção; retomada concluiu revisão visual e documentação.

## Mensagem simplificada — decisão mais recente
Usuário pediu somente Produto | Valor. A tabela agora usa texto simples, sem bloco de crases ou títulos com asteriscos; quantidade (quando maior que um) e opção ficam na coluna Produto, e Valor é o total da linha. Removidas da nova mensagem as frases sobre peças/preços demonstrativos e sobre não ser compra/reserva, conforme solicitado. Nome, telefone, identificador da solicitação, subtotal e observação permanecem. Regras do backend e avisos no site não mudam; solicitações antigas preservam seu texto original.

## Bordas alinhadas da tabela WhatsApp
Usuário solicitou alinhar as barras verticais como bordas. Mantidas duas colunas Produto e Valor, agora preenchidas com espaços e envolvidas em bloco monoespaçado do WhatsApp. Nomes longos continuam na linha seguinte sem truncamento; valores ficam à direita. Prévia na sacola também usa fonte monoespaçada. Substitui a decisão anterior de usar texto sem bloco. Teste verificou posições idênticas das barras em todas as linhas.

Mensagem WhatsApp: opções provisórias contendo 'a confirmar' (como Composição, Tamanho ou Medida a confirmar) não são mais exibidas na tabela, a pedido do usuário. Opções reais permanecem; cadastro e snapshot interno não são alterados.

## PDF da seleção com fotos — 11/09/2026
- Na sacola, “Preparar pedido com PDF” registra a solicitação validada e prepara o documento. Depois aparecem download, abertura da conversa e, em navegadores compatíveis, compartilhamento do arquivo.
- PDF contém foto, produto/código/opção real/quantidade, valor total da linha, subtotal, nome, telefone, data e observação. Opções provisórias “a confirmar” são omitidas na apresentação. Tabela de texto do WhatsApp permanece Produto | Valor.
- Abrir wa.me não anexa arquivos. Compartilhamento nativo permite escolher WhatsApp e contato; alguns destinos podem omitir o texto, então “Copiar resumo” permanece disponível. Alternativa universal: baixar PDF, abrir conversa e anexar como Documento.
- Painel de solicitações permite baixar o mesmo resumo por registro. PDFs antigos sem referência de foto mostram “Foto não disponível”, sem buscar uma imagem atual que possa pertencer a outra versão do produto.
- PDF gerado sob demanda com PDFKit e Sharp; acesso exige sessão administrativa ou token aleatório privado da solicitação, enviado no corpo POST. Não publicar tokens, PDFs de clientes nem banco no Git.
- Novas solicitações preservam o caminho da imagem junto aos itens. Manter os arquivos originais: trocar foto no painel cria outro arquivo. O PDF não é arquivado como arquivo separado, e fotos removidas fisicamente deixam de aparecer.
- Editar a sacola ou os dados invalida o arquivo preparado. Se a geração falhar, registro permanece e pode ser reutilizado por idempotência; conversa continua disponível.
- Ainda depende de Node local. A migração futura para Cloudflare deverá considerar também a geração de PDF e conversão de imagens.

## 11/09/2026 — WhatsApp somente com link
Decisão vigente: novas mensagens do WhatsApp contêm somente o link individual do PDF, sem tabela, nome, telefone ou subtotal no texto. Esses dados permanecem no documento e no registro interno. Mensagens já registradas são preservadas.
A rota /pedido/pdf recebe ID e token no fragmento (#) do link, que não é enviado na requisição da página; o navegador consulta o PDF por POST. Quem possui o link completo pode baixar o documento, sem login administrativo. Página sem indexação e sem envio de referência; não adicionar analytics nela.
A URL usa a origem real do site que registrou a solicitação. Links localhost funcionam somente no computador do servidor; links de rede local exigem acesso à mesma rede/servidor. Para compartilhar pela internet, publicar o site e criar a solicitação no endereço público. Não substituir localhost pelo domínio antes de existir hospedagem com acesso ao mesmo banco.
Sacola exibe o link no resumo após preparar e permite copiá-lo. Download e compartilhamento do arquivo continuam opcionais.

## 15/09/2026 — Origem HTTPS pelo Tunnel
Corrigido “Origem inválida” ao preparar pedido no domínio: `security.allowedDomains` do Astro reconhece o domínio exato `alejoias.com` e o protocolo encaminhado pelo proxy. A comparação estrita de Origin na API continua ativa; links novos de PDF preservam HTTPS e cookies administrativos usam Secure no domínio. Check e builds passaram. `tests/proxy-origin.cjs` usa build e banco isolados, testa origem local/pública, bloqueio de origem e host externos, geração de pedido/PDF, cookie e fluxo de compartilhamento no navegador. Correção aplicada ao servidor publicado, com backup do build anterior. Consulta pública sem ID passou a retornar 404 (PDF inexistente), enquanto origem externa continua 403; nenhum pedido de teste foi criado no banco real.

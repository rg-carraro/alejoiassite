# Publicação gratuita — preparação e operação

Atualizado em 24/09/2026. **Worker publicado para validação em https://alejoiassite.rgcarraro.workers.dev, com cópia inicial dos dados no D1. O corte do domínio ainda não foi feito.** O domínio continua atendido pelo Node deste PC via Tunnel. O commit de código não troca o domínio nem transfere o banco.

## Arquitetura preparada

| Parte | Windows / publicação atual | Versão gratuita preparada |
| --- | --- | --- |
| Site | Astro + adapter Node | Astro + adapter Cloudflare / Workers |
| Catálogo, solicitações e histórico | SQLite em `.data` | D1, mantendo IDs e snapshots |
| Fotos enviadas | Arquivos em `.data/uploads` | Imagens JPEG no D1, servidas por `/media` |
| PDF | PDFKit + Sharp no servidor | pdf-lib no navegador, com snapshot autorizado |
| Senha | scrypt no Node | PBKDF2-SHA256 no navegador e verificador SHA256 no D1 |
| Sessões administrativas | SQLite | D1; cookie HttpOnly / SameSite Strict / Secure em HTTPS |

Não são usados R2, KV, Images, Durable Objects ou serviços externos de PDF. A configuração não ativa plano pago. É necessário confirmar que a conta está em **Workers Free** antes de publicar: a franquia gratuita de um serviço pago não equivale a custo máximo zero.

Referências consultadas em 15/09/2026: [Workers Free](https://developers.cloudflare.com/workers/platform/pricing/), [limites do D1](https://developers.cloudflare.com/d1/platform/limits/) e [preços do D1](https://developers.cloudflare.com/d1/platform/pricing/). Atualmente há limite de 100 mil requisições/dia e 10 ms de CPU por execução de Worker; cada banco D1 gratuito tem até 500 MB. As cotas são compartilhadas com outros projetos da conta. Ao esgotar cotas gratuitas, o serviço pode ficar indisponível; esta preparação não promete capacidade ilimitada. A renovação anual de `alejoias.com` permanece separada.

## Limites e diferenças de comportamento

- O seletor aceita JPEG/PNG/WebP de até 5 MB. O navegador reduz a maior dimensão para até 1.000 pixels e converte para JPEG de até 300 KB. Isso também vale para novos uploads no painel local. Os arquivos antigos locais não são modificados.
- Fotos migradas mantêm seus caminhos, inclusive os usados por solicitações antigas, mas são otimizadas na cópia da nuvem. Guarde os originais no backup local.
- O conjunto de fotos no D1 tem limite inicial de 100 MB imposto pelo banco. Novos uploads são recusados quando ultrapassam esse limite; nenhuma foto é apagada automaticamente. Os demais dados também ocupam o banco.
- Na nuvem, `POST /api/request-pdf` retorna JSON privado com `format: alejoias-pdf-snapshot-v1`. Sacola, painel e página do destinatário transformam esse snapshot em PDF no navegador. No Node, a API continua devolvendo PDF binário. Integrações externas precisam considerar essa diferença.
- Nome, telefone, itens, valores, opções reais, data, observação e fotos permanecem no documento. Opções “a confirmar” são omitidas somente na apresentação. O documento usa os itens do registro, nunca os dados atuais de outro produto.
- PDFs não são arquivados como arquivos separados. O destinatário precisa de JavaScript habilitado para gerá-los. O link continua privado por posse do token e funciona sem login administrativo.
- A página `/pedido/pdf` usa `no-store`, `no-transform`, `no-referrer`, noindex e CSP que bloqueia scripts/conexões externos. Não habilitar analytics nela.
- A nuvem usa um novo acesso administrativo, gerado na preparação, sem copiar as sessões do PC. PBKDF2-SHA256 com 600 mil iterações ocorre no navegador; o servidor armazena SHA256 do resultado derivado, não o resultado usado no login. O sal é público, a prova derivada é secreta e trafega somente em HTTPS. Nenhuma dessas provas deve ser registrada em logs. Trocar a senha revoga as sessões.
- Os lotes de importação continuam limitados a 500 produtos / 1 MB, com prévia e aplicação atômica. O consumo real de CPU, especialmente em lotes grandes, precisa ser medido no Worker remoto antes da troca do domínio. Os testes locais não impõem o limite remoto de 10 ms.

## Comandos locais

Usar Node 24 e pnpm 11.19.0. O inicializador Windows continua disponível e não foi convertido para Cloudflare. Para um terminal sem Node/pnpm no PATH, usar o bootstrap documentado em [DESENVOLVIMENTO.md](DESENVOLVIMENTO.md).

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build:cloudflare
pnpm test:cloudflare
```

`build:cloudflare` gera `dist-cloudflare/` e não substitui `dist/`, usado pela publicação atual. `test:cloudflare` exige a porta 4322 livre, prepara banco fictício novo, executa o emulador, testa e encerra somente seus processos. Artefatos privados ficam em `.data/qa-cloudflare-*` e `.data/cloudflare-migration-*`.

O arquivo `wrangler.jsonc` usa o Worker `alejoiassite` e o D1 `alejoias-loja`, ID `b71e9298-e0d5-44b9-8d15-bb5dfd56efbe`. O banco remoto já recebeu schema e a cópia inicial. Testes devem continuar usando exclusivamente `--local` e dados fictícios.

Simular o pacote, sem publicação:

```sh
pnpm exec wrangler deploy --dry-run --config dist-cloudflare/server/wrangler.json --outdir .data/cloudflare-dry-run
```

## Preparar os dados reais

```sh
node scripts/prepare-cloudflare-data.mjs .data
```

O comando abre o SQLite de origem somente para leitura e usa uma transação para obter uma visão consistente das tabelas. Cria uma pasta privada nova e informa apenas caminho e contagens:

- `import.sql`: produtos, histórico, solicitações, histórico de solicitações, fotos otimizadas e configuração administrativa inicial;
- `acesso-admin.txt`: nova senha inicial da nuvem;
- `summary.json`: contagens, tamanho das fotos e data da preparação.

Não modifica banco nem fotos de origem, não envia dados à internet e não exibe a senha. IDs, tokens e textos dos pedidos existentes são preservados. Links antigos com origem localhost continuam locais; o script não reescreve pedidos antigos. Fotos ausentes na origem continuam ausentes, com indicação no PDF.

Importar apenas em **banco de destino vazio**, depois de aplicar o schema. O SQL contém uma verificação para recusar reutilização sobre dados já importados. Se uma importação remota falhar, conferir o destino antes de continuar; não presumir rollback de um arquivo SQL inteiro. Preferir novo banco vazio para repetir. Não apagar ou reinicializar o banco do PC.

## Ativação na conta Cloudflare — pendente

1. Entrar na conta correta (`pnpm exec wrangler login`) e confirmar Workers Free. Não contratar upgrade, R2 ou serviços adicionais.
2. Criar o banco: `pnpm exec wrangler d1 create alejoias-loja`. Inserir o `database_id` retornado em `wrangler.jsonc`; o ID não é uma senha.
3. Aplicar schema remoto: `pnpm exec wrangler d1 migrations apply alejoias-loja --remote --config wrangler.jsonc`.
4. Importar a cópia privada revisada: `pnpm exec wrangler d1 execute alejoias-loja --remote --config wrangler.jsonc --file .data/cloudflare-migration-PASTA/import.sql`. Substituir PASTA pelo diretório correto.
5. Executar `pnpm build:cloudflare` novamente para incorporar o ID real.
6. Publicar primeiro no endereço Workers: `pnpm exec wrangler deploy --config dist-cloudflare/server/wrangler.json`.
7. Conferir login, catálogo, fotos, pedido, PDF e links em um navegador sem login. Usar banco de homologação e dados fictícios para testes que escrevem. Verificar métricas de CPU e erros 1102; testar importação representativa do catálogo antes de considerar o plano gratuito adequado.
8. Antes do corte definitivo, interromper temporariamente novas gravações na origem, guardar backup completo e gerar uma cópia final. Importar essa cópia em destino vazio. Essa janela evita perder pedidos recebidos no PC depois da primeira exportação.
9. Associar `alejoias.com` e `www.alejoias.com` ao Worker, substituindo a rota do Tunnel após validação. O middleware redireciona GET/HEAD com `www` para HTTPS sem `www`. Preservar registros de e-mail.
10. Confirmar HTTPS, novo pedido/PDF, login e redirecionamento externo; só então desligar o conector antigo. Testar acesso com o PC desligado e trocar a senha inicial da nuvem.

Recursos remotos, schema, importação inicial e deploy executados em 24/09/2026. Os passos acima são o procedimento de referência, não comandos para repetir sobre o banco preenchido. A troca de domínio e a cópia final ainda estão pendentes.

## Backup e retorno

O D1 oferece recuperação automática de até sete dias no plano gratuito por [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/). Essa proteção não substitui uma cópia externa sob controle do usuário.

```sh
pnpm exec wrangler d1 export alejoias-loja --remote --config wrangler.jsonc --output backups/alejoias-DATA.sql
```

Criar previamente a pasta `backups` e usar um nome novo com a data real. Esse SQL inclui também as fotos armazenadas no D1, contatos e verificadores de acesso. Guardar em local privado, fora do Git. A exportação JSON do painel continua sendo apenas do catálogo.

Para retornar ao PC antes de receber novas gravações na nuvem, restaurar a rota do Tunnel e iniciar a origem preservada. Depois de receber novas gravações remotas, exportar e reconciliar esses dados antes de voltar: simplesmente trocar o DNS pode perder pedidos. O SQL D1 não deve ser aplicado diretamente sobre o SQLite ativo do Node; os formatos de autenticação e armazenamento das fotos diferem.

## Verificação realizada

- Check de Astro/TypeScript e builds Node/Cloudflare.
- Emulador workerd + D1 local com migração de dados fictícios.
- Login, CSRF, revisão concorrente, promoção, inativos, histórico, importação, exportação, upload e edição pelo painel.
- Idempotência concorrente, revalidação de subtotal e snapshot do pedido.
- Link privado, rejeição de token incorreto, download, compartilhamento simulado e invalidação após edição.
- Mudança de senha com rejeição da antiga e revogação da sessão.
- PDF de três páginas com nomes longos, fotos, valores e observação, renderizado e revisado visualmente.
- Regressão do modo Node e da origem HTTPS pelo Tunnel em banco isolado.
- Foto migrada e upload novo recuperados do D1; backup SQL exportado e restaurado em SQLite separado, com verificação de integridade.
- Simulação `wrangler deploy --dry-run` concluída: pacote de aproximadamente 168 KB comprimidos, com apenas bindings DB e ASSETS. Não houve publicação.

Não houve envio real pelo WhatsApp. A compatibilidade do compartilhamento com WhatsApp no aparelho do usuário e o consumo real do plano remoto ainda exigem validação após ativação.

## Worker e D1 publicados para validação — 24/09/2026

Executada, por autorização do usuário, a migração inicial para D1 alejoias-loja (b71e9298-e0d5-44b9-8d15-bb5dfd56efbe). Destino conferido vazio antes da aplicação de 0001_store.sql. Importados 26 produtos (23 publicados), 35 históricos de produtos, 9 solicitações e 9 históricos de solicitações. Não havia uploads locais; fotos estáticas acompanham o build. Origem preservada e import.sql/acesso-admin.txt privados em .data/cloudflare-migration-1790288322003.

Worker alejoiassite publicado em https://alejoiassite.rgcarraro.workers.dev, versão de4b3e5b-244d-4b44-99c0-c3f965c4b56b. Validação remota aprovou cinco rotas, 23 fotos, catálogo público, login/cookie Secure, 26 cadastros administrativos, bloqueio de acesso anônimo e de origem externa e seis snapshots de PDFs existentes com token, comparados com a origem. Não foram criados pedidos fictícios no banco real. A renderização e os fluxos de escrita continuam cobertos pelos testes locais anteriores; ainda falta medir CPU e testar os fluxos completos em homologação remota antes do corte.

Três caminhos antigos de fotos ainda eram usados pelo banco migrado; adicionadas cópias estáticas compatíveis para pulseira-madreperola-geometrica.jpg, brinco-argola-cristais.jpg e brinco-perola-pendente.jpg, preservando os cadastros e os PDFs históricos.

O domínio alejoias.com continua no Tunnel/PC. Esta é uma cópia inicial: novas gravações no PC não são sincronizadas com D1. Antes de trocar o domínio, interromper gravações e reconciliar ou migrar uma cópia final em destino vazio; não reaplicar import.sql sobre este D1 preenchido. Evitar cadastrar pedidos ou alterar produtos no Worker de validação até definir o corte.

Nenhum plano foi contratado. A consulta de assinaturas retornou 403 por permissão insuficiente; o plano vigente ainda deve ser conferido no painel. Backup remoto autorizado explicitamente pelo usuário e concluído em 24/09/2026: .data/cloudflare-migration-1790288322003/remote-backup-20260924-192631.sql (66.990 bytes), ignorado pelo Git. Restauração em SQLite em memória aprovada com integrity_check=ok, 26 produtos, 35 históricos de produtos, 9 solicitações e 9 históricos de solicitações. A cópia de migração local continua preservada.

## Build integrado ao GitHub

No Worker, Settings > Build: branch master, raiz do repositório, build command pnpm build:cloudflare e deploy command pnpm exec wrangler deploy --config dist-cloudflare/server/wrangler.json. Variáveis NODE_VERSION=24.19.0 e PNPM_VERSION=11.19.0. A publicação desta rodada foi feita por CLI; as configurações do build automático no painel ainda precisam ser verificadas. Não incluir SQL privado ou senha no Git.

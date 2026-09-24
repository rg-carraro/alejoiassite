# Desenvolvimento e uso local

## Iniciar com dois cliques
Abra `iniciar-dev.bat` na raiz do projeto. Ele configura Node/pnpm do runtime Codex na sessão, confere as dependências pelo lockfile e abre o navegador. Se AleJoias já estiver na porta 4321, apenas abre o site existente.

Mantenha a janela aberta enquanto usa o ambiente. Ctrl+C encerra o servidor. O script não altera o PATH nem a política de execução de forma permanente. `iniciar-site.ps1` continua disponível e chama o mesmo inicializador.

- Loja: http://localhost:4321/
- Painel: http://localhost:4321/admin
- Senha inicial: arquivo privado `.data/acesso-admin.txt`, criado no primeiro acesso ao servidor.
- Troque a senha na seção Senha do painel; isso encerra as sessões e remove o arquivo da senha inicial.

## Ambiente atual
Astro + TypeScript com adapter Node para execução local e banco SQLite exclusivo do site. Usar Node 24 LTS e pnpm 11.19.0. O runtime do Codex é localizado automaticamente pelo inicializador; fora dele, instalar Node/pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
```

O build padrão é de servidor Node: `node dist/server/entry.mjs` (HOST/PORT opcionais). A alternativa `pnpm build:cloudflare` seleciona o adapter Cloudflare e gera `dist-cloudflare/`, sem substituir `dist/`. Banco D1, fotos e PDFs da alternativa estão implementados; a ativação remota permanece pendente. Consulte [PUBLICACAO_GRATUITA.md](PUBLICACAO_GRATUITA.md). O aplicativo Android permanece independente.

Para verificar a versão gratuita: `pnpm check`, `pnpm build:cloudflare` e `pnpm test:cloudflare`. O teste cria seus próprios dados fictícios e exige a porta 4322 livre. Para regressão Node: `pnpm build --outDir .data/qa-origin-build` e `node tests/proxy-origin.cjs`. Ambos encerram os servidores de teste que iniciam.

Em terminal PowerShell sem o runtime no PATH, configurar apenas a sessão:

```powershell
$runtime = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies'
$env:Path = "$runtime\node\bin;$runtime\bin\fallback;$env:Path"
```

## Organização
- src/server/store.ts: SQLite, produtos, revisões, sessões e solicitações.
- src/server/importer.ts: CSV/JSON com prévia, conciliação por código e transação.
- src/pages/api: APIs; escrita administrativa exige sessão e origem válida.
- src/pages/admin e src/scripts/admin.ts: painel.
- src/data/products.ts: constantes públicas e lista de sementes vazia; novos bancos começam sem produtos.
- src/data/catalog.ts: contrato do produto e cálculo de promoção.
- src/scripts/shop.ts: sacola e fluxo de atendimento.
- public/images: referências estáticas; uploads novos ficam em .data/uploads e são servidos por /media.

## Dados e histórico
O banco ativo é `.data/alejoias-site.sqlite` (com arquivos WAL/SHM durante uso). Produtos e histórico ficam nele; não ficam no Git. `.data` e `backups` são ignorados. `ALEJOIAS_DATA_DIR` permite um banco separado, usado nos testes.

Para cópia local completa, pare o servidor e copie a pasta `.data` inteira para um local seguro. A exportação JSON no painel contém os produtos, mas não substitui cópia do banco e das imagens: não inclui histórico nem contatos. Não enviar cópias com contatos ou senhas ao GitHub.

## Testes
`tests/admin-integration.cjs` valida um servidor isolado na porta 4322 e banco `.data/qa-admin`. Nunca executar esses testes contra o banco da loja. O teste usa Playwright do runtime Codex e Microsoft Edge. Valida autenticação, CSRF, revisão concorrente, promoção, desativação, histórico, importação, upload, edição e solicitação com WhatsApp interceptado. Não envia mensagem real.

## Imagens de referência
Amostras originais em C:\Pessoal\AleJoias\Site. Imagens já copiadas para public/images acompanham o repositório. O catálogo de setembro já substituiu as amostras na vitrine. Fotos antigas são mantidas para PDFs históricos; novos produtos são geridos pelo painel ou importação.

## PDF e compartilhamento
Geração em src/server/order-pdf.ts, API POST /api/request-pdf, integração em shop.ts e admin.ts. PDFKit gera o documento; Sharp normaliza JPEG/PNG/WebP locais. Instalar dependências com pnpm install após atualizar. Nenhum Python é necessário para rodar o site.
A API exige sessão admin ou token retornado na criação da solicitação; respostas no-store. Fotos são lidas exclusivamente das pastas public/images e .data/uploads, sem acesso remoto. Manter cwd na raiz do projeto.
Testes: node tests/admin-integration.cjs, node tests/order-pdf.cjs e node tests/share-pdf.cjs, com servidor isolado em 127.0.0.1:4322 e ALEJOIAS_DATA_DIR=.data/qa-admin. Compartilhamento é simulado; nenhum envio real. PDF de teste e capturas ficam no banco de QA ignorado pelo Git.
Compartilhamento exige suporte do navegador e gesto da pessoa, conforme [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share). Download e abertura da conversa continuam disponíveis como alternativa.

### Link compartilhável

Regressão do Tunnel: `pnpm build --outDir .data/qa-origin-build` seguido de `node tests/proxy-origin.cjs`. O teste exige porta 4322 livre, inicia e encerra seu próprio servidor e cria banco exclusivo em `.data/qa-origin-*`. Confere HTTPS encaminhado, origem local, CSRF, link/PDF, cookie Secure e fluxo de compartilhamento no navegador. A configuração `security.allowedDomains` reconhece somente `alejoias.com`; manter a checagem estrita de Origin da API.
/pedido/pdf usa ID/token no fragmento e solicita o arquivo por POST /api/request-pdf. A origem é a URL da solicitação, não o domínio configurado em astro.config.mjs; manter compatível com ambiente local e futura hospedagem. Link confere acesso a quem o possui; não registrar fragmento/token em telemetria. Dados e textos antigos permanecem intactos no SQLite.

## Regressão após retirada das amostras

`pnpm build --outDir .data/qa-origin-build` e `node tests/proxy-origin.cjs` criam banco exclusivo, confirmam catálogo inicialmente vazio, cadastram fixtures pela API e executam painel, PDF, compartilhamento e responsividade. `QA_DATA_DIR` aponta todos os artefatos para esse banco. A suíte Cloudflare usa as mesmas fixtures, sem importar produtos da aplicação. Não executar os testes individuais contra o servidor da loja.

O lote de setembro já foi aplicado; não reaplicar `scripts/publish-september-catalog.mjs publish`. O script e o manifesto documentam a operação pontual. `prepare` depende dos originais locais ignorados em `produtos_cadastrar/`; as 23 imagens prontas acompanham o Git. Ajustes comerciais posteriores devem ser feitos pelo painel.

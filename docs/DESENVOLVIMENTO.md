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

O build atual é de servidor, não exportação estática. Para executá-lo: `node dist/server/entry.mjs` (HOST/PORT opcionais). Não publicar esse build diretamente em Cloudflare Workers: a etapa de publicação requer adapter Cloudflare, banco D1 e armazenamento de imagens apropriado, ainda não configurados. Domínio e aplicativo Android permanecem inalterados.

## Organização
- src/server/store.ts: SQLite, produtos, revisões, sessões e solicitações.
- src/server/importer.ts: CSV/JSON com prévia, conciliação por código e transação.
- src/pages/api: APIs; escrita administrativa exige sessão e origem válida.
- src/pages/admin e src/scripts/admin.ts: painel.
- src/data/products.ts: apenas sementes demonstrativas para banco vazio.
- src/data/catalog.ts: contrato do produto e cálculo de promoção.
- src/scripts/shop.ts: sacola e fluxo de atendimento.
- public/images: referências estáticas; uploads novos ficam em .data/uploads e são servidos por /media.

## Dados e histórico
O banco ativo é `.data/alejoias-site.sqlite` (com arquivos WAL/SHM durante uso). Produtos e histórico ficam nele; não ficam no Git. `.data` e `backups` são ignorados. `ALEJOIAS_DATA_DIR` permite um banco separado, usado nos testes.

Para cópia local completa, pare o servidor e copie a pasta `.data` inteira para um local seguro. A exportação JSON no painel contém os produtos, mas não substitui cópia do banco e das imagens: não inclui histórico nem contatos. Não enviar cópias com contatos ou senhas ao GitHub.

## Testes
`tests/admin-integration.cjs` valida um servidor isolado na porta 4322 e banco `.data/qa-admin`. Nunca executar esses testes contra o banco da loja. O teste usa Playwright do runtime Codex e Microsoft Edge. Valida autenticação, CSRF, revisão concorrente, promoção, desativação, histórico, importação, upload, edição e solicitação com WhatsApp interceptado. Não envia mensagem real.

## Imagens de referência
Amostras originais em C:\Pessoal\AleJoias\Site. Imagens já copiadas para public/images acompanham o repositório. Dados reais devem substituir as amostras pelo painel ou importação.

## PDF e compartilhamento
Geração em src/server/order-pdf.ts, API POST /api/request-pdf, integração em shop.ts e admin.ts. PDFKit gera o documento; Sharp normaliza JPEG/PNG/WebP locais. Instalar dependências com pnpm install após atualizar. Nenhum Python é necessário para rodar o site.
A API exige sessão admin ou token retornado na criação da solicitação; respostas no-store. Fotos são lidas exclusivamente das pastas public/images e .data/uploads, sem acesso remoto. Manter cwd na raiz do projeto.
Testes: node tests/admin-integration.cjs, node tests/order-pdf.cjs e node tests/share-pdf.cjs, com servidor isolado em 127.0.0.1:4322 e ALEJOIAS_DATA_DIR=.data/qa-admin. Compartilhamento é simulado; nenhum envio real. PDF de teste e capturas ficam no banco de QA ignorado pelo Git.
Compartilhamento exige suporte do navegador e gesto da pessoa, conforme [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share). Download e abertura da conversa continuam disponíveis como alternativa.

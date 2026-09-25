# Ale Carraro — primeira versão implantada (v1.0.0)

Entrega concluída em 25/09/2026. Loja: https://alejoias.com. Painel: https://alejoias.com/admin. Repositório: rg-carraro/alejoiassite, branch master, tag anotada v1.0.0.

## Escopo entregue
- Identidade Ale Carraro, layout responsivo em branco, preto e dourado.
- Logos PNG com transparência real; versão preta/dourada em superfícies claras e branca/dourada em superfícies pretas. Originais preservados em public/images/brand.
- Catálogo, categorias, busca, detalhes de produto, sacola, quantidades e atendimento por WhatsApp com link privado do PDF.
- Painel administrativo, preços e promoções, disponibilidade, importação, fotos e histórico.
- Cloudflare Worker alejoiassite com D1 alejoias-loja; domínio HTTPS e redirecionamento www. Operação independente do PC.

## Implantação e evidência
Código da aplicação: a7c9b60. A tag inclui a documentação de encerramento desse código, sem mudança adicional de comportamento.
Worker publicado diretamente por Wrangler: 566b5987-d0d7-4cee-a935-cad256d87ba1.
Comandos executados:

```powershell
pnpm build:cloudflare
pnpm exec wrangler deploy --config dist-cloudflare/server/wrangler.json
```

A conferência inicial após o push ainda mostrou HTML antigo. A publicação direta foi concluída e validada; não tratar apenas o push como prova de implantação. Para futuras alterações, conferir o build no painel e o conteúdo efetivo do domínio.

Após publicação: início, catálogo, sobre, sacola, atendimento e login HTTP 200; ambos os PNGs HTTP 200 e referenciados no HTML; 23 produtos públicos com fotos acessíveis; www retorna 308 preservando caminho e parâmetros.

Validação anterior do mesmo código: Astro check sem erros/avisos; builds Node e Cloudflare; regressões isoladas de autenticação, CSRF, catálogo, sacola, PDF e compartilhamento simulado; oito rotas em 320/360/390/768/1440 px. Captura mobile revisada. Nenhum pedido fictício ou mensagem WhatsApp real criado na produção nessa validação.

## Operação e recuperação
Editar o catálogo real pelo painel remoto. O SQLite local é histórico e não deve substituir D1. Credenciais e backups privados permanecem em .data, ignorada no Git. A tag versiona código/documentação/assets, não o banco comercial.
Consultar PROJECT_CONTEXT.md e CLOUDFLARE.md antes de alterar DNS: o CNAME existente do Tunnel ainda é necessário à resolução da rota Worker; não removê-lo isoladamente. Não alterar sistema de notas ou aplicativo Android.
Para recuperar código, selecionar uma versão anterior no painel Workers ou compilar um checkout isolado da tag desejada e publicar seu wrangler gerado. Isso não reverte os dados do D1; restaurar banco exige backup e reconciliação das solicitações novas.

## Limites conhecidos desta versão
Pagamento online e confirmação automática de compra não fazem parte da entrega. Enviar/abrir WhatsApp não confirma reserva ou pagamento. A indexação em buscadores permanece bloqueada pelo noindex existente; liberação de SEO fica como evolução separada. Conferência de aparência e compartilhamento no celular real da loja continua recomendada.

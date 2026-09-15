# Publicação no domínio AleJoias

## Decisão atual: publicar a loja local pelo Tunnel

O usuário mudou a preferência: quer a loja e o painel atuais no domínio com o menor custo de serviço. A aplicação continua em Node/SQLite neste computador. `scripts/start-live.ps1` inicia o build de produção em `127.0.0.1:4323`, separado do servidor de desenvolvimento. O Cloudflare Tunnel `alejoias-local` encaminha `alejoias.com` para essa porta. Não usar `astro dev` como origem pública. A disponibilidade depende de computador, servidor e conector ligados; banco e uploads continuam em `.data` local. O backup anterior à publicação está em `backups/pre-publicacao-2026-09-14`, fora do Git.

Estado em 14/09/2026: domínio ativo na conta Cloudflare; build de produção iniciado em `127.0.0.1:4323`; `cloudflared` 2026.9.1 em `.data/bin`; túnel remoto `alejoias-local` conectado e íntegro. Rota de aplicativo publicado `alejoias.com` criada com CNAME automático para o túnel. HTTPS público respondeu 200 em `/`, `/catalogo` e `/admin/login`. O painel exige login; fluxos com escrita não foram testados no banco real. O token privado fica em `.data/cloudflare-tunnel.token` e não deve entrar no Git, logs ou documentação.

Foi criado `AleJoias Publico.cmd` na pasta Inicializar do usuário Windows para iniciar servidor e conector ao entrar na conta. Para iniciar manualmente após reiniciar o computador, executar `scripts/start-public.ps1` no PowerShell; ele inicia ambos se ainda não estiverem ativos. O conector não foi instalado como serviço Windows porque a conta não teve acesso ao gerenciador de serviços. A inicialização automática depende de login do usuário e ainda não foi validada por um reinício. Se falhar, executar o script manualmente. O computador deve permanecer ligado, conectado e sem suspensão; se o servidor ou túnel parar, o domínio ficará indisponível. Para atualizar código publicado, executar `pnpm check`, `pnpm build` e reiniciar o processo Node de produção; o servidor de desenvolvimento na porta 4321 é independente.

## Alternativa preparada: página “Em breve”

A página está em `holding/` e usa apenas `index.html` e o logotipo. Ela não expõe o catálogo, o painel ou os dados locais. A configuração `wrangler-coming-soon.jsonc` publica esses dois arquivos como assets estáticos em um Worker separado. A simulação local passou com Wrangler 4.131.1.

Para publicar, entrar na conta Cloudflare que administra `alejoias.com` e executar na raiz do repositório:

```sh
pnpm dlx wrangler@4.131.1 login
pnpm dlx wrangler@4.131.1 deploy --config wrangler-coming-soon.jsonc
```

Depois de confirmar a URL `*.workers.dev`, associar `alejoias.com` ao Worker em **Workers & Pages → alejoias-em-breve → Settings → Domains & Routes → Add → Custom Domain**. Verificar também `www.alejoias.com` e decidir se deve redirecionar para o domínio principal. Não substituir registros de e-mail (MX, SPF, DKIM, DMARC) ao ajustar DNS.

## Hospedagem independente do computador (futura)

O aplicativo principal usa `@astrojs/node`, `node:sqlite`, `.data/uploads` e PDFKit/Sharp com acesso a arquivos locais. O Worker estático acima não hospeda essa aplicação. Para retirar a dependência deste computador, migrar banco e dados de autenticação/solicitações/histórico para armazenamento persistente, fotos para objeto ou disco persistente, adaptar o PDF e testar painel, importação, solicitação, links privados de PDF, backup e restauração em ambiente hospedado. Dados de `.data` não devem entrar no Git.

Quando a loja independente estiver validada, trocar a rota do domínio. A página “Em breve” foi preparada, mas não publicada.

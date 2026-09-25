# Publicação no domínio AleJoias

## Produção na Cloudflare — corte concluído em 25/09/2026

A loja https://alejoias.com agora usa Worker alejoiassite + D1 alejoias-loja, no Workers Paid informado pelo usuário, com CPU limitada a 100 ms por execução. www.alejoias.com redireciona para HTTPS sem www preservando caminho e query. A loja não depende mais do servidor Node deste PC. O sistema Django de notas e o aplicativo Android permanecem independentes e não foram migrados nesta operação.

Configuração efetiva: rota Worker alejoias.com/* na zona alejoias.com e Custom Domain www.alejoias.com. O Custom Domain do domínio raiz foi recusado por conflito com o registro DNS existente (100117); leitura/edição direta do DNS retornou 403 com a credencial disponível. Mantido o registro antigo do Tunnel e usada a rota oficial de Workers, que atende as requisições sem consultar a origem. NÃO apagar o CNAME existente nem excluir o Tunnel associado sem antes substituir o DNS: a rota exige resolução DNS. Registros de e-mail não foram alterados.

Backup privado pré-corte em .data/cutover-20260925: d1-before-cutover.sql e local-before-cutover.sqlite. Com a origem parada, comparação integral local entre o SQLite e o backup D1 confirmou igualdade de todos os campos das quatro tabelas: 26 produtos, 35 históricos, 9 solicitações e 9 históricos de solicitações. Nenhum dado comercial precisou de nova importação. Sessões/configuração administrativa são específicas de cada ambiente.

Versão de corte: 98cc3f80-ab43-4741-b6d7-a3f39c307d81. Validação no domínio definitivo: cinco rotas HTTPS 200, 23 produtos e 23 fotos públicas, 26 cadastros no admin, login Secure, CSRF e seis snapshots PDF com tokens existentes conferidos. www retorna 308; auth-config confirma modo pbkdf2-client-v1 do Worker; origem local 127.0.0.1:4323 desligada. Não foram criados pedidos fictícios no banco real. Geração/download dos PDFs e gravações foram testados na homologação remota na rodada anterior; avaliação final no celular real continua recomendada.

A senha administrativa da nuvem é a do arquivo privado .data/cloudflare-migration-1790288322003/acesso-admin.txt até o usuário trocá-la pelo painel. O SQLite local é uma cópia histórica; mudanças em iniciar-dev.bat não atualizam a loja pública. Gerir o catálogo real somente em https://alejoias.com/admin.

Criado marcador privado .data/cloudflare-active.json. scripts/start-live.ps1 respeita esse marcador e não reinicia a produção local automaticamente. -Recovery é reservado à recuperação planejada; nunca voltar ao SQLite sem reconciliar novas gravações recebidas no D1. Sintaxe PowerShell e execução do bloqueio de inicialização validadas. O conector do Tunnel foi preservado para recuperação/serviços independentes, mas o site foi comprovado sem a origem Node local.

## Histórico anterior ao corte (referência)

## 15/09/2026 — Versão gratuita preparada

O usuário escolheu custo mensal zero. A migração para Workers Free + D1 foi implementada e testada localmente, com fotos no D1 e PDFs gerados no navegador. Procedimentos, limites, backup e pendências estão em [PUBLICACAO_GRATUITA.md](PUBLICACAO_GRATUITA.md). O ID D1 remoto ainda é um placeholder e não houve troca de domínio. A publicação que continua ativa é o Tunnel descrito abaixo.

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

## Integração das notas de consignação (16/09/2026)

O iniciador `scripts/start-public.ps1` inicia também `../alejoias/scripts/start-public-notes.ps1`, que sobe PostgreSQL 17 e Django/Waitress em `127.0.0.1:8008`, antes da loja e do conector. O backup das notas foi restaurado em banco isolado. A loja respondeu em `https://alejoias.com/`, mas `https://notas.alejoias.com/entrar/` ainda não respondeu: falta adicionar no Tunnel `alejoias-local` uma rota de aplicativo publicado para o hostname `notas.alejoias.com` com origem `http://127.0.0.1:8008`. Não alterar a rota existente do domínio principal.

Após criar a rota na conta Cloudflare, verificar HTTPS, login, páginas estáticas, emissão e impressão das notas em celular e computador. Só depois definir `PUBLIC_NOTAS_URL=https://notas.alejoias.com/` no build de produção do site, executar `pnpm check` e `pnpm build`, e reiniciar o processo Node em 4323. O link “Notas e devoluções” aparecerá apenas no admin. Os dois sistemas mantêm logins e bancos independentes. A inicialização conjunta ainda depende de login no Windows; conferir após reiniciar o PC.

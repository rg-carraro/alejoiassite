---
name: alejoias-site
description: Manter a identidade e continuidade do projeto AleJoias Site, distinguindo o site do aplicativo Android e respeitando decisões documentadas.
---
# AleJoias Site

Leia docs/PROJECT_CONTEXT.md e o estado Git antes de agir. Esse arquivo é a fonte vigente; DECISION_LOG.md preserva a cronologia. Projeto em C:\Users\rgcar\git\alejoiassite, master, repositório rg-carraro/alejoiassite. Pasta _old somente para recuperação.

- Preserve Astro + TypeScript. Ambiente local já tem adapter Node, SQLite, painel, importação e atendimento; não reinicializar nem trocar a stack por um starter.
- Cloudflare é direção de publicação, não um deploy existente. Domínio alejoias.com administrado nela. Publicação e DNS exigem escopo próprio.
- Site é independente do aplicativo AleJoias Vendas SQLite Sync v2; não alterar app, IDs, schema ou backend Apps Script por tarefa web.
- Identidade aprovada: clara, elegante, fotos grandes e detalhes dourados; logo e referências locais do Wix. Conteúdo comercial antigo precisa ser validado, incluindo garantia, material e preço.
- Categorias: Brincos, Pulseiras, Anéis, Colares, Conjuntos, Tornozeleiras. Coleções: Novidades e Presentes. Não inventar produtos para preencher categorias.
- WhatsApp confirmado 5519988038395; cliente revisa e envia. Solicitação registrada não comprova mensagem enviada, compra ou pagamento.
- Manutenção técnica: seguir .agents/skills/alejoias-manutencao/SKILL.md. Cadastro, escrita comercial e importação: seguir .agents/skills/alejoias-catalogo/SKILL.md.
- Documentar decisões sem confundir recursos planejados com implementados. Preservar dados locais privados fora do Git e distinguir sincronização do código de backup dos dados.

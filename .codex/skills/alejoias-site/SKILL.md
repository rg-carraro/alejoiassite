---
name: alejoias-site
description: Contexto e regras para desenvolver o novo site oficial AleJoias sem confundi-lo com o aplicativo auxiliar AleJoias Vendas.
---

# Skill: AleJoias Site

## Objetivo
Desenvolver um site moderno para a AleJoias, marca/negócio de venda de joias, que será publicado no domínio oficial `alejoias.com`.

## Estado confirmado em 08/09/2026
- Domínio: `alejoias.com`
- Registrador/gestão atual: Cloudflare
- Status exibido: ativo
- Expiração exibida: 08/09/2027
- Renovação automática: ativada
- Preço de renovação exibido no painel no momento do registro: US$ 10,46/ano
- A configuração definitiva de DNS dependerá da hospedagem escolhida.
- Ainda não foi escolhida/documentada uma arquitetura final nem a hospedagem do novo site.

## Relação com AleJoias Vendas
`AleJoias Vendas` NÃO é o site. É um aplicativo auxiliar do mesmo negócio, voltado à operação/gestão de vendas.

Contexto conhecido do app:
- App Android com suporte a vendas, clientes, pagamentos e resumos.
- Existe backend/integração com Google Planilhas/Apps Script.
- O backend do app foi previamente aprovado e não deve ser alterado por este projeto.
- A base estável do app é tratada separadamente.
- Uma futura integração site ↔ AleJoias Vendas pode ser considerada, mas NÃO deve ser presumida nem implementada sem definição explícita.

## Histórico do site
Existiu anteriormente um site Wix da AleJoias:
`https://alejoiasninafiori.wixsite.com/alejoias`

Ele pode ser consultado futuramente como referência de conteúdo/identidade, mas:
- não é a base técnica obrigatória;
- não determina a nova arquitetura;
- conteúdo antigo deve ser revisado antes de reutilização.

## Informações institucionais conhecidas
Contexto histórico da marca a validar antes da publicação:
- AleJoias atua com joias/semijoias.
- Slogan anteriormente utilizado: “Desde 2014 oferecendo estilo, requinte e qualidade”.
- Foram mencionados materiais/acabamentos como ouro, ródio, aço e prata 925.
- Foram mencionados consignado de 20%, prazos de 15–30 dias e garantia de 3 meses para banho.

Essas informações são contexto de trabalho, não autorização automática para publicar. Confirmar dados comerciais vigentes antes do lançamento.

## Diretrizes de desenvolvimento
Priorizar:
- visual moderno, elegante, responsivo e adequado a uma marca de joias;
- excelente experiência mobile;
- desempenho, SEO e acessibilidade;
- contato/WhatsApp e catálogo somente após definição do fluxo;
- arquitetura simples e de baixo custo operacional;
- facilidade de manutenção com Codex.

Não escolher framework, CMS, banco, provedor de hospedagem, checkout ou plataforma de e-commerce sem analisar os requisitos com o usuário.

## Segurança
- Nunca solicitar que credenciais sejam commitadas.
- Usar variáveis de ambiente para segredos.
- Não alterar configurações da Cloudflare automaticamente.
- Integrações com sistemas existentes devem ter autenticação e permissões mínimas.
- Não expor endpoints internos do AleJoias Vendas sem projeto explícito de segurança.

## Ao iniciar uma nova sessão
Leia `docs/PROJECT_CONTEXT.md`, verifique o estado do repositório e informe resumidamente:
1. estado atual;
2. última decisão registrada;
3. próximos pontos ainda não decididos.

Depois continue do ponto existente, sem recriar o projeto desnecessariamente.

## Atualização de 11/09/2026
- Pasta oficial: C:\Users\rgcar\git\alejoiassite.
- Repositório: https://github.com/rg-carraro/alejoiassite.git; branch inicial master.
- Direção aprovada: Astro + TypeScript, React quando necessário e Cloudflare para hospedagem. Não substituir a stack aprovada por um starter de outra stack.
- Catálogo com sacola e pedido WhatsApp na primeira etapa; checkout futuro.
- Consultar as decisões vigentes no final de docs/PROJECT_CONTEXT.md; elas prevalecem sobre pendências históricas deste documento.

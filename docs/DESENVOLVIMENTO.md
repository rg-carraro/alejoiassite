# Estrutura de desenvolvimento

- `src/pages`: rotas do site; index.astro é uma página provisória de verificação.
- `src/layouts`: estrutura HTML compartilhada.
- `src/components`: componentes reutilizáveis.
- `src/styles`: identidade visual e estilos globais.
- `src/data`: categorias e futuros dados demonstrativos.
- `src/types`: contratos TypeScript do catálogo.
- `public/images/brand`: referências locais dos logos.
- `public/images/products`: fotos demonstrativas.
- `docs`: contexto, decisões e referências.

## Executar
Usar Node compatível com a versão instalada de Astro e pnpm. O lockfile deve ser versionado.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
pnpm preview
```

`dev` inicia desenvolvimento local; `preview` serve o resultado após o build. Nenhum comando acima publica o site.

## Origem dos ativos
Arquivos copiados sem edição de C:\Pessoal\AleJoias\Site\Inicio:
- teste_logo1.jpg → public/images/brand/alejoias.jpg
- logos.png → public/images/brand/diamante.png (logo completo original)
- 8688.jpg → public/images/products/colares-exemplo.jpg
- 8748.jpg → public/images/products/pulseira-exemplo.jpg

Imagens autorizadas como exemplos; não indicam estoque, preço ou material confirmado.

## Limites desta entrega
Estrutura executável, não catálogo final. Página provisória com noindex; remover essa restrição apenas quando o conteúdo de produção estiver pronto. Não há painel, banco, sacola ou integração WhatsApp implementados ainda.

Versões iniciais: Astro 7.3.2, TypeScript 6.0.3 e pnpm 11.19.0, com lockfile versionado. TypeScript 7 não foi usado porque ainda não expõe a API exigida pelo astro check. Ambiente validado com Node 24.19.0.

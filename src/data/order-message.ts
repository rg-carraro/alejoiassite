export interface OrderTableItem {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  priceInCents: number;
}

// Colunas monoespaçadas; nomes longos continuam na próxima linha sem perda de texto.
export function formatOrderTable(items: OrderTableItem[]): string {
  const money = (cents: number) => (cents / 100).toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL',
  }).replace(/\u00a0/g, ' ');
  const clean = (value: string) => value.normalize('NFC').replace(/[\r\n\t`|]/g, ' ').trim();
  const rows = items.map(item => {
    const quantity = item.quantity > 1 ? `${item.quantity}x ` : '';
    const option = clean(item.variant);
    const normalizedOption = option.toLocaleLowerCase('pt-BR');
    const isPlaceholder = normalizedOption === 'única' || normalizedOption.includes('a confirmar');
    const variant = option && !isPlaceholder ? ` (${option})` : '';
    return [quantity + clean(item.name) + variant, money(item.quantity * item.priceInCents)];
  });
  const valueWidth = Math.max(5, ...rows.map(row => row[1].length));
  const productWidth = Math.max(7, Math.min(22, 38 - valueWidth - 7, Math.max(7, ...rows.map(row => row[0].length))));
  const wrap = (text: string): string[] => {
    const lines: string[] = [];
    while (text.length > productWidth) {
      const space = text.lastIndexOf(' ', productWidth);
      const cut = space > 0 ? space : productWidth;
      lines.push(text.slice(0, cut));
      text = text.slice(cut).trimStart();
    }
    lines.push(text);
    return lines;
  };
  const line = (product: string, value: string) => `| ${product.padEnd(productWidth)} | ${value.padStart(valueWidth)} |`;
  return [
    '```',
    line('Produto', 'Valor'),
    line('-'.repeat(productWidth), '-'.repeat(valueWidth)),
    ...rows.flatMap(([product, value]) => wrap(product).map((part, index) => line(part, index === 0 ? value : ''))),
    '```',
  ].join('\n');
}

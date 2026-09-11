export interface OrderTableItem {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  priceInCents: number;
}

// Duas colunas em texto simples; o valor representa o total da linha.
export function formatOrderTable(items: OrderTableItem[]): string {
  const money = (cents: number) => (cents / 100).toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL',
  });
  const clean = (value: string) => value.replace(/[\r\n\t`|]/g, ' ').trim();
  return [
    '| Produto | Valor |',
    ...items.map(item => {
      const quantity = item.quantity > 1 ? `${item.quantity}x ` : '';
      const variant = item.variant && item.variant !== 'Única' ? ` (${clean(item.variant)})` : '';
      return `| ${quantity}${clean(item.name)}${variant} | ${money(item.quantity * item.priceInCents)} |`;
    }),
  ].join('\n');
}

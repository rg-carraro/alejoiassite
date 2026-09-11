export interface OrderTableItem {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  priceInCents: number;
}

// Nomes e opções ficam fora das colunas para não truncar peças com nomes longos.
export function formatOrderTable(items: OrderTableItem[]): string {
  const money = (cents: number) => (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
  const clean = (value: string) => value.replace(/[\r\n\t`]/g, ' ').trim();
  const rows = items.map((item, index) => [
    String(index + 1).padStart(2, '0'), String(item.quantity),
    money(item.priceInCents), money(item.quantity * item.priceInCents),
  ]);
  const headers = ['Item', 'Qtd', 'Unit.', 'Total'];
  const widths = headers.map((h, col) => Math.max(h.length, ...rows.map(r => r[col].length)));
  const line = (row: string[]) => row.map((v, col) => col === 0 ? v.padEnd(widths[col]) : v.padStart(widths[col])).join(' ');
  return [
    '*Peças selecionadas*',
    ...items.map((item, index) => `${String(index + 1).padStart(2, '0')}. ${clean(item.name)} (${clean(item.id)})\n    Opção: ${clean(item.variant)}`),
    '', '*Valores em R$*', '```', line(headers), widths.map(w => '-'.repeat(w)).join(' '),
    ...rows.map(line), '```',
  ].join('\n');
}

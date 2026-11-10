const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  if (isNaN(value) || !isFinite(value)) {
    return 'R$ 0,00';
  }
  return currencyFormatter.format(value);
}

export function formatInteger(value: number): string {
  if (isNaN(value) || !isFinite(value)) {
    return '0';
  }
  return Math.round(value).toString();
}

export function formatPercent(value: number): string {
  if (isNaN(value) || !isFinite(value)) {
    return '0%';
  }
  return `${Math.round(value * 100)}%`;
}

export function parseDigitsToCents(raw: string): number {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return 0;
  return parseInt(digits, 10);
}

export function formatCentsToBRL(cents: number): string {
  const value = cents / 100;
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function numberToInputBRL(value: number): string {
  if (isNaN(value) || !isFinite(value) || value <= 0) {
    return '0,00';
  }
  const cents = Math.round(value * 100);
  return formatCentsToBRL(cents);
}


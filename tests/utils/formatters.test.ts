import { describe, it, expect } from 'vitest';
import { formatCurrency, formatInteger, formatPercent } from '../../src/utils/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formata valor positivo em moeda brasileira BRL', () => {
      const formatted = formatCurrency(35323);
      // Pode conter espaço comum ou non-breaking space (\u00a0)
      expect(formatted.replace(/\u00a0/g, ' ')).toBe('R$ 35.323,00');
    });

    it('formata valor zero em BRL', () => {
      const formatted = formatCurrency(0);
      expect(formatted.replace(/\u00a0/g, ' ')).toBe('R$ 0,00');
    });

    it('formata valor negativo em BRL', () => {
      const formatted = formatCurrency(-500.5);
      expect(formatted.replace(/\u00a0/g, ' ')).toBe('-R$ 500,50');
    });
  });

  describe('formatInteger', () => {
    it('formata números inteiros', () => {
      expect(formatInteger(32)).toBe('32');
      expect(formatInteger(0)).toBe('0');
      expect(formatInteger(180)).toBe('180');
    });
  });

  describe('formatPercent', () => {
    it('formata decimais como porcentagem', () => {
      expect(formatPercent(0.77)).toBe('77%');
      expect(formatPercent(0.92)).toBe('92%');
      expect(formatPercent(0.99)).toBe('99%');
    });
  });
});

import { describe, it, expect } from 'vitest';
import {
  formatCentsToBRL,
  parseDigitsToCents,
  numberToInputBRL,
} from '../../src/utils/currencyMask';

describe('currencyMask utils', () => {
  describe('formatCentsToBRL', () => {
    it('formata 1 centavo como 0,01', () => {
      expect(formatCentsToBRL(1)).toBe('0,01');
    });

    it('formata 100 centavos como 1,00', () => {
      expect(formatCentsToBRL(100)).toBe('1,00');
    });

    it('formata 10000000 centavos (100 mil) como 100.000,00', () => {
      expect(formatCentsToBRL(10000000)).toBe('100.000,00');
    });

    it('formata 0 como 0,00', () => {
      expect(formatCentsToBRL(0)).toBe('0,00');
    });
  });

  describe('parseDigitsToCents', () => {
    it('extrai apenas digitos ignorando pontos e virgulas', () => {
      expect(parseDigitsToCents('100.000,00')).toBe(10000000);
      expect(parseDigitsToCents('R$ 35.323,50')).toBe(3532350);
      expect(parseDigitsToCents('abc123def')).toBe(123);
      expect(parseDigitsToCents('')).toBe(0);
    });
  });

  describe('numberToInputBRL', () => {
    it('converte valor float em formato monetario brasileiro com virgula', () => {
      expect(numberToInputBRL(100000)).toBe('100.000,00');
      expect(numberToInputBRL(35323.5)).toBe('35.323,50');
      expect(numberToInputBRL(0)).toBe('0,00');
    });
  });
});

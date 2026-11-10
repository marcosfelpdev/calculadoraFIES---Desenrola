import { describe, it, expect } from 'vitest';
import { calculateDesenrolaFies } from '../../src/engine/calculatorEngine';
import { CalculatorInputs } from '../../src/types/calculator';

describe('calculateDesenrolaFies', () => {
  it('calcula corretamente para INADIMPLENTE com benefício Nenhum (77%)', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2010,
      saldoDevedorAtual: 35323.00,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Nenhum',
      mesesJaPagosSeguro: 12,
      valorSeguroMes: 50.00,
    };

    const res = calculateDesenrolaFies(inputs);

    // Passo A
    expect(res.valorBaseCalc).toBeCloseTo(35323.00, 2);
    expect(res.totalJurosPrice).toBeCloseTo(14411.784, 3);
    expect(res.totalJurosSimples).toBeCloseTo(7205.892, 3);
    expect(res.economiaJuros).toBeCloseTo(7205.892, 3);
    expect(res.saldoPosJuros).toBeCloseTo(28117.108, 3);

    // Passo B
    expect(res.percentualDesconto).toBe(0.77);
    expect(res.descontoDesenrolaCalc).toBeCloseTo(21650.173, 2);

    // Passo C
    expect(res.saldoDevedorOriginal).toBe(35323.00);
    expect(res.economiaTotal).toBeCloseTo(28856.065, 2);
    expect(res.novoSaldoDevedor).toBeCloseTo(6466.935, 2);

    // Passo D: MIN(180, MAX(1, INT(6466.935 / 200))) = 32
    expect(res.qtdParcelas).toBe(32);
    expect(res.qtdParcelasPadrao).toBe(32);
    expect(res.valorDaParcela).toBeCloseTo(202.0917, 2);
    expect(res.valorDaParcelaPadrao).toBeCloseTo(202.0917, 2);

    // Passo E: 12 * 50 * 2 = 1200
    expect(res.restituicaoEmDobro).toBe(1200.00);
  });

  it('permite customizar a quantidade de parcelas e recalcular valor da parcela', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2010,
      saldoDevedorAtual: 35323.00,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Nenhum',
      mesesJaPagosSeguro: 0,
      valorSeguroMes: 0,
      customQtdParcelas: 60,
    };

    const res = calculateDesenrolaFies(inputs);
    expect(res.qtdParcelas).toBe(60);
    expect(res.qtdParcelasPadrao).toBe(32);
    expect(res.valorDaParcela).toBeCloseTo(6466.935 / 60, 2);
    expect(res.valorDaParcelaPadrao).toBeCloseTo(6466.935 / 32, 2);
  });

  it('calcula corretamente para ADIMPLENTE com base proporcional (144 / 175)', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2015,
      saldoDevedorAtual: 35323.00,
      dataAtual: '2026-11-10',
      situacaoContrato: 'ADIMPLENTE',
      condicaoBeneficio: 'Auxílio Emergencial ou CadÚnico - 1 ano',
      mesesJaPagosSeguro: 0,
      valorSeguroMes: 0,
    };

    const res = calculateDesenrolaFies(inputs);

    const expectedBase = (35323.00 / 175) * 144;
    expect(res.valorBaseCalc).toBeCloseTo(expectedBase, 4);
    expect(res.percentualDesconto).toBe(0.92);
    expect(res.descontoDesenrolaCalc).toBeCloseTo(res.saldoPosJuros * 0.92, 3);
  });

  it('calcula percentual de 99% para Auxílio Emergencial ou CadÚnico - 5 anos', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2012,
      saldoDevedorAtual: 50000.00,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Auxílio Emergencial ou CadÚnico - 5 anos',
      mesesJaPagosSeguro: 0,
      valorSeguroMes: 0,
    };

    const res = calculateDesenrolaFies(inputs);
    expect(res.percentualDesconto).toBe(0.99);
  });

  it('trata saldo devedor zerado ou negativo sem divisão por zero', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2020,
      saldoDevedorAtual: 0,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Nenhum',
      mesesJaPagosSeguro: 0,
      valorSeguroMes: 0,
    };

    const res = calculateDesenrolaFies(inputs);
    expect(res.saldoDevedorOriginal).toBe(0);
    expect(res.novoSaldoDevedor).toBe(0);
    expect(res.qtdParcelas).toBe(0);
    expect(res.valorDaParcela).toBe(0);
  });

  it('trata saldo devedor negativo de forma segura', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2020,
      saldoDevedorAtual: -5000,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Nenhum',
      mesesJaPagosSeguro: 0,
      valorSeguroMes: 0,
    };

    const res = calculateDesenrolaFies(inputs);
    expect(res.saldoDevedorOriginal).toBe(0);
    expect(res.novoSaldoDevedor).toBe(0);
    expect(res.qtdParcelas).toBe(0);
    expect(res.valorDaParcela).toBe(0);
  });

  it('trata saldo devedor pequeno (< 200) garantindo exatamente 1 parcela no padrão', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2020,
      saldoDevedorAtual: 200,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Nenhum',
      mesesJaPagosSeguro: 0,
      valorSeguroMes: 0,
    };

    const res = calculateDesenrolaFies(inputs);
    expect(res.qtdParcelas).toBe(1);
    expect(res.valorDaParcela).toBeCloseTo(res.novoSaldoDevedor, 2);
  });

  it('aplica o teto de 180 parcelas quando o saldo devedor resultar em > 180 parcelas', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2020,
      saldoDevedorAtual: 500000.00,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Nenhum',
      mesesJaPagosSeguro: 0,
      valorSeguroMes: 0,
    };

    const res = calculateDesenrolaFies(inputs);
    expect(res.qtdParcelas).toBe(180);
    expect(res.valorDaParcela).toBeCloseTo(res.novoSaldoDevedor / 180, 2);
  });
});

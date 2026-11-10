import { describe, it, expect } from 'vitest';
import {
  calculateDesenrolaFies,
  SEGURO_PRESTAMISTA_FIXO,
} from '../../src/engine/calculatorEngine';
import { CalculatorInputs } from '../../src/types/calculator';

describe('SEGURO_PRESTAMISTA_FIXO', () => {
  it('contém os valores fixos definidos para curso regular e medicina', () => {
    expect(SEGURO_PRESTAMISTA_FIXO.cursoRegular).toBe(4500);
    expect(SEGURO_PRESTAMISTA_FIXO.medicina).toBe(15000);
  });
});

describe('calculateDesenrolaFies', () => {
  it('calcula corretamente para INADIMPLENTE com benefício Nenhum (77%)', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2010,
      saldoDevedorAtual: 35323.0,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Nenhum',
    };

    const res = calculateDesenrolaFies(inputs);

    // Passo A
    expect(res.valorBaseCalc).toBeCloseTo(35323.0, 2);
    expect(res.totalJurosPrice).toBeCloseTo(14411.784, 3);
    expect(res.totalJurosSimples).toBeCloseTo(7205.892, 3);
    expect(res.economiaJuros).toBeCloseTo(7205.892, 3);
    expect(res.saldoPosJuros).toBeCloseTo(28117.108, 3);

    // Passo B
    expect(res.percentualDesconto).toBe(0.77);
    expect(res.descontoDesenrolaCalc).toBeCloseTo(21650.173, 2);

    // Passo C
    expect(res.saldoDevedorOriginal).toBe(35323.0);
    expect(res.economiaTotal).toBeCloseTo(28856.065, 2);
    expect(res.novoSaldoDevedor).toBeCloseTo(6466.935, 2);

    // Passo D: MIN(180, MAX(1, INT(6466.935 / 200))) = 32
    expect(res.qtdParcelas).toBe(32);
    expect(res.qtdParcelasPadrao).toBe(32);
    expect(res.valorDaParcela).toBeCloseTo(202.0917, 2);
    expect(res.valorDaParcelaPadrao).toBeCloseTo(202.0917, 2);
  });

  it('retorna exatamente os mesmos resultados para ADIMPLENTE e INADIMPLENTE', () => {
    const baseInput: Omit<CalculatorInputs, 'situacaoContrato'> = {
      anoContrato: 2015,
      saldoDevedorAtual: 35323.0,
      dataAtual: '2026-11-10',
      condicaoBeneficio: 'Auxílio Emergencial ou CadÚnico - 1 ano',
    };

    const resAdimplente = calculateDesenrolaFies({
      ...baseInput,
      situacaoContrato: 'ADIMPLENTE',
    });

    const resInadimplente = calculateDesenrolaFies({
      ...baseInput,
      situacaoContrato: 'INADIMPLENTE',
    });

    expect(resAdimplente).toEqual(resInadimplente);
    expect(resAdimplente.valorBaseCalc).toBe(resInadimplente.valorBaseCalc);
    expect(resAdimplente.totalJurosPrice).toBe(resInadimplente.totalJurosPrice);
    expect(resAdimplente.totalJurosSimples).toBe(
      resInadimplente.totalJurosSimples
    );
    expect(resAdimplente.economiaJuros).toBe(resInadimplente.economiaJuros);
    expect(resAdimplente.saldoPosJuros).toBe(resInadimplente.saldoPosJuros);
    expect(resAdimplente.percentualDesconto).toBe(
      resInadimplente.percentualDesconto
    );
    expect(resAdimplente.descontoDesenrolaCalc).toBe(
      resInadimplente.descontoDesenrolaCalc
    );
    expect(resAdimplente.saldoDevedorOriginal).toBe(
      resInadimplente.saldoDevedorOriginal
    );
    expect(resAdimplente.economiaTotal).toBe(resInadimplente.economiaTotal);
    expect(resAdimplente.novoSaldoDevedor).toBe(
      resInadimplente.novoSaldoDevedor
    );
    expect(resAdimplente.qtdParcelas).toBe(resInadimplente.qtdParcelas);
    expect(resAdimplente.valorDaParcela).toBe(resInadimplente.valorDaParcela);
    expect(resAdimplente.qtdParcelasPadrao).toBe(
      resInadimplente.qtdParcelasPadrao
    );
    expect(resAdimplente.valorDaParcelaPadrao).toBe(
      resInadimplente.valorDaParcelaPadrao
    );
  });

  it('permite customizar a quantidade de parcelas e recalcular valor da parcela', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2010,
      saldoDevedorAtual: 35323.0,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Nenhum',
      customQtdParcelas: 60,
    };

    const res = calculateDesenrolaFies(inputs);
    expect(res.qtdParcelas).toBe(60);
    expect(res.qtdParcelasPadrao).toBe(32);
    expect(res.valorDaParcela).toBeCloseTo(6466.935 / 60, 2);
    expect(res.valorDaParcelaPadrao).toBeCloseTo(6466.935 / 32, 2);
  });

  it('calcula percentual de 92% para Auxílio Emergencial ou CadÚnico - 1 ano', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2012,
      saldoDevedorAtual: 50000.0,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Auxílio Emergencial ou CadÚnico - 1 ano',
    };

    const res = calculateDesenrolaFies(inputs);
    expect(res.percentualDesconto).toBe(0.92);
  });

  it('calcula percentual de 99% para Auxílio Emergencial ou CadÚnico - 5 anos', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2012,
      saldoDevedorAtual: 50000.0,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Auxílio Emergencial ou CadÚnico - 5 anos',
    };

    const res = calculateDesenrolaFies(inputs);
    expect(res.percentualDesconto).toBe(0.99);
  });

  it('trata saldo devedor zerado sem divisão por zero', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2020,
      saldoDevedorAtual: 0,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Nenhum',
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
    };

    const res = calculateDesenrolaFies(inputs);
    expect(res.qtdParcelas).toBe(1);
    expect(res.valorDaParcela).toBeCloseTo(res.novoSaldoDevedor, 2);
  });

  it('aplica o teto de 180 parcelas quando o saldo devedor resultar em > 180 parcelas', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2020,
      saldoDevedorAtual: 500000.0,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Nenhum',
    };

    const res = calculateDesenrolaFies(inputs);
    expect(res.qtdParcelas).toBe(180);
    expect(res.valorDaParcela).toBeCloseTo(res.novoSaldoDevedor / 180, 2);
  });
});

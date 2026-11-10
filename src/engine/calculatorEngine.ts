import {
  CalculatorInputs,
  CalculatorOutputs,
  CondicaoBeneficio,
} from '../types/calculator';

export const TAXA_JUROS_ANUAL = 0.034;

export const DESCONTOS_BENEFICIO: Record<CondicaoBeneficio, number> = {
  'Nenhum': 0.77,
  'Auxílio Emergencial ou CadÚnico - 1 ano': 0.92,
  'Auxílio Emergencial ou CadÚnico - 5 anos': 0.99,
};

export const SEGURO_PRESTAMISTA_FIXO = {
  cursoRegular: 4500,
  medicina: 15000,
} as const;

export function calculateDesenrolaFies(inputs: CalculatorInputs): CalculatorOutputs {
  const saldoDevedorAtual = Math.max(0, Number(inputs.saldoDevedorAtual) || 0);

  // Passo A: Cálculo Base e Expurgo de Juros
  const valorBaseCalc = saldoDevedorAtual;

  const totalJurosPrice = valorBaseCalc * TAXA_JUROS_ANUAL * 12;
  const totalJurosSimples = valorBaseCalc * TAXA_JUROS_ANUAL * 6;
  const economiaJuros = totalJurosPrice - totalJurosSimples;
  const saldoPosJuros = Math.max(0, saldoDevedorAtual - economiaJuros);

  // Passo B: Cálculo do Desconto do Governo (Desenrola)
  const percentualDesconto = DESCONTOS_BENEFICIO[inputs.condicaoBeneficio] ?? 0.77;
  const descontoDesenrolaCalc = saldoPosJuros * percentualDesconto;

  // Passo C: Consolidação dos Resultados
  const saldoDevedorOriginal = saldoDevedorAtual;
  const economiaTotal = economiaJuros + descontoDesenrolaCalc;
  const novoSaldoDevedor = Math.max(0, saldoDevedorOriginal - economiaTotal);

  // Passo D: Regras Bancárias de Parcelamento
  let qtdParcelasPadrao = 0;
  let valorDaParcelaPadrao = 0;

  if (novoSaldoDevedor > 0) {
    const parcelasCalculadas = Math.floor(novoSaldoDevedor / 200);
    qtdParcelasPadrao = Math.min(180, Math.max(1, parcelasCalculadas));
    valorDaParcelaPadrao = novoSaldoDevedor / qtdParcelasPadrao;
  }

  let qtdParcelas = qtdParcelasPadrao;
  let valorDaParcela = valorDaParcelaPadrao;

  if (novoSaldoDevedor > 0 && inputs.customQtdParcelas && inputs.customQtdParcelas > 0) {
    qtdParcelas = Math.min(180, Math.max(1, Math.round(inputs.customQtdParcelas)));
    valorDaParcela = novoSaldoDevedor / qtdParcelas;
  }

  return {
    valorBaseCalc,
    totalJurosPrice,
    totalJurosSimples,
    economiaJuros,
    saldoPosJuros,
    percentualDesconto,
    descontoDesenrolaCalc,
    saldoDevedorOriginal,
    economiaTotal,
    novoSaldoDevedor,
    qtdParcelas,
    valorDaParcela,
    qtdParcelasPadrao,
    valorDaParcelaPadrao,
  };
}

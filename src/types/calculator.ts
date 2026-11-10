export type SituacaoContrato = 'INADIMPLENTE' | 'ADIMPLENTE';

export type CondicaoBeneficio =
  | 'Nenhum'
  | 'Auxílio Emergencial ou CadÚnico - 1 ano'
  | 'Auxílio Emergencial ou CadÚnico - 5 anos';

export interface CalculatorInputs {
  anoContrato: number;
  saldoDevedorAtual: number;
  dataAtual: string;
  situacaoContrato: SituacaoContrato;
  condicaoBeneficio: CondicaoBeneficio;
  mesesJaPagosSeguro: number;
  valorSeguroMes: number;
  customQtdParcelas?: number | null;
}

export interface CalculatorOutputs {
  // Passo A: Cálculo Base e Expurgo de Juros
  valorBaseCalc: number;
  totalJurosPrice: number;
  totalJurosSimples: number;
  economiaJuros: number;
  saldoPosJuros: number;

  // Passo B: Cálculo do Desconto do Governo (Desenrola)
  percentualDesconto: number;
  descontoDesenrolaCalc: number;

  // Passo C: Consolidação dos Resultados
  saldoDevedorOriginal: number;
  economiaTotal: number;
  novoSaldoDevedor: number;

  // Passo D: Regras Bancárias de Parcelamento
  qtdParcelas: number;
  valorDaParcela: number;
  qtdParcelasPadrao: number;
  valorDaParcelaPadrao: number;

  // Passo E: Restituição de Venda Casada
  restituicaoEmDobro: number;
}

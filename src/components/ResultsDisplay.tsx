import type { FC } from 'react';
import { CalculatorOutputs } from '../types/calculator';
import { formatCurrency, formatInteger } from '../utils/formatters';

interface ResultsDisplayProps {
  outputs: CalculatorOutputs;
  customQtdParcelas?: number | null;
  onCustomQtdParcelasChange?: (val: number | null) => void;
}

export const ResultsDisplay: FC<ResultsDisplayProps> = ({
  outputs,
  customQtdParcelas,
  onCustomQtdParcelasChange,
}) => {
  const isCustomized =
    customQtdParcelas !== null &&
    customQtdParcelas !== undefined &&
    outputs.qtdParcelas !== outputs.qtdParcelasPadrao;

  return (
    <div className="results-panel" aria-labelledby="revisao-heading">
      <div className="panel-header">
        <h2 id="revisao-heading" className="panel-title">
          Resultados da Revisão
        </h2>
        <p className="panel-subtitle">
          Condições recalculadas de acordo com as regras do Desenrola FIES.
        </p>
      </div>

      {/* Destaque Central: ECONOMIA TOTAL (Inspirado no TOTAL kcal de Image 2, sem círculo) */}
      <div className="total-highlight-card">
        <span className="total-highlight-label">ECONOMIA TOTAL</span>
        <div className="total-highlight-value" data-testid="economia-total">
          {formatCurrency(outputs.economiaTotal)}
        </div>
        <span className="total-highlight-caption">
          Expurgo de juros + Desconto Desenrola FIES
        </span>
      </div>

      {/* Lista com a hierarquia dos itens da revisão */}
      <div className="review-breakdown-card">
        <div className="breakdown-row">
          <span className="breakdown-label">Saldo Devedor Original</span>
          <span className="breakdown-value" data-testid="saldo-original">
            {formatCurrency(outputs.saldoDevedorOriginal)}
          </span>
        </div>

        <div className="breakdown-row discount">
          <span className="breakdown-label">Economia em Juros</span>
          <span className="breakdown-value" data-testid="economia-juros">
            - {formatCurrency(outputs.economiaJuros)}
          </span>
        </div>

        <div className="breakdown-row discount">
          <span className="breakdown-label">Desconto Desenrola FIES</span>
          <span className="breakdown-value" data-testid="desconto-desenrola">
            - {formatCurrency(outputs.descontoDesenrolaCalc)}
          </span>
        </div>

        <div className="breakdown-row final-balance">
          <span className="breakdown-label">Novo Saldo Devedor</span>
          <span className="breakdown-value" data-testid="novo-saldo">
            {formatCurrency(outputs.novoSaldoDevedor)}
          </span>
        </div>
      </div>

      {/* Condições de Pagamento: Adaptando os cards de macros (Protein, Carbs, Fat) */}
      <div className="payment-plan-section">
        <div className="section-subtitle-row">
          <span className="section-micro-title">Condições de Pagamento</span>
          {outputs.novoSaldoDevedor > 0 && isCustomized && (
            <button
              type="button"
              className="btn-minimal-reset"
              onClick={() => onCustomQtdParcelasChange?.(null)}
              data-testid="btn-reset-parcelas"
              title="Voltar ao padrão aproximado de R$ 200/parcela"
            >
              ↩ Voltar ao padrão ({outputs.qtdParcelasPadrao}x de{' '}
              {formatCurrency(outputs.valorDaParcelaPadrao)})
            </button>
          )}
        </div>

        <div className="payment-cards-grid">
          {/* Card 1: Quantidade de Parcelas */}
          <div className="payment-mini-card">
            <span className="mini-card-label">Qtd. de Parcelas</span>
            <div className="mini-card-interactive">
              {outputs.novoSaldoDevedor > 0 ? (
                <div className="parcelas-stepper">
                  <input
                    id="qtd-parcelas-input"
                    type="number"
                    min="1"
                    max="180"
                    value={outputs.qtdParcelas || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > 0) {
                        onCustomQtdParcelasChange?.(
                          Math.min(180, Math.max(1, Math.round(val)))
                        );
                      }
                    }}
                    data-testid="qtd-parcelas"
                    className="parcelas-clean-input"
                  />
                  <span className="parcelas-unit">x (máx 180)</span>
                </div>
              ) : (
                <span className="mini-card-value" data-testid="qtd-parcelas">
                  0x
                </span>
              )}
            </div>
            <span className="mini-card-hint">
              {isCustomized ? 'Plano personalizado' : 'Base padrão: ~R$ 200/mês'}
            </span>
          </div>

          {/* Card 2: Valor da Parcela */}
          <div className="payment-mini-card highlight-card">
            <span className="mini-card-label">Valor da Parcela</span>
            <div className="mini-card-value" data-testid="valor-parcela">
              {formatCurrency(outputs.valorDaParcela)}
            </div>
            <span className="mini-card-hint">
              {outputs.qtdParcelas > 0
                ? `${formatInteger(outputs.qtdParcelas)} parcelas mensais`
                : 'Sem parcelas'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import type { FC } from 'react';
import { CalculatorOutputs } from '../types/calculator';
import { formatCurrency } from '../utils/formatters';

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
    <div className="results-container">
      {/* Bloco 1: Resultados da Revisão */}
      <section className="card result-card" aria-labelledby="revisao-heading">
        <h2 id="revisao-heading" className="section-title">
          2. Resultados da Revisão
        </h2>

        <div className="result-row">
          <span className="result-label">Saldo Devedor Original:</span>
          <span className="result-value" data-testid="saldo-original">
            {formatCurrency(outputs.saldoDevedorOriginal)}
          </span>
        </div>

        <div className="result-row discount">
          <span className="result-label">Economia em Juros:</span>
          <span className="result-value" data-testid="economia-juros">
            - {formatCurrency(outputs.economiaJuros)}
          </span>
        </div>

        <div className="result-row discount">
          <span className="result-label">Desconto Desenrola FIES:</span>
          <span className="result-value" data-testid="desconto-desenrola">
            - {formatCurrency(outputs.descontoDesenrolaCalc)}
          </span>
        </div>

        <div className="result-row highlight-total">
          <span className="result-label">💰 Economia Total:</span>
          <span className="result-value" data-testid="economia-total">
            {formatCurrency(outputs.economiaTotal)}
          </span>
        </div>

        <div className="result-row highlight-final">
          <span className="result-label">Novo Saldo Devedor:</span>
          <span className="result-value" data-testid="novo-saldo">
            {formatCurrency(outputs.novoSaldoDevedor)}
          </span>
        </div>
      </section>

      {/* Bloco 2: Condições de Pagamento */}
      <section
        className="card result-card"
        aria-labelledby="pagamento-heading"
      >
        <h2 id="pagamento-heading" className="section-title">
          3. Condições de Pagamento
        </h2>

        <div className="result-row">
          <label htmlFor="qtd-parcelas-input" className="result-label">
            Qtd. de Parcelas:
          </label>
          <div className="parcelas-controls">
            {outputs.novoSaldoDevedor > 0 ? (
              <div className="parcelas-input-wrapper">
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
                  className="parcelas-input"
                />
                <span className="parcelas-max">/ 180x</span>
              </div>
            ) : (
              <span className="result-value" data-testid="qtd-parcelas">
                0
              </span>
            )}
          </div>
        </div>

        {outputs.novoSaldoDevedor > 0 && (
          <div className="parcelas-action-row">
            {isCustomized ? (
              <button
                type="button"
                className="btn-reset-parcelas"
                onClick={() => onCustomQtdParcelasChange?.(null)}
                data-testid="btn-reset-parcelas"
                title="Restaurar para a quantidade padrão calculada (~R$ 200/parcela)"
              >
                🔄 Voltar ao padrão ({outputs.qtdParcelasPadrao}x de {formatCurrency(outputs.valorDaParcelaPadrao)})
              </button>
            ) : (
              <span className="badge-default">
                Plano padrão calculado (~R$ 200,00/mês)
              </span>
            )}
          </div>
        )}

        <div className="result-row">
          <span className="result-label">Valor da Parcela:</span>
          <span className="result-value" data-testid="valor-parcela">
            {formatCurrency(outputs.valorDaParcela)}
          </span>
        </div>
      </section>

      {/* Bloco 3: Seguro Prestamista (Venda Casada) */}
      <section className="card result-card" aria-labelledby="seguro-heading">
        <h2 id="seguro-heading" className="section-title">
          4. Seguro Prestamista (Venda Casada)
        </h2>

        <div className="result-row highlight-restituicao">
          <span className="result-label">Restituição em Dobro:</span>
          <span className="result-value" data-testid="restituicao-seguro">
            + {formatCurrency(outputs.restituicaoEmDobro)}
          </span>
        </div>
      </section>
    </div>
  );
};

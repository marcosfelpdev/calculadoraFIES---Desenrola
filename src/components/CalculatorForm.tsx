import type { FC } from 'react';
import type { CalculatorInputs, CondicaoBeneficio } from '../types/calculator';
import { SEGURO_PRESTAMISTA_FIXO } from '../engine/calculatorEngine';
import { formatCurrency } from '../utils/formatters';
import { CurrencyInput } from './CurrencyInput';

interface CalculatorFormProps {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
}

const BENEFIT_OPTIONS: ReadonlyArray<{
  value: CondicaoBeneficio;
  label: string;
  ariaLabel: string;
}> = [
  {
    value: 'Nenhum',
    label: '77%',
    ariaLabel: '77% - Nenhum',
  },
  {
    value: 'Auxílio Emergencial ou CadÚnico - 1 ano',
    label: '92%',
    ariaLabel: '92% - Auxílio Emergencial ou CadÚnico (1 ano)',
  },
  {
    value: 'Auxílio Emergencial ou CadÚnico - 5 anos',
    label: '99%',
    ariaLabel: '99% - Auxílio Emergencial ou CadÚnico (5 anos)',
  },
];

export const CalculatorForm: FC<CalculatorFormProps> = ({
  inputs,
  onChange,
}) => {
  const handleChange = (field: keyof CalculatorInputs, value: unknown) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  return (
    <section className="form-panel" aria-labelledby="form-heading">
      <div className="panel-header">
        <h2 id="form-heading" className="panel-title">
          Dados do contrato
        </h2>
        <p className="panel-subtitle">
          Informe os parâmetros do financiamento para o recálculo em tempo real.
        </p>
      </div>

      <div className="form-content">
        {/* Linha 1: Ano do Contrato e Data Atual */}
        <div className="inputs-grid">
          <div className="form-group">
            <label htmlFor="anoContrato" className="field-label">
              Ano do Contrato:
            </label>
            <input
              id="anoContrato"
              type="number"
              value={inputs.anoContrato || ''}
              onChange={(e) =>
                handleChange('anoContrato', Number(e.target.value))
              }
              placeholder="Ex: 2010"
              className="styled-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dataAtual" className="field-label">
              Data Atual:
            </label>
            <input
              id="dataAtual"
              type="date"
              value={inputs.dataAtual}
              onChange={(e) => handleChange('dataAtual', e.target.value)}
              className="styled-input"
            />
          </div>
        </div>

        {/* Linha 2: Saldo Devedor Atual e Condição do Benefício */}
        <div className="inputs-grid">
          <div className="form-group">
            <label htmlFor="saldoDevedorAtual" className="field-label">
              Saldo Devedor Atual:
            </label>
            <CurrencyInput
              id="saldoDevedorAtual"
              value={inputs.saldoDevedorAtual}
              onChange={(val) => handleChange('saldoDevedorAtual', val)}
              placeholder="0,00"
            />
          </div>

          <div className="form-group">
            <span id="label-beneficio" className="field-label">
              Condição do Benefício:
            </span>
            <div
              className="segmented-control segmented-benefit-row"
              role="radiogroup"
              aria-labelledby="label-beneficio"
            >
              {BENEFIT_OPTIONS.map((option) => {
                const isActive = inputs.condicaoBeneficio === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    aria-label={option.ariaLabel}
                    title={option.ariaLabel}
                    className={`segmented-btn ${isActive ? 'active' : ''}`}
                    onClick={() =>
                      handleChange('condicaoBeneficio', option.value)
                    }
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Linha 3: Situação do Contrato */}
        <div className="form-group full-width">
          <span id="label-situacao" className="field-label">
            Situação do Contrato:
          </span>
          <div
            className="segmented-control"
            role="radiogroup"
            aria-labelledby="label-situacao"
          >
            <button
              type="button"
              role="radio"
              aria-checked={inputs.situacaoContrato === 'INADIMPLENTE'}
              className={`segmented-btn ${
                inputs.situacaoContrato === 'INADIMPLENTE' ? 'active' : ''
              }`}
              onClick={() => handleChange('situacaoContrato', 'INADIMPLENTE')}
            >
              INADIMPLENTE
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={inputs.situacaoContrato === 'ADIMPLENTE'}
              className={`segmented-btn ${
                inputs.situacaoContrato === 'ADIMPLENTE' ? 'active' : ''
              }`}
              onClick={() => handleChange('situacaoContrato', 'ADIMPLENTE')}
            >
              ADIMPLENTE
            </button>
          </div>
        </div>

        {/* Linha 4: Bloco informativo fixo Seguro Prestamista */}
        <div className="insurance-refund-card">
          <div className="insurance-header">
            <span className="insurance-title">
              Seguro Prestamista (Venda Casada)
            </span>
            <span className="refund-badge">Restituição em Dobro</span>
          </div>
          <div className="insurance-fixed-list">
            <div className="insurance-body">
              <span className="insurance-label">Curso Regular:</span>
              <span
                className="insurance-value"
                data-testid="seguro-curso-regular"
              >
                {formatCurrency(SEGURO_PRESTAMISTA_FIXO.cursoRegular)}
              </span>
            </div>
            <div className="insurance-body">
              <span className="insurance-label">Medicina:</span>
              <span className="insurance-value" data-testid="seguro-medicina">
                {formatCurrency(SEGURO_PRESTAMISTA_FIXO.medicina)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

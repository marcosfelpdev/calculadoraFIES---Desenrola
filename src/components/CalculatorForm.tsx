import type { FC } from 'react';
import type { CalculatorInputs } from '../types/calculator';
import { CurrencyInput } from './CurrencyInput';

interface CalculatorFormProps {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
}

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
        {/* Situação do Contrato - Segmented Control estilo Image 2 */}
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

        {/* Condição do Benefício - Segmented Control 3 opções */}
        <div className="form-group full-width">
          <span id="label-beneficio" className="field-label">
            Condição do Benefício:
          </span>
          <div
            className="segmented-control segmented-stack"
            role="radiogroup"
            aria-labelledby="label-beneficio"
          >
            <button
              type="button"
              role="radio"
              aria-checked={inputs.condicaoBeneficio === 'Nenhum'}
              className={`segmented-btn ${
                inputs.condicaoBeneficio === 'Nenhum' ? 'active' : ''
              }`}
              onClick={() => handleChange('condicaoBeneficio', 'Nenhum')}
            >
              <span className="btn-text">Nenhum</span>
              <span className="discount-pill">77%</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={
                inputs.condicaoBeneficio ===
                'Auxílio Emergencial ou CadÚnico - 1 ano'
              }
              className={`segmented-btn ${
                inputs.condicaoBeneficio ===
                'Auxílio Emergencial ou CadÚnico - 1 ano'
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                handleChange(
                  'condicaoBeneficio',
                  'Auxílio Emergencial ou CadÚnico - 1 ano'
                )
              }
            >
              <span className="btn-text">Auxílio Emergencial / CadÚnico (1 ano)</span>
              <span className="discount-pill">92%</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={
                inputs.condicaoBeneficio ===
                'Auxílio Emergencial ou CadÚnico - 5 anos'
              }
              className={`segmented-btn ${
                inputs.condicaoBeneficio ===
                'Auxílio Emergencial ou CadÚnico - 5 anos'
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                handleChange(
                  'condicaoBeneficio',
                  'Auxílio Emergencial ou CadÚnico - 5 anos'
                )
              }
            >
              <span className="btn-text">Auxílio Emergencial / CadÚnico (5 anos)</span>
              <span className="discount-pill">99%</span>
            </button>
          </div>
        </div>

        {/* Grid de campos numéricos / datas */}
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

          <div className="form-group">
            <label htmlFor="mesesJaPagosSeguro" className="field-label">
              Meses Já Pagos (Seguro):
            </label>
            <input
              id="mesesJaPagosSeguro"
              type="number"
              min="0"
              value={inputs.mesesJaPagosSeguro || ''}
              onChange={(e) =>
                handleChange('mesesJaPagosSeguro', Number(e.target.value))
              }
              placeholder="0"
              className="styled-input"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="valorSeguroMes" className="field-label">
              Valor Seguro/mês:
            </label>
            <CurrencyInput
              id="valorSeguroMes"
              value={inputs.valorSeguroMes}
              onChange={(val) => handleChange('valorSeguroMes', val)}
              placeholder="0,00"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

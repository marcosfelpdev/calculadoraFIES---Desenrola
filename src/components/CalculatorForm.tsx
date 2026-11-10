import type { FC } from 'react';
import {
  CalculatorInputs,
  CondicaoBeneficio,
  SituacaoContrato,
} from '../types/calculator';

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
    <section className="card form-section" aria-labelledby="form-heading">
      <h2 id="form-heading" className="section-title">
        1. Dados do Contrato (Preencha aqui)
      </h2>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="anoContrato">Ano do Contrato:</label>
          <input
            id="anoContrato"
            type="number"
            value={inputs.anoContrato || ''}
            onChange={(e) => handleChange('anoContrato', Number(e.target.value))}
            placeholder="Ex: 2010"
          />
        </div>

        <div className="form-group">
          <label htmlFor="saldoDevedorAtual">Saldo Devedor Atual (R$):</label>
          <input
            id="saldoDevedorAtual"
            type="number"
            step="0.01"
            min="0"
            value={inputs.saldoDevedorAtual || ''}
            onChange={(e) =>
              handleChange('saldoDevedorAtual', Number(e.target.value))
            }
            placeholder="Ex: 35323.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dataAtual">Data Atual:</label>
          <input
            id="dataAtual"
            type="date"
            value={inputs.dataAtual}
            onChange={(e) => handleChange('dataAtual', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="situacaoContrato">Situação do Contrato:</label>
          <select
            id="situacaoContrato"
            value={inputs.situacaoContrato}
            onChange={(e) =>
              handleChange(
                'situacaoContrato',
                e.target.value as SituacaoContrato
              )
            }
          >
            <option value="INADIMPLENTE">INADIMPLENTE</option>
            <option value="ADIMPLENTE">ADIMPLENTE</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label htmlFor="condicaoBeneficio">Condição do Benefício:</label>
          <select
            id="condicaoBeneficio"
            value={inputs.condicaoBeneficio}
            onChange={(e) =>
              handleChange(
                'condicaoBeneficio',
                e.target.value as CondicaoBeneficio
              )
            }
          >
            <option value="Nenhum">Nenhum (77%)</option>
            <option value="Auxílio Emergencial ou CadÚnico - 1 ano">
              Auxílio Emergencial ou CadÚnico - 1 ano (92%)
            </option>
            <option value="Auxílio Emergencial ou CadÚnico - 5 anos">
              Auxílio Emergencial ou CadÚnico - 5 anos (99%)
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mesesJaPagosSeguro">Meses Já Pagos (Seguro):</label>
          <input
            id="mesesJaPagosSeguro"
            type="number"
            min="0"
            value={inputs.mesesJaPagosSeguro || ''}
            onChange={(e) =>
              handleChange('mesesJaPagosSeguro', Number(e.target.value))
            }
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="valorSeguroMes">Valor Seguro/mês (R$):</label>
          <input
            id="valorSeguroMes"
            type="number"
            step="0.01"
            min="0"
            value={inputs.valorSeguroMes || ''}
            onChange={(e) =>
              handleChange('valorSeguroMes', Number(e.target.value))
            }
            placeholder="0.00"
          />
        </div>
      </div>
    </section>
  );
};

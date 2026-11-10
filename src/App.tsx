import { useMemo, useState } from 'react';
import { CalculatorInputs } from './types/calculator';
import { calculateDesenrolaFies } from './engine/calculatorEngine';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';

const initialInputs: CalculatorInputs = {
  anoContrato: 2010,
  saldoDevedorAtual: 0,
  dataAtual: new Date().toISOString().split('T')[0],
  situacaoContrato: 'ADIMPLENTE',
  condicaoBeneficio: 'Auxílio Emergencial ou CadÚnico - 1 ano',
  mesesJaPagosSeguro: 0,
  valorSeguroMes: 0,
  customQtdParcelas: null,
};

export default function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);

  const outputs = useMemo(() => {
    return calculateDesenrolaFies(inputs);
  }, [inputs]);

  const handleCustomParcelasChange = (val: number | null) => {
    setInputs((prev) => ({
      ...prev,
      customQtdParcelas: val,
    }));
  };

  return (
    <main className="app-canvas">
      <div className="app-shell">
        <header className="brand-header">
          <div className="brand-logo-lockup">
            <div className="brand-symbol" aria-hidden="true">
              <svg
                width="42"
                height="42"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="8" y="12" width="52" height="76" rx="14" fill="#FFC700" />
                <path
                  d="M22 50 C22 66 46 66 46 50 C46 34 22 34 22 50 Z"
                  fill="#1849D6"
                />
                <rect x="68" y="12" width="22" height="50" rx="11" fill="#FF2438" />
                <circle cx="79" cy="78" r="11" fill="#00B348" />
              </svg>
            </div>
            <div className="brand-text">
              <div className="brand-title">
                <span className="text-desenrola">DESENROLA</span>{' '}
                <span className="text-fies">FIES</span>
              </div>
              <span className="brand-tagline">
                Calculadora Oficial de Revisão e Acordo
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Card de 2 Colunas estilo Image 2 */}
        <div className="dashboard-card">
          <CalculatorForm inputs={inputs} onChange={setInputs} />
          <ResultsDisplay
            outputs={outputs}
            customQtdParcelas={inputs.customQtdParcelas}
            onCustomQtdParcelasChange={handleCustomParcelasChange}
          />
        </div>
      </div>
    </main>
  );
}

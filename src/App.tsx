import { useMemo, useState } from 'react';
import { CalculatorInputs } from './types/calculator';
import { calculateDesenrolaFies } from './engine/calculatorEngine';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import logoImg from './assets/logo.png';

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
            <div className="brand-symbol">
              <img
                src={logoImg}
                alt="Desenrola FIES Logo"
                className="brand-logo-img"
              />
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

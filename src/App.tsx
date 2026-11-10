import { useMemo, useState } from 'react';
import { CalculatorInputs } from './types/calculator';
import { calculateDesenrolaFies } from './engine/calculatorEngine';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';

export const initialInputs: CalculatorInputs = {
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
    <main className="app-container">
      <header className="app-header">
        <h1>Calculadora FIES</h1>
        <p className="subtitle">Revisão Contratual e Desenrola FIES</p>
      </header>

      <div className="calculator-layout">
        <CalculatorForm inputs={inputs} onChange={setInputs} />
        <ResultsDisplay
          outputs={outputs}
          customQtdParcelas={inputs.customQtdParcelas}
          onCustomQtdParcelasChange={handleCustomParcelasChange}
        />
      </div>
    </main>
  );
}

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';

describe('App - Calculadora FIES', () => {
  it('renderiza todos os campos de entrada e blocos de resultado', () => {
    render(<App />);

    // Formulário
    expect(screen.getByLabelText(/Ano do Contrato/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Saldo Devedor Atual/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data Atual/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Situação do Contrato/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Condição do Benefício/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Meses Já Pagos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Valor Seguro\/mês/i)).toBeInTheDocument();

    // Blocos de Resultados
    expect(screen.getByText(/Resultados da Revisão/i)).toBeInTheDocument();
    expect(screen.getByText(/Condições de Pagamento/i)).toBeInTheDocument();
    expect(screen.getByText(/Seguro Prestamista/i)).toBeInTheDocument();
  });

  it('recalcula em tempo real quando o usuário altera o saldo devedor', () => {
    render(<App />);

    const saldoInput = screen.getByLabelText(/Saldo Devedor Atual/i);
    const situacaoSelect = screen.getByLabelText(/Situação do Contrato/i);
    const beneficioSelect = screen.getByLabelText(/Condição do Benefício/i);

    // Ajusta para INADIMPLENTE e Nenhum (77%) com Saldo 35323
    fireEvent.change(situacaoSelect, { target: { value: 'INADIMPLENTE' } });
    fireEvent.change(beneficioSelect, { target: { value: 'Nenhum' } });
    fireEvent.change(saldoInput, { target: { value: '35323' } });

    // Verificações dos resultados esperados
    // Saldo Original: R$ 35.323,00
    // Economia Juros: R$ 7.205,89
    // Desconto Desenrola: R$ 21.650,17
    // Economia Total: R$ 28.856,07
    // Novo Saldo: R$ 6.466,93
    // Qtd Parcelas: 32
    // Valor Parcela: R$ 202,09
    expect(screen.getByTestId('saldo-original').textContent).toContain('35.323,00');
    expect(screen.getByTestId('economia-juros').textContent).toContain('7.205,89');
    expect(screen.getByTestId('desconto-desenrola').textContent).toContain('21.650,17');
    expect(screen.getByTestId('economia-total').textContent).toContain('28.856,07');
    expect(screen.getByTestId('novo-saldo').textContent).toContain('6.466,93');
    expect(screen.getByTestId('qtd-parcelas').textContent).toBe('32');
    expect(screen.getByTestId('valor-parcela').textContent).toContain('202,09');
  });

  it('calcula a restituição do seguro em dobro em tempo real', () => {
    render(<App />);

    const mesesInput = screen.getByLabelText(/Meses Já Pagos/i);
    const valorSeguroInput = screen.getByLabelText(/Valor Seguro\/mês/i);

    fireEvent.change(mesesInput, { target: { value: '24' } });
    fireEvent.change(valorSeguroInput, { target: { value: '45.50' } });

    // 24 * 45.50 * 2 = 2184.00
    expect(screen.getByTestId('restituicao-seguro').textContent).toContain('2.184,00');
  });
});


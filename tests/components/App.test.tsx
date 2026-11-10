import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';

describe('App - Calculadora FIES (Design Visual)', () => {
  it('renderiza o cabeçalho oficial, formulário e blocos de resultado', () => {
    render(<App />);

    // Cabeçalho de marca
    expect(screen.getByText('DESENROLA')).toBeInTheDocument();
    expect(screen.getByText('FIES')).toBeInTheDocument();

    // Painel de Dados do Contrato
    expect(screen.getByText(/Dados do contrato/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ano do Contrato/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Saldo Devedor Atual/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data Atual/i)).toBeInTheDocument();
    expect(screen.getByText(/Situação do Contrato:/i)).toBeInTheDocument();
    expect(screen.getByText(/Condição do Benefício:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Meses Já Pagos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Valor Seguro\/mês/i)).toBeInTheDocument();

    // Blocos de Resultados
    expect(screen.getByText(/Resultados da Revisão/i)).toBeInTheDocument();
    expect(screen.getByText(/ECONOMIA TOTAL/i)).toBeInTheDocument();
    expect(screen.getByText(/Condições de Pagamento/i)).toBeInTheDocument();
    expect(screen.getByText(/Seguro Prestamista/i)).toBeInTheDocument();
  });

  it('formata valor monetário da direita para esquerda e recalcula em tempo real', () => {
    render(<App />);

    const saldoInput = screen.getByLabelText(/Saldo Devedor Atual/i);
    const btnInadimplente = screen.getByRole('radio', { name: /INADIMPLENTE/i });
    const btnNenhum = screen.getByRole('radio', { name: /Nenhum/i });

    // Clica nos botões segmentados
    fireEvent.click(btnInadimplente);
    fireEvent.click(btnNenhum);

    // Digita 3532300 (representando 35.323,00 via máscara de centavos)
    fireEvent.change(saldoInput, { target: { value: '3532300' } });

    // Saldo formatado no input deve ser 35.323,00
    expect((saldoInput as HTMLInputElement).value).toBe('35.323,00');

    // Resultados calculados
    expect(screen.getByTestId('saldo-original').textContent).toContain('35.323,00');
    expect(screen.getByTestId('economia-juros').textContent).toContain('7.205,89');
    expect(screen.getByTestId('desconto-desenrola').textContent).toContain('21.650,17');
    expect(screen.getByTestId('economia-total').textContent).toContain('28.856,07');
    expect(screen.getByTestId('novo-saldo').textContent).toContain('6.466,93');
    expect(screen.getByTestId('valor-parcela').textContent).toContain('202,09');
  });

  it('permite alterar a quantidade de parcelas e restaurar ao padrão', () => {
    render(<App />);

    const saldoInput = screen.getByLabelText(/Saldo Devedor Atual/i);
    const btnInadimplente = screen.getByRole('radio', { name: /INADIMPLENTE/i });
    const btnNenhum = screen.getByRole('radio', { name: /Nenhum/i });

    fireEvent.click(btnInadimplente);
    fireEvent.click(btnNenhum);
    fireEvent.change(saldoInput, { target: { value: '3532300' } });

    const parcelasInput = screen.getByTestId('qtd-parcelas');
    expect((parcelasInput as HTMLInputElement).value).toBe('32');
    expect(screen.getByTestId('valor-parcela').textContent).toContain('202,09');

    // Altera para 60 parcelas
    fireEvent.change(parcelasInput, { target: { value: '60' } });
    expect((parcelasInput as HTMLInputElement).value).toBe('60');

    // Botão de restaurar deve aparecer
    const btnReset = screen.getByTestId('btn-reset-parcelas');
    expect(btnReset).toBeInTheDocument();

    // Clica no botão para restaurar
    fireEvent.click(btnReset);
    expect((parcelasInput as HTMLInputElement).value).toBe('32');
    expect(screen.getByTestId('valor-parcela').textContent).toContain('202,09');
  });

  it('calcula a restituição do seguro em dobro com máscara monetária', () => {
    render(<App />);

    const mesesInput = screen.getByLabelText(/Meses Já Pagos/i);
    const valorSeguroInput = screen.getByLabelText(/Valor Seguro\/mês/i);

    fireEvent.change(mesesInput, { target: { value: '24' } });
    fireEvent.change(valorSeguroInput, { target: { value: '4550' } });

    expect((valorSeguroInput as HTMLInputElement).value).toBe('45,50');

    // 24 * 45.50 * 2 = 2184.00
    expect(screen.getByTestId('restituicao-seguro').textContent).toContain('2.184,00');
  });
});

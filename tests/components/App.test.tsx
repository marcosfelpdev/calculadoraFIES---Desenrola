import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';

describe('App - Calculadora FIES (Design Visual)', () => {
  it('renderiza o cabeçalho oficial, formulário e blocos de resultado, sem campos de seguro editáveis', () => {
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

    // Campos de seguro editáveis NÃO devem ser mais renderizados
    expect(screen.queryByLabelText(/Meses Já Pagos/i)).toBeNull();
    expect(screen.queryByLabelText(/Valor Seguro\/mês/i)).toBeNull();

    // Blocos de Resultados
    expect(screen.getByText(/Resultados da Revisão/i)).toBeInTheDocument();
    expect(screen.getByText(/ECONOMIA TOTAL/i)).toBeInTheDocument();
    expect(screen.getByText(/Condições de Pagamento/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Seguro Prestamista \(Venda Casada\)/i)
    ).toBeInTheDocument();
  });

  it('exibe botões de Condição do Benefício com texto visível estritamente 77%, 92% e 99%', () => {
    render(<App />);

    const btn77 = screen.getByRole('radio', { name: /77%/i });
    const btn92 = screen.getByRole('radio', { name: /92%/i });
    const btn99 = screen.getByRole('radio', { name: /99%/i });

    expect(btn77).toBeInTheDocument();
    expect(btn92).toBeInTheDocument();
    expect(btn99).toBeInTheDocument();

    expect(btn77.textContent).toBe('77%');
    expect(btn92.textContent).toBe('92%');
    expect(btn99.textContent).toBe('99%');
  });

  it('exibe os valores fixos previstos de Seguro Prestamista para Curso Regular e Medicina', () => {
    render(<App />);

    const cursoRegularEl = screen.getByTestId('seguro-curso-regular');
    const medicinaEl = screen.getByTestId('seguro-medicina');

    expect(cursoRegularEl).toBeInTheDocument();
    expect(cursoRegularEl.textContent).toContain('4.500,00');

    expect(medicinaEl).toBeInTheDocument();
    expect(medicinaEl.textContent).toContain('15.000,00');
  });

  it('permite selecionar ADIMPLENTE e INADIMPLENTE produzindo exatamente os mesmos resultados em tela', () => {
    render(<App />);

    const saldoInput = screen.getByLabelText(/Saldo Devedor Atual/i);
    const btnInadimplente = screen.getByRole('radio', {
      name: /^INADIMPLENTE$/i,
    });
    const btnAdimplente = screen.getByRole('radio', { name: /^ADIMPLENTE$/i });
    const btn77 = screen.getByRole('radio', { name: /77%/i });

    fireEvent.click(btn77);
    fireEvent.change(saldoInput, { target: { value: '3532300' } });

    // Estado inicial: ADIMPLENTE
    expect(btnAdimplente).toHaveAttribute('aria-checked', 'true');
    expect(btnInadimplente).toHaveAttribute('aria-checked', 'false');

    const ecoTotalAdimplente =
      screen.getByTestId('economia-total').textContent;
    const saldoOriginalAdimplente =
      screen.getByTestId('saldo-original').textContent;
    const ecoJurosAdimplente =
      screen.getByTestId('economia-juros').textContent;
    const descontoAdimplente =
      screen.getByTestId('desconto-desenrola').textContent;
    const novoSaldoAdimplente = screen.getByTestId('novo-saldo').textContent;
    const valorParcelaAdimplente =
      screen.getByTestId('valor-parcela').textContent;
    const qtdParcelasAdimplente = (
      screen.getByTestId('qtd-parcelas') as HTMLInputElement
    ).value;

    // Alterna para INADIMPLENTE
    fireEvent.click(btnInadimplente);
    expect(btnInadimplente).toHaveAttribute('aria-checked', 'true');
    expect(btnAdimplente).toHaveAttribute('aria-checked', 'false');

    // Compara todos os valores exibidos
    expect(screen.getByTestId('economia-total').textContent).toBe(
      ecoTotalAdimplente
    );
    expect(screen.getByTestId('saldo-original').textContent).toBe(
      saldoOriginalAdimplente
    );
    expect(screen.getByTestId('economia-juros').textContent).toBe(
      ecoJurosAdimplente
    );
    expect(screen.getByTestId('desconto-desenrola').textContent).toBe(
      descontoAdimplente
    );
    expect(screen.getByTestId('novo-saldo').textContent).toBe(
      novoSaldoAdimplente
    );
    expect(screen.getByTestId('valor-parcela').textContent).toBe(
      valorParcelaAdimplente
    );
    expect(
      (screen.getByTestId('qtd-parcelas') as HTMLInputElement).value
    ).toBe(qtdParcelasAdimplente);
  });

  it('formata valor monetário da direita para esquerda e recalcula em tempo real', () => {
    render(<App />);

    const saldoInput = screen.getByLabelText(/Saldo Devedor Atual/i);
    const btnInadimplente = screen.getByRole('radio', {
      name: /^INADIMPLENTE$/i,
    });
    const btn77 = screen.getByRole('radio', { name: /77%/i });

    // Clica nos botões segmentados
    fireEvent.click(btnInadimplente);
    fireEvent.click(btn77);

    // Digita 3532300 (representando 35.323,00 via máscara de centavos)
    fireEvent.change(saldoInput, { target: { value: '3532300' } });

    // Saldo formatado no input deve ser 35.323,00
    expect((saldoInput as HTMLInputElement).value).toBe('35.323,00');

    // Resultados calculados
    expect(screen.getByTestId('saldo-original').textContent).toContain(
      '35.323,00'
    );
    expect(screen.getByTestId('economia-juros').textContent).toContain(
      '7.205,89'
    );
    expect(screen.getByTestId('desconto-desenrola').textContent).toContain(
      '21.650,17'
    );
    expect(screen.getByTestId('economia-total').textContent).toContain(
      '28.856,07'
    );
    expect(screen.getByTestId('novo-saldo').textContent).toContain('6.466,93');
    expect(screen.getByTestId('valor-parcela').textContent).toContain('202,09');
  });

  it('permite alterar a quantidade de parcelas e restaurar ao padrão', () => {
    render(<App />);

    const saldoInput = screen.getByLabelText(/Saldo Devedor Atual/i);
    const btnInadimplente = screen.getByRole('radio', {
      name: /^INADIMPLENTE$/i,
    });
    const btn77 = screen.getByRole('radio', { name: /77%/i });

    fireEvent.click(btnInadimplente);
    fireEvent.click(btn77);
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
});

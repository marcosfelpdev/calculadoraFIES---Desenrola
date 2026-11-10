# Calculadora Financeira Desenrola FIES Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar uma SPA reativa em React + TypeScript + Vite para a Calculadora Financeira do Desenrola FIES, processando regras bancárias e jurídicas de recálculo em tempo real e com precisão matemática.

**Architecture:** A aplicação desacopla completamente o motor de cálculo financeiro (`calculatorEngine.ts` com funções puras e constantes de negócio) dos componentes de apresentação (`CalculatorForm.tsx` e `ResultsDisplay.tsx`). O estado do formulário é centralizado e reativo, disparando o recálculo imediato a cada alteração de input sem requisições de rede.

**Tech Stack:** React 19 / TypeScript / Vite / Vitest / @testing-library/react

**Spec:** Especificação do Desenrola FIES fornecida no prompt inicial do usuário.

## Global Constraints

- SPA sem backend: todo o cálculo ocorre no cliente em tempo real.
- Constantes internas fixas: `taxaJurosAnual = 0.034` (3,4%) e `parcelasRestantesPadrao = 175`.
- Fórmulas exatas especificadas nos Passos A a E devem ser rigorosamente respeitadas.
- Evitar erros de divisão por zero ou `NaN` com validações defensivas nos cálculos.
- Saídas monetárias formatadas em padrão BRL (`pt-BR`).

## Review Focus

- Input zerado ou negativo no saldo devedor (`saldoDevedorAtual <= 0`): deve resultar em saldos zerados e 0 parcelas sem quebrar a aplicação.
- Saldo devedor após descontos resultando em valor `<= 0`: `qtdParcelas` deve ser 0 e `valorDaParcela` deve ser 0.
- Situação do contrato "ADIMPLENTE" vs "INADIMPLENTE": verificar se a razão `(Saldo Devedor / 175) * 144` é aplicada apenas quando ADIMPLENTE.
- Quantidade de parcelas quando saldo devedor for inferior a R$ 200: a fórmula `MAX(1, INT(novoSaldoDevedor / 200))` deve produzir 1 parcela (se saldo > 0).
- Limite máximo de parcelas: se `novoSaldoDevedor / 200 > 180`, `qtdParcelas` deve ser limitada a exatamente 180.

---

### Task 1: Project Scaffolding & Test Environment Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/index.css`

**Interfaces:**
- Consumes: None
- Produces: Ambiente Vite + TypeScript + Vitest configurado e funcional.

- [ ] **Step 1: Criar configuração do projeto (package.json, tsconfig.json, vite.config.ts)**
Instalar dependências: `react`, `react-dom`, e devDependencies: `vite`, `@vitejs/plugin-react`, `typescript`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.

- [ ] **Step 2: Verificar a instalação e build**
Run: `npm install` e `npx tsc --noEmit`
Expected: Instalação sem erros.

- [ ] **Step 3: Criar arquivos base index.html, src/main.tsx e src/index.css**
Estruturar o HTML inicial e ponto de montagem do React.

- [ ] **Step 4: Verificar execução do teste dummy do Vitest**
Run: `npx vitest run`
Expected: Execução com sucesso do runner de testes.

- [ ] **Step 5: Commit**
```bash
git init
git add .
git commit -m "chore: scaffold react vite typescript project with vitest"
```

---

### Task 2: Core Types & Calculation Engine (TDD)

**Files:**
- Create: `src/types/calculator.ts`
- Create: `src/engine/calculatorEngine.ts`
- Create: `tests/engine/calculatorEngine.test.ts`

**Interfaces:**
- Consumes: None
- Produces:
  - Types: `SituacaoContrato`, `CondicaoBeneficio`, `CalculatorInputs`, `CalculatorOutputs`
  - Function: `calculateDesenrolaFies(inputs: CalculatorInputs): CalculatorOutputs`
  - Constants: `TAXA_JUROS_ANUAL`, `PARCELAS_RESTANTES_PADRAO`, `DESCONTOS_BENEFICIO`

- [ ] **Step 1: Escrever testes unitários cobrindo todos os passos de A a E e edge cases**
```typescript
// tests/engine/calculatorEngine.test.ts
import { describe, it, expect } from 'vitest';
import { calculateDesenrolaFies } from '../../src/engine/calculatorEngine';
import { CalculatorInputs } from '../../src/types/calculator';

describe('calculateDesenrolaFies', () => {
  it('calcula corretamente para INADIMPLENTE com benefício Nenhum (77%)', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2010,
      saldoDevedorAtual: 35323.00,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Nenhum',
      mesesJaPagosSeguro: 12,
      valorSeguroMes: 50.00,
    };
    const res = calculateDesenrolaFies(inputs);
    expect(res.valorBaseCalc).toBeCloseTo(35323.00, 2);
    expect(res.totalJurosPrice).toBeCloseTo(14411.784, 2);
    expect(res.totalJurosSimples).toBeCloseTo(7205.892, 2);
    expect(res.economiaJuros).toBeCloseTo(7205.892, 2);
    expect(res.saldoPosJuros).toBeCloseTo(28117.108, 2);
    expect(res.percentualDesconto).toBe(0.77);
    expect(res.descontoDesenrolaCalc).toBeCloseTo(21650.173, 2);
    expect(res.saldoDevedorOriginal).toBe(35323.00);
    expect(res.economiaTotal).toBeCloseTo(28856.065, 2);
    expect(res.novoSaldoDevedor).toBeCloseTo(6466.935, 2);
    expect(res.qtdParcelas).toBe(32);
    expect(res.valorDaParcela).toBeCloseTo(202.09, 2);
    expect(res.restituicaoEmDobro).toBe(1200.00);
  });

  it('calcula corretamente para ADIMPLENTE com base proporcional a 144/175', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2015,
      saldoDevedorAtual: 35323.00,
      dataAtual: '2026-11-10',
      situacaoContrato: 'ADIMPLENTE',
      condicaoBeneficio: 'Auxílio Emergencial ou CadÚnico - 1 ano',
      mesesJaPagosSeguro: 0,
      valorSeguroMes: 0,
    };
    const res = calculateDesenrolaFies(inputs);
    const expectedBase = (35323.00 / 175) * 144;
    expect(res.valorBaseCalc).toBeCloseTo(expectedBase, 4);
    expect(res.percentualDesconto).toBe(0.92);
  });

  it('trata saldo devedor zerado ou negativo sem divisão por zero', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2020,
      saldoDevedorAtual: 0,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Nenhum',
      mesesJaPagosSeguro: 0,
      valorSeguroMes: 0,
    };
    const res = calculateDesenrolaFies(inputs);
    expect(res.novoSaldoDevedor).toBe(0);
    expect(res.qtdParcelas).toBe(0);
    expect(res.valorDaParcela).toBe(0);
  });

  it('aplica o teto de 180 parcelas quando saldo for muito alto', () => {
    const inputs: CalculatorInputs = {
      anoContrato: 2020,
      saldoDevedorAtual: 1000000,
      dataAtual: '2026-11-10',
      situacaoContrato: 'INADIMPLENTE',
      condicaoBeneficio: 'Nenhum',
      mesesJaPagosSeguro: 0,
      valorSeguroMes: 0,
    };
    const res = calculateDesenrolaFies(inputs);
    expect(res.qtdParcelas).toBe(180);
  });
});
```

- [ ] **Step 2: Executar teste e validar falha esperada**
Run: `npx vitest run tests/engine/calculatorEngine.test.ts`
Expected: FAIL (módulo `calculatorEngine` ainda não existe).

- [ ] **Step 3: Implementar `src/types/calculator.ts` e `src/engine/calculatorEngine.ts`**
Criar as tipagens e implementar com rigor os passos A, B, C, D e E:
- Constantes: `TAXA_JUROS_ANUAL = 0.034`, `PARCELAS_RESTANTES_PADRAO = 175`.
- Mapeamento: `DESCONTOS_BENEFICIO: 'Nenhum' -> 0.77, 'Auxílio Emergencial ou CadÚnico - 1 ano' -> 0.92, 'Auxílio Emergencial ou CadÚnico - 5 anos' -> 0.99`.
- Lógica de `qtdParcelas`: `novoSaldoDevedor <= 0 ? 0 : Math.min(180, Math.max(1, Math.floor(novoSaldoDevedor / 200)))`.
- Proteções para valores menores que zero e divisão por zero.

- [ ] **Step 4: Executar os testes e validar aprovação**
Run: `npx vitest run tests/engine/calculatorEngine.test.ts`
Expected: PASS com 100% dos testes aprovados.

- [ ] **Step 5: Commit**
```bash
git add src/types/calculator.ts src/engine/calculatorEngine.ts tests/engine/calculatorEngine.test.ts
git commit -m "feat: implement Desenrola FIES mathematical engine with comprehensive unit tests"
```

---

### Task 3: Formatters & Helper Utilities

**Files:**
- Create: `src/utils/formatters.ts`
- Create: `tests/utils/formatters.test.ts`

**Interfaces:**
- Consumes: None
- Produces:
  - `formatCurrency(val: number): string` (BRL pt-BR)
  - `formatInteger(val: number): string`
  - `formatPercent(val: number): string`

- [ ] **Step 1: Escrever testes unitários para os formatadores**
Testar formatação BRL com separadores de milhar e centavos, valores zero e inteiros.

- [ ] **Step 2: Executar teste e validar falha**
Run: `npx vitest run tests/utils/formatters.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar `src/utils/formatters.ts` com `Intl.NumberFormat`**

- [ ] **Step 4: Executar testes e validar aprovação**
Run: `npx vitest run tests/utils/formatters.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/utils/formatters.ts tests/utils/formatters.test.ts
git commit -m "feat: add currency and number formatters for BRL display"
```

---

### Task 4: UI Components (CalculatorForm & ResultsDisplay)

**Files:**
- Create: `src/components/CalculatorForm.tsx`
- Create: `src/components/ResultsDisplay.tsx`
- Create: `src/App.tsx`
- Create: `tests/components/App.test.tsx`

**Interfaces:**
- Consumes:
  - `CalculatorInputs`, `CalculatorOutputs` de `src/types/calculator.ts`
  - `calculateDesenrolaFies` de `src/engine/calculatorEngine.ts`
  - `formatCurrency` de `src/utils/formatters.ts`
- Produces:
  - Interface reativa completa com os 3 blocos de resultados e formulário completo.

- [ ] **Step 1: Escrever testes de integração para o formulário e recálculo reativo em `App.test.tsx`**
Verificar se a alteração do saldo devedor ou da condição de benefício atualiza imediatamente os Blocos 1, 2 e 3 sem necessidade de botão "Calcular".

- [ ] **Step 2: Executar teste e validar falha**
Run: `npx vitest run tests/components/App.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar `CalculatorForm.tsx`**
Formulário controlado com os campos:
1. Ano do Contrato (número)
2. Saldo Devedor Atual (número monetário)
3. Data Atual (data)
4. Situação do Contrato (select: INADIMPLENTE, ADIMPLENTE)
5. Condição do Benefício (select: "Nenhum", "Auxílio Emergencial ou CadÚnico - 1 ano", "Auxílio Emergencial ou CadÚnico - 5 anos")
6. Meses Já Pagos (Seguro) (número inteiro)
7. Valor Seguro/mês (número monetário)

- [ ] **Step 4: Implementar `ResultsDisplay.tsx`**
Exibição dos 3 blocos:
- **Bloco 1: Resultados da Revisão**
  - Saldo Devedor Original (`saldoDevedorOriginal`)
  - Economia em Juros (`economiaJuros`)
  - Desconto Desenrola FIES (`descontoDesenrolaCalc`)
  - Economia Total (`economiaTotal`)
  - Novo Saldo Devedor (`novoSaldoDevedor`)
- **Bloco 2: Condições de Pagamento**
  - Qtd. de Parcelas (`qtdParcelas`)
  - Valor da Parcela (`valorDaParcela`)
- **Bloco 3: Seguro Prestamista (Venda Casada)**
  - Restituição em Dobro (`restituicaoEmDobro`)

- [ ] **Step 5: Integrar tudo no `src/App.tsx` com estado reativo**
Conectar `useState<CalculatorInputs>` ao motor `calculateDesenrolaFies` recalculando `outputs` em tempo real a cada keystroke.

- [ ] **Step 6: Executar testes de integração**
Run: `npx vitest run tests/components/App.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**
```bash
git add src/components/ src/App.tsx tests/components/App.test.tsx
git commit -m "feat: implement reactive CalculatorForm, ResultsDisplay and App integration"
```

---

### Task 5: Build Verification & Final Sanity Check

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Executar suite completa de testes**
Run: `npx vitest run`
Expected: Todos os testes passando sem erros.

- [ ] **Step 2: Executar compilação TypeScript e Build de Produção**
Run: `npx tsc --noEmit && npm run build`
Expected: Build do Vite gerado em `dist/` com saída sem erros.

- [ ] **Step 3: Documentar no README.md**
Explicar a estrutura da calculadora, as regras de negócio implementadas e como rodar o projeto.

- [ ] **Step 4: Commit**
```bash
git add README.md
git commit -m "docs: document Desenrola FIES calculator architecture and formulas"
```


# Calculadora Financeira Desenrola FIES

Aplicação web Single-Page (SPA) desenvolvida em **React 19**, **TypeScript** e **Vite** para simulação, revisão e acordo de contratos de financiamento do programa **Desenrola FIES**.

A aplicação processa regras de negócio jurídicas/bancárias e recalcula os resultados em **tempo real** à medida que os dados são inseridos.

---

## 🚀 Tecnologias

- **React 19**
- **TypeScript**
- **Vite**
- **Vitest** + **Testing Library** (TDD e testes automatizados)

---

## 🧮 Regras de Negócio e Motor de Cálculo

### Constantes Internas
- `taxaJurosAnual`: `0.034` (3,4%)
- `parcelasRestantesPadrao`: `175`

### Fluxo de Cálculo (Passos A ao E)
1. **Passo A: Cálculo Base e Expurgo de Juros**
   - Se Situação for **ADIMPLENTE**: `valorBaseCalc = (Saldo Devedor / 175) * 144`
   - Se Situação for **INADIMPLENTE**: `valorBaseCalc = Saldo Devedor`
   - `totalJurosPrice = valorBaseCalc * 0.034 * 12`
   - `totalJurosSimples = valorBaseCalc * 0.034 * 6`
   - `economiaJuros = totalJurosPrice - totalJurosSimples`
   - `saldoPosJuros = Saldo Devedor - economiaJuros`

2. **Passo B: Cálculo do Desconto do Governo (Desenrola)**
   - Condição do Benefício mapeada:
     - `"Nenhum"`: 77% (0.77)
     - `"Auxílio Emergencial ou CadÚnico - 1 ano"`: 92% (0.92)
     - `"Auxílio Emergencial ou CadÚnico - 5 anos"`: 99% (0.99)
   - `descontoDesenrolaCalc = saldoPosJuros * percentualDesconto`

3. **Passo C: Consolidação dos Resultados**
   - `saldoDevedorOriginal = Saldo Devedor Atual`
   - `economiaTotal = economiaJuros + descontoDesenrolaCalc`
   - `novoSaldoDevedor = saldoDevedorOriginal - economiaTotal`

4. **Passo D: Regras Bancárias de Parcelamento**
   - Se `novoSaldoDevedor <= 0`, então `qtdParcelas = 0` e `valorDaParcela = 0`.
   - Caso contrário: `qtdParcelas = MIN(180, MAX(1, INT(novoSaldoDevedor / 200)))`.
   - `valorDaParcela = novoSaldoDevedor / qtdParcelas`.

5. **Passo E: Restituição de Venda Casada (Seguro)**
   - `restituicaoEmDobro = Meses Já Pagos * Valor Seguro/mês * 2`.

---

## 💻 Como Executar

### Pré-requisitos
- Node.js >= 18 (testado no v24)
- npm

### Instalação
```bash
npm install
```

### Modo de Desenvolvimento
```bash
npm run dev
```
Abra o link exibido no terminal (ex: `http://localhost:5173`).

### Execução dos Testes Automatizados
```bash
npm test
```

### Build de Produção
```bash
npm run build
```
Os arquivos estáticos otimizados serão gerados na pasta `dist/`.

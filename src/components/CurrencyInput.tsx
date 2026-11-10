import type { FC, ChangeEvent } from 'react';
import { parseDigitsToCents, formatCentsToBRL } from '../utils/currencyMask';

interface CurrencyInputProps {
  id: string;
  name?: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
}

export const CurrencyInput: FC<CurrencyInputProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder = '0,00',
  className = '',
}) => {
  const cents = Math.round((Number(value) || 0) * 100);
  const displayValue = value > 0 ? formatCentsToBRL(cents) : '';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parsedCents = parseDigitsToCents(raw);
    onChange(parsedCents / 100);
  };

  return (
    <div className="currency-input-wrapper">
      <span className="currency-prefix">R$</span>
      <input
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`currency-input ${className}`.trim()}
      />
    </div>
  );
};

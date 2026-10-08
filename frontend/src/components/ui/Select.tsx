'use client';

import { ChevronsUpDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'เลือก...',
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const selected = options.find((o) => o.value === value);
  const isDisabled = disabled || options.length === 0;

  return (
    <div>
      <div className="relative">
        <select
          value={selected?.value ?? ''}
          onChange={(event) => onChange(event.currentTarget.value)}
          disabled={isDisabled}
          className={`font-body text-sm w-full appearance-none rounded-module border px-4 py-2.5 pr-10 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
          isDisabled
            ? 'bg-tertiary border-secondary text-neutral/40 cursor-not-allowed'
            : 'bg-white border-secondary text-neutral hover:border-primary/50'
          }`}
        >
          <option value="" disabled>
            {options.length === 0 ? 'ยังไม่มีข้อมูล' : placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronsUpDown
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral/40"
          aria-hidden="true"
        />
      </div>
      {selected?.hint && <p className="mt-1 text-xs text-neutral/50">{selected.hint}</p>}
    </div>
  );
}

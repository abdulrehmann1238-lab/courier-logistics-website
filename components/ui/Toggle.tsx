import React from 'react';

export function Toggle({
  checked,
  onChange,
  label,
  id,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
}) {
  const toggleId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label htmlFor={toggleId} className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <button
        type="button"
        id={toggleId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          checked ? 'bg-primary' : 'bg-border-strong'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
            checked ? 'translate-x-4' : 'translate-x-1'
          }`}
        />
      </button>
      {label && <span className="text-sm font-medium text-ink">{label}</span>}
    </label>
  );
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
  hint?: string;
}

export function Select({ label, options, hint, className = '', id, ...props }: SelectProps) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full bg-surface-elevated text-ink text-sm rounded-sm border border-border-strong focus:border-primary transition-colors py-2.5 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {hint && <p className="text-xs text-text-muted mt-1">{hint}</p>}
    </div>
  );
}

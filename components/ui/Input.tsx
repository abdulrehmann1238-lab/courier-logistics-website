import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  iconPrefix?: React.ReactNode;
  iconSuffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, iconPrefix, iconSuffix, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {iconPrefix && (
            <span className="absolute left-3 text-text-muted pointer-events-none flex items-center">
              {iconPrefix}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-surface-elevated text-ink text-sm rounded-sm border ${
              error ? 'border-error focus:border-error' : 'border-border-strong focus:border-primary'
            } transition-colors placeholder:text-text-muted py-2.5 ${
              iconPrefix ? 'pl-9' : 'pl-3'
            } ${iconSuffix ? 'pr-9' : 'pr-3'} focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:bg-surface-sunken ${className}`}
            {...props}
          />
          {iconSuffix && (
            <span className="absolute right-3 text-text-muted pointer-events-none flex items-center">
              {iconSuffix}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-error mt-1">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted mt-1">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

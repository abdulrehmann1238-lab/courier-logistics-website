import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isSuccess?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isSuccess = false,
      icon,
      iconRight,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles
    const base =
      'inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-45';

    // Sizes
    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-sm gap-1.5',
      md: 'h-10 px-4 text-sm rounded-sm gap-2',
      lg: 'h-12 px-5 text-base rounded-md gap-2.5',
    };

    // Variants
    const variants = {
      primary:
        'bg-primary text-surface-elevated hover:bg-primary-hover active:bg-primary-active active:scale-[0.98] border border-transparent shadow-1',
      accent:
        'bg-accent text-surface-elevated hover:brightness-110 active:scale-[0.98] border border-transparent shadow-1',
      secondary:
        'bg-surface-elevated text-ink border border-border-strong hover:bg-surface-sunken active:scale-[0.98] shadow-1',
      ghost:
        'bg-transparent text-ink hover:bg-surface-sunken border border-transparent',
      danger:
        'bg-error text-surface-elevated hover:brightness-110 active:scale-[0.98] border border-transparent',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isSuccess ? (
          <svg className="w-4 h-4 text-current animate-in zoom-in-75 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <>
            {icon && <span className="shrink-0">{icon}</span>}
            <span>{children}</span>
            {iconRight && <span className="shrink-0 transition-transform group-hover:translate-x-0.5">{iconRight}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

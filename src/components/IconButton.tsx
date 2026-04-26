import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '../utils/cn';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: ReactNode;
  variant?: 'default' | 'ghost' | 'danger';
};

const variantClass = {
  default: 'border-white/10 bg-elevated text-text-secondary hover:border-white/20 hover:text-text-primary',
  ghost: 'border-transparent bg-transparent text-text-secondary hover:bg-white/5 hover:text-text-primary',
  danger: 'border-danger/20 bg-danger/10 text-danger hover:border-danger/40',
};

export const IconButton = ({
  className,
  icon,
  label,
  type = 'button',
  variant = 'default',
  ...props
}: IconButtonProps) => (
  <button
    aria-label={label}
    title={label}
    type={type}
    className={cn(
      'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-app border transition duration-200 ease-app active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
      variantClass[variant],
      className,
    )}
    {...props}
  >
    {icon}
  </button>
);

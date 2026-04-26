import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';

import { cn } from '../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  isLoading?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-text-primary shadow-glow hover:bg-[#8B72FF]',
  secondary:
    'border border-white/10 bg-elevated text-text-primary hover:border-white/20 hover:bg-white/[0.06]',
  ghost: 'bg-transparent text-text-secondary hover:bg-white/5 hover:text-text-primary',
  danger: 'bg-danger text-text-primary hover:bg-[#F15D5D]',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-3 text-xs',
  md: 'min-h-11 px-4 text-sm',
  lg: 'min-h-12 px-5 text-sm',
};

export const Button = ({
  children,
  className,
  disabled,
  icon,
  isLoading = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) => (
  <button
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-app py-2 font-semibold transition duration-200 ease-app active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55 disabled:active:scale-100',
      variantClass[variant],
      sizeClass[size],
      className,
    )}
    disabled={disabled || isLoading}
    type={type}
    {...props}
  >
    {isLoading ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : icon}
    <span>{isLoading ? 'Carregando' : children}</span>
  </button>
);

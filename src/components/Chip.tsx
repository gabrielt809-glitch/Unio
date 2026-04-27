import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '../utils/cn';

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  icon?: ReactNode;
};

export const Chip = ({
  children,
  className,
  icon,
  selected = false,
  type = 'button',
  ...props
}: ChipProps) => (
  <button
    aria-pressed={selected}
    className={cn(
      'inline-flex min-h-10 items-center justify-center gap-2 rounded-app border px-3 text-sm font-semibold transition duration-200 ease-app',
      'max-w-full min-w-0',
      selected
        ? 'border-primary/30 bg-primary/15 text-text-primary'
        : 'border-white/10 bg-white/5 text-text-secondary hover:border-white/20 hover:text-text-primary',
      className,
    )}
    type={type}
    {...props}
  >
    {icon}
    <span className="min-w-0 truncate">{children}</span>
  </button>
);

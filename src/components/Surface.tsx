import type { HTMLAttributes } from 'react';

import { cn } from '../utils/cn';

type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'elevated' | 'muted' | 'interactive';
};

const variantClass = {
  default: 'border-white/10 bg-surface shadow-panel',
  elevated: 'border-white/10 bg-elevated shadow-panel',
  muted: 'border-white/10 bg-white/[0.03]',
  interactive:
    'border-white/10 bg-surface shadow-panel transition duration-200 ease-app hover:border-white/20 hover:bg-elevated/70',
};

export const Surface = ({ className, variant = 'default', ...props }: SurfaceProps) => (
  <div className={cn('min-w-0 rounded-panel border p-4', variantClass[variant], className)} {...props} />
);

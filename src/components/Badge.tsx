import type { HTMLAttributes } from 'react';

import { cn } from '../utils/cn';

type BadgeTone = 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'danger';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const toneClass: Record<BadgeTone, string> = {
  neutral: 'border-white/10 bg-white/5 text-text-secondary',
  primary: 'border-primary/20 bg-primary/10 text-primary',
  accent: 'border-accent/20 bg-accent/10 text-accent',
  success: 'border-success/20 bg-success/10 text-success',
  warning: 'border-warning/20 bg-warning/10 text-warning',
  danger: 'border-danger/20 bg-danger/10 text-danger',
};

export const Badge = ({ className, tone = 'neutral', ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex min-h-7 items-center rounded-app border px-2.5 text-xs font-semibold',
      'max-w-full min-w-0 break-words',
      toneClass[tone],
      className,
    )}
    {...props}
  />
);

import type { ReactNode } from 'react';

import { cn } from '../utils/cn';

type MetricTileProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  tone?: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
  className?: string;
};

const toneClass = {
  primary: 'text-primary bg-primary/10',
  accent: 'text-accent bg-accent/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  danger: 'text-danger bg-danger/10',
} as const;

export const MetricTile = ({ className, detail, icon, label, tone = 'primary', value }: MetricTileProps) => (
  <div className={cn('rounded-panel border border-white/10 bg-elevated/80 p-4 shadow-panel', className)}>
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase text-text-secondary">{label}</p>
        <p className="mt-2 truncate text-2xl font-extrabold text-text-primary">{value}</p>
        {detail ? <p className="mt-1 truncate text-xs text-text-secondary">{detail}</p> : null}
      </div>
      {icon ? (
        <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-app', toneClass[tone])}>
          {icon}
        </div>
      ) : null}
    </div>
  </div>
);

import type { ReactNode } from 'react';

import { cn } from '../utils/cn';

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export const SectionHeader = ({ action, className, description, title }: SectionHeaderProps) => (
  <div className={cn('flex items-start justify-between gap-4', className)}>
    <div className="min-w-0">
      <h2 className="text-lg font-bold text-text-primary">{title}</h2>
      {description ? <p className="mt-1 text-sm leading-6 text-text-secondary">{description}</p> : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);

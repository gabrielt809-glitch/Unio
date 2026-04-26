import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../utils/cn';
import { Surface } from './Surface';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export const Card = ({ action, children, className, description, title, ...props }: CardProps) => (
  <Surface className={cn('grid gap-4', className)} {...props}>
    {title || description || action ? (
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {title ? <h3 className="text-base font-bold text-text-primary">{title}</h3> : null}
          {description ? <p className="mt-1 text-sm leading-6 text-text-secondary">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    ) : null}
    {children}
  </Surface>
);

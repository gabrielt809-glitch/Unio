import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../utils/cn';

export const SafeArea = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('safe-area-x', className)} {...props} />
);

export const Screen = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'min-h-screen bg-background text-text-primary selection:bg-accent selection:text-background',
      className,
    )}
    {...props}
  />
);

export const PageContainer = ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
  <main
    className={cn(
      'safe-area-x mx-auto w-full max-w-2xl pb-[calc(6.5rem+var(--safe-bottom))] pt-4',
      className,
    )}
    {...props}
  />
);

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export const PageHeader = ({ action, className, description, eyebrow, title }: PageHeaderProps) => (
  <header className={cn('flex items-start justify-between gap-4', className)}>
    <div className="min-w-0">
      {eyebrow ? <p className="text-xs font-semibold uppercase text-accent">{eyebrow}</p> : null}
      <h1 className="mt-1 text-2xl font-extrabold tracking-normal text-text-primary">{title}</h1>
      {description ? <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p> : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </header>
);

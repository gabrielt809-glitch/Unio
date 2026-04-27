import type { ReactNode } from 'react';

import { AlertCircle, Inbox, LoaderCircle } from 'lucide-react';

import { cn } from '../utils/cn';

type StateViewProps = {
  title: string;
  description: string;
  action?: ReactNode;
  tone?: 'empty' | 'error' | 'loading';
  className?: string;
};

const toneClass = {
  empty: 'border-white/10 bg-white/[0.03] text-accent',
  error: 'border-danger/20 bg-danger/10 text-danger',
  loading: 'border-accent/20 bg-accent/10 text-accent',
};

export const StateView = ({ action, className, description, title, tone = 'empty' }: StateViewProps) => {
  const Icon = tone === 'error' ? AlertCircle : tone === 'loading' ? LoaderCircle : Inbox;

  return (
    <div
      className={cn(
        'grid min-h-40 min-w-0 place-items-center rounded-panel border border-dashed p-6 text-center',
        toneClass[tone],
        className,
      )}
    >
      <div className="min-w-0 max-w-xs">
        <Icon
          aria-hidden="true"
          className={cn('mx-auto mb-3 h-6 w-6', tone === 'loading' && 'animate-spin')}
        />
        <h3 className="break-words text-sm font-bold text-text-primary">{title}</h3>
        <p className="mt-2 break-words text-sm leading-6 text-text-secondary">{description}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
};

export const EmptyState = (props: Omit<StateViewProps, 'tone'>) => <StateView tone="empty" {...props} />;

export const LoadingState = (props: Omit<StateViewProps, 'tone'>) => <StateView tone="loading" {...props} />;

export const ErrorState = (props: Omit<StateViewProps, 'tone'>) => <StateView tone="error" {...props} />;

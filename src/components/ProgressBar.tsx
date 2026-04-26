import { cn } from '../utils/cn';

type ProgressBarProps = {
  value: number;
  label: string;
  tone?: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
  className?: string;
};

const toneClass = {
  primary: 'bg-primary',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export const ProgressBar = ({ className, label, tone = 'primary', value }: ProgressBarProps) => {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('grid gap-2', className)}>
      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-text-secondary">
        <span>{label}</span>
        <span>{safeValue}%</span>
      </div>
      <div
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={safeValue}
        className="h-2 overflow-hidden rounded-full bg-white/[0.08]"
        role="progressbar"
      >
        <div
          className={cn('h-full rounded-full transition-all duration-300 ease-app', toneClass[tone])}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};

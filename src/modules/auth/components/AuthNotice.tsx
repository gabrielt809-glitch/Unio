import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

type AuthNoticeProps = {
  children: ReactNode;
  tone: 'success' | 'error';
};

export const AuthNotice = ({ children, tone }: AuthNoticeProps) => {
  const Icon = tone === 'success' ? CheckCircle2 : AlertCircle;
  const toneClass =
    tone === 'success'
      ? 'border-success/20 bg-success/10 text-success'
      : 'border-danger/20 bg-danger/10 text-danger';

  return (
    <div className={`flex gap-3 rounded-app border p-3 text-sm ${toneClass}`}>
      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="leading-6">{children}</p>
    </div>
  );
};

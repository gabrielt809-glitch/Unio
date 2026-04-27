import type { ReactNode } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';

import { Badge } from '../../../components/Badge';
import { Divider } from '../../../components/Divider';
import { Surface } from '../../../components/Surface';
import type { AuthMode } from '../types/authTypes';
import { AuthModeTabs } from './AuthModeTabs';

type AuthPanelProps = {
  activeMode: AuthMode;
  children: ReactNode;
  description: string;
  onModeChange: (mode: AuthMode) => void;
  showTabs?: boolean;
  title: string;
};

export const AuthPanel = ({
  activeMode,
  children,
  description,
  onModeChange,
  showTabs = true,
  title,
}: AuthPanelProps) => (
  <Surface variant="elevated" className="overflow-hidden p-0">
    <div className="border-b border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between gap-3">
        <Badge tone="accent">Unio</Badge>
        <Badge tone="success" className="gap-2">
          <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
          RLS ativo
        </Badge>
      </div>
      <h1 className="mt-4 text-3xl font-extrabold text-text-primary">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>
    </div>

    <div className="grid gap-5 p-5">
      <div className="grid grid-cols-2 gap-3 text-xs text-text-secondary">
        <div className="rounded-app border border-white/10 bg-background/70 p-3">
          <KeyRound aria-hidden="true" className="mb-2 h-4 w-4 text-primary" />
          Sessao persistida
        </div>
        <div className="rounded-app border border-white/10 bg-background/70 p-3">
          <ShieldCheck aria-hidden="true" className="mb-2 h-4 w-4 text-accent" />
          Dados protegidos
        </div>
      </div>

      {showTabs ? <AuthModeTabs activeMode={activeMode} onChange={onModeChange} /> : null}
      <Divider />
      {children}
    </div>
  </Surface>
);

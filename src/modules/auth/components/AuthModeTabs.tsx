import { cn } from '../../../utils/cn';
import type { AuthMode } from '../types/authTypes';

type AuthModeTabsProps = {
  activeMode: AuthMode;
  onChange: (mode: AuthMode) => void;
};

const tabs = [
  { mode: 'login', label: 'Senha' },
  { mode: 'register', label: 'Cadastro' },
  { mode: 'magic-link', label: 'Magic link' },
] as const;

export const AuthModeTabs = ({ activeMode, onChange }: AuthModeTabsProps) => (
  <div
    aria-label="Escolha a forma de acesso"
    className="grid grid-cols-3 gap-1 rounded-app border border-white/10 bg-background/70 p-1"
    role="tablist"
  >
    {tabs.map((tab) => {
      const isActive = activeMode === tab.mode;

      return (
        <button
          key={tab.mode}
          aria-selected={isActive}
          className={cn(
            'min-h-10 rounded-app px-2 text-xs font-semibold transition duration-200 ease-app',
            isActive
              ? 'bg-elevated text-text-primary shadow-accent'
              : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
          )}
          role="tab"
          type="button"
          onClick={() => onChange(tab.mode)}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

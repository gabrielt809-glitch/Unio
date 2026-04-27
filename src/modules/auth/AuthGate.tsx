import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '../../components/Badge';
import { Screen } from '../../components/Layout';
import { StateView } from '../../components/StateView';
import { Surface } from '../../components/Surface';
import { supabaseEnv } from '../../config/env';
import { AuthPanel } from './components/AuthPanel';
import { AuthShell } from './components/AuthShell';
import { MagicLinkForm } from './components/MagicLinkForm';
import { PasswordLoginForm } from './components/PasswordLoginForm';
import { PasswordRecoveryForm } from './components/PasswordRecoveryForm';
import { RegisterForm } from './components/RegisterForm';
import { ResetPasswordForm } from './components/ResetPasswordForm';
import { UserFoundationGate } from './components/UserFoundationGate';
import { useAuth } from './hooks/useAuth';
import type { AuthMode } from './types/authTypes';

type AuthGateProps = {
  children: (user: User) => ReactNode;
};

const modeCopy: Record<AuthMode, { title: string; description: string }> = {
  login: {
    title: 'Entrar no Unio.',
    description: 'Acesse seu Life OS pessoal com email e senha.',
  },
  register: {
    title: 'Criar seu Unio.',
    description: 'Comece com um espaco pessoal protegido e pronto para evoluir.',
  },
  'magic-link': {
    title: 'Tudo em um so lugar.',
    description: 'Receba um link seguro por email para entrar sem senha.',
  },
  'recover-password': {
    title: 'Recuperar senha.',
    description: 'Enviaremos um link seguro para voce definir uma nova senha.',
  },
  'reset-password': {
    title: 'Definir nova senha.',
    description: 'Escolha uma nova senha para continuar usando o Unio.',
  },
};

const SupabaseSetup = () => (
  <AuthShell>
    <Surface variant="elevated">
      <Badge tone="accent">Unio</Badge>
      <h1 className="mt-2 text-2xl font-extrabold text-text-primary">Conecte o Supabase</h1>
      <p className="mt-3 text-sm leading-6 text-text-secondary">
        Crie um arquivo `.env` com as chaves publicas do Supabase, rode a migration em `supabase/migrations` e
        reinicie o Vite.
      </p>
      <div className="mt-5 rounded-app border border-white/10 bg-background/80 p-3 text-xs leading-6 text-text-secondary">
        <p>VITE_SUPABASE_URL=https://your-project.supabase.co</p>
        <p>VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key</p>
      </div>
    </Surface>
  </AuthShell>
);

export const AuthGate = ({ children }: AuthGateProps) => {
  const { clearRecoveryRequired, error, isAuthenticated, recoveryRequired, status, user } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');

  useEffect(() => {
    if (recoveryRequired) {
      setMode('reset-password');
    }
  }, [recoveryRequired]);

  const copy = useMemo(() => modeCopy[mode], [mode]);

  if (!supabaseEnv.isConfigured) {
    return <SupabaseSetup />;
  }

  if (status === 'loading') {
    return (
      <Screen className="grid place-items-center px-4">
        <StateView
          tone="loading"
          title="Preparando o Unio"
          description="Sincronizando sessao e preferencias."
        />
      </Screen>
    );
  }

  if (status === 'error') {
    return (
      <Screen className="grid place-items-center px-4">
        <StateView
          tone="error"
          title="Nao foi possivel iniciar"
          description={error ?? 'Tente novamente em instantes.'}
        />
      </Screen>
    );
  }

  if (isAuthenticated && user && !recoveryRequired) {
    return <UserFoundationGate user={user}>{children}</UserFoundationGate>;
  }

  const renderForm = () => {
    switch (mode) {
      case 'register':
        return <RegisterForm />;
      case 'magic-link':
        return <MagicLinkForm />;
      case 'recover-password':
        return <PasswordRecoveryForm onBack={() => setMode('login')} />;
      case 'reset-password':
        return <ResetPasswordForm onComplete={clearRecoveryRequired} />;
      case 'login':
      default:
        return <PasswordLoginForm onRecoverPassword={() => setMode('recover-password')} />;
    }
  };

  return (
    <AuthShell>
      <AuthPanel
        activeMode={mode}
        description={copy.description}
        showTabs={mode !== 'recover-password' && mode !== 'reset-password'}
        title={copy.title}
        onModeChange={setMode}
      >
        {renderForm()}
      </AuthPanel>
    </AuthShell>
  );
};

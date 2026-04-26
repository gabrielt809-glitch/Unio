import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { CheckCircle2, KeyRound, LogIn, ShieldCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Divider } from '../../components/Divider';
import { FieldShell, TextInput } from '../../components/Field';
import { Screen } from '../../components/Layout';
import { StateView } from '../../components/StateView';
import { Surface } from '../../components/Surface';
import { supabaseEnv } from '../../config/env';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { signInWithEmail } from './authService';
import { useAuth } from './useAuth';

type AuthGateProps = {
  children: (user: User) => ReactNode;
};

const AuthShell = ({ children }: { children: ReactNode }) => (
  <Screen className="grid place-items-center overflow-x-hidden px-4 py-[calc(2rem+var(--safe-top))]">
    <div className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md">{children}</div>
  </Screen>
);

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
  const { error, isAuthenticated, status, user } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const signInAction = useAsyncAction();

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

  if (isAuthenticated && user) {
    return children(user);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void signInAction.run(async () => {
      await signInWithEmail(email);
      setSent(true);
    });
  };

  return (
    <AuthShell>
      <Surface variant="elevated" className="overflow-hidden p-0">
        <div className="border-b border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-3">
            <Badge tone="accent">Unio</Badge>
            <Badge tone="success" className="gap-2">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
              RLS ativo
            </Badge>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-text-primary">Tudo em um so lugar.</h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Acesse seu Life OS pessoal com um link seguro por email. Seus dados ficam isolados por usuario e
            espaco.
          </p>
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

          <Divider />

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <FieldShell label="Email">
              <TextInput
                autoComplete="email"
                inputMode="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@email.com"
                required
                type="email"
                value={email}
              />
            </FieldShell>
            <Button
              icon={<LogIn aria-hidden="true" className="h-4 w-4" />}
              isLoading={signInAction.isRunning}
              size="lg"
              type="submit"
            >
              Enviar link seguro
            </Button>
          </form>

          {sent ? (
            <div className="flex gap-3 rounded-app border border-success/20 bg-success/10 p-3 text-sm text-success">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Link enviado. Confira sua caixa de entrada para continuar.</p>
            </div>
          ) : null}
          {signInAction.error ? (
            <div className="rounded-app border border-danger/20 bg-danger/10 p-3 text-sm text-danger">
              {signInAction.error}
            </div>
          ) : null}
        </div>
      </Surface>
    </AuthShell>
  );
};

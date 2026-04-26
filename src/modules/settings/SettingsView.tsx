import type { User } from '@supabase/supabase-js';
import { LogOut, ShieldCheck, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Divider } from '../../components/Divider';
import { Button } from '../../components/Button';
import { MetricTile } from '../../components/MetricTile';
import { SectionHeader } from '../../components/SectionHeader';
import { Surface } from '../../components/Surface';
import { supabaseEnv } from '../../config/env';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import type { Space } from '../../types/database';
import { signOut } from '../auth/authService';

type SettingsViewProps = {
  user: User;
  space: Space;
};

export const SettingsView = ({ space, user }: SettingsViewProps) => {
  const action = useAsyncAction();
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.ready
      .then(() => setServiceWorkerReady(true))
      .catch(() => setServiceWorkerReady(false));
  }, []);

  return (
    <div className="grid gap-4">
      <SectionHeader
        title="Ajustes"
        description="Configuracoes essenciais do espaco pessoal e da instalacao PWA."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <MetricTile
          icon={<ShieldCheck aria-hidden="true" className="h-5 w-5" />}
          label="Supabase"
          tone={supabaseEnv.isConfigured ? 'success' : 'danger'}
          value={supabaseEnv.isConfigured ? 'Conectado' : 'Pendente'}
        />
        <MetricTile
          icon={<Smartphone aria-hidden="true" className="h-5 w-5" />}
          label="PWA"
          tone={serviceWorkerReady ? 'success' : 'warning'}
          value={serviceWorkerReady ? 'Ativo' : 'Aguardando'}
        />
      </div>

      <Surface>
        <div className="grid gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-text-secondary">Usuario</p>
            <p className="mt-1 break-all text-sm font-semibold text-text-primary">{user.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-text-secondary">User ID</p>
            <p className="mt-1 break-all text-xs text-text-secondary">{user.id}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-text-secondary">Space ID</p>
            <p className="mt-1 break-all text-xs text-text-secondary">{space.id}</p>
          </div>
        </div>
      </Surface>

      <Surface>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary">Sessao</h2>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              Sair remove apenas a sessao local. Os dados permanecem no Supabase.
            </p>
          </div>
          <Button
            icon={<LogOut aria-hidden="true" className="h-4 w-4" />}
            isLoading={action.isRunning}
            variant="secondary"
            onClick={() => void action.run(signOut)}
          >
            Sair
          </Button>
        </div>
        <Divider className="my-4" />
        <p className="text-xs leading-5 text-text-secondary">
          Use uma conta de teste para validar login real, RLS e persistencia antes de inserir dados pessoais.
        </p>
        {action.error ? <p className="mt-3 text-sm text-danger">{action.error}</p> : null}
      </Surface>
    </div>
  );
};

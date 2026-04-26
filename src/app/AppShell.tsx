import type { User } from '@supabase/supabase-js';

import { PageContainer, Screen } from '../components/Layout';
import { StateView } from '../components/StateView';
import { usePersonalSpace } from '../modules/spaces/usePersonalSpace';
import { useUiStore } from '../store/uiStore';
import { BottomNav } from './BottomNav';
import { renderRoute } from './routes';
import { TopBar } from './TopBar';

type AppShellProps = {
  user: User;
};

export const AppShell = ({ user }: AppShellProps) => {
  const { activeRoute } = useUiStore();
  const { error, isLoading, space } = usePersonalSpace(user.id);

  if (isLoading) {
    return (
      <Screen className="grid place-items-center px-4">
        <StateView
          tone="loading"
          title="Preparando espaco pessoal"
          description="Criando ou recuperando o espaco padrao."
        />
      </Screen>
    );
  }

  if (error || !space) {
    return (
      <Screen className="grid place-items-center px-4">
        <StateView
          tone="error"
          title="Espaco indisponivel"
          description={error ?? 'Nao foi possivel carregar seu espaco pessoal.'}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar spaceName={space.name} userEmail={user.email ?? 'usuario conectado'} />
      <PageContainer>{renderRoute({ route: activeRoute, space, user })}</PageContainer>
      <BottomNav />
    </Screen>
  );
};

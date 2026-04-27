import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';

import { Button } from '../../../components/Button';
import { Screen } from '../../../components/Layout';
import { StateView } from '../../../components/StateView';
import { useUserFoundation } from '../hooks/useUserFoundation';

type UserFoundationGateProps = {
  children: (user: User) => ReactNode;
  user: User;
};

export const UserFoundationGate = ({ children, user }: UserFoundationGateProps) => {
  const foundation = useUserFoundation(user);

  if (foundation.status === 'ready') {
    return children(user);
  }

  if (foundation.status === 'error') {
    return (
      <Screen className="grid place-items-center px-4">
        <StateView
          action={<Button onClick={foundation.retry}>Tentar novamente</Button>}
          tone="error"
          title="Nao foi possivel preparar seu espaco"
          description={foundation.error ?? 'Tente novamente em instantes.'}
        />
      </Screen>
    );
  }

  return (
    <Screen className="grid place-items-center px-4">
      <StateView
        tone="loading"
        title="Preparando seu espaco"
        description="Garantindo profile, espaco pessoal e preferencias."
      />
    </Screen>
  );
};

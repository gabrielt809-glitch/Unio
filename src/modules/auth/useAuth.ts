import type { Session } from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';

import { supabase } from '../../services/supabase/client';
import { toErrorMessage } from '../../utils/errors';
import { getCurrentSession } from './authService';

type AuthState = {
  session: Session | null;
  status: 'loading' | 'ready' | 'error';
  error: string | null;
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    session: null,
    status: supabase ? 'loading' : 'ready',
    error: null,
  });

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    let isMounted = true;

    getCurrentSession()
      .then((session) => {
        if (isMounted) {
          setState({ session, status: 'ready', error: null });
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setState({ session: null, status: 'error', error: toErrorMessage(error) });
        }
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ session, status: 'ready', error: null });
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return useMemo(
    () => ({
      ...state,
      user: state.session?.user ?? null,
      isAuthenticated: Boolean(state.session?.user),
    }),
    [state],
  );
};

import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { supabase } from '../../../services/supabase/client';
import { toErrorMessage } from '../../../utils/errors';
import { getCurrentSession } from '../services/authService';
import { hasPasswordRecoveryIntent } from '../utils/authRedirect';

type AuthState = {
  session: Session | null;
  status: 'loading' | 'ready' | 'error';
  error: string | null;
  recoveryRequired: boolean;
};

const shouldStartRecovery = () => (typeof window !== 'undefined' ? hasPasswordRecoveryIntent() : false);

const isRecoveryEvent = (event: AuthChangeEvent) => event === 'PASSWORD_RECOVERY';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    session: null,
    status: supabase ? 'loading' : 'ready',
    error: null,
    recoveryRequired: shouldStartRecovery(),
  });

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    let isMounted = true;

    getCurrentSession()
      .then((session) => {
        if (isMounted) {
          setState((current) => ({ ...current, session, status: 'ready', error: null }));
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setState((current) => ({
            ...current,
            session: null,
            status: 'error',
            error: toErrorMessage(error),
          }));
        }
      });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setState((current) => ({
        ...current,
        session,
        status: 'ready',
        error: null,
        recoveryRequired: isRecoveryEvent(event)
          ? true
          : event === 'SIGNED_OUT'
            ? false
            : current.recoveryRequired,
      }));
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const clearRecoveryRequired = useCallback(() => {
    setState((current) => ({ ...current, recoveryRequired: false }));
    window.history.replaceState(null, document.title, window.location.pathname);
  }, []);

  return useMemo(
    () => ({
      ...state,
      clearRecoveryRequired,
      user: state.session?.user ?? null,
      isAuthenticated: Boolean(state.session?.user),
    }),
    [clearRecoveryRequired, state],
  );
};

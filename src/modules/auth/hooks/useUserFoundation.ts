import type { User } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';

import { toErrorMessage } from '../../../utils/errors';
import { ensureUserFoundation } from '../services/userFoundationService';

type UserFoundationState = {
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  retry: () => void;
};

export const useUserFoundation = (user: User | null): UserFoundationState => {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<Omit<UserFoundationState, 'retry'>>({
    status: user ? 'loading' : 'idle',
    error: null,
  });

  useEffect(() => {
    if (!user) {
      setState({ status: 'idle', error: null });
      return;
    }

    let isMounted = true;
    setState({ status: 'loading', error: null });

    ensureUserFoundation(user)
      .then(() => {
        if (isMounted) {
          setState({ status: 'ready', error: null });
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setState({ status: 'error', error: toErrorMessage(error) });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [attempt, user]);

  const retry = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  return { ...state, retry };
};

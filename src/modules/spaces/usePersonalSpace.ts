import { useEffect, useState } from 'react';

import type { Space } from '../../types/database';
import { toErrorMessage } from '../../utils/errors';
import { ensurePersonalSpace } from './spacesService';

type PersonalSpaceState = {
  space: Space | null;
  isLoading: boolean;
  error: string | null;
};

export const usePersonalSpace = (userId: string | null): PersonalSpaceState => {
  const [state, setState] = useState<PersonalSpaceState>({
    space: null,
    isLoading: Boolean(userId),
    error: null,
  });

  useEffect(() => {
    if (!userId) {
      setState({ space: null, isLoading: false, error: null });
      return;
    }

    let isMounted = true;
    setState((current) => ({ ...current, isLoading: true, error: null }));

    ensurePersonalSpace(userId)
      .then((space) => {
        if (isMounted) {
          setState({ space, isLoading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setState({ space: null, isLoading: false, error: toErrorMessage(error) });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return state;
};

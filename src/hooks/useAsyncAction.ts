import { useCallback, useState } from 'react';

import { toErrorMessage } from '../utils/errors';

export const useAsyncAction = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async <T>(action: () => Promise<T>): Promise<T | null> => {
    setIsRunning(true);
    setError(null);

    try {
      return await action();
    } catch (actionError) {
      setError(toErrorMessage(actionError));
      return null;
    } finally {
      setIsRunning(false);
    }
  }, []);

  return { isRunning, error, run };
};

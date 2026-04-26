import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import type { AppRoute } from '../constants/navigation';

type UiStore = {
  activeRoute: AppRoute;
  setActiveRoute: (route: AppRoute) => void;
};

const UiStoreContext = createContext<UiStore | null>(null);

export const UiStoreProvider = ({ children }: { children: ReactNode }) => {
  const [activeRoute, setActiveRoute] = useState<AppRoute>('today');
  const value = useMemo(() => ({ activeRoute, setActiveRoute }), [activeRoute]);

  return <UiStoreContext.Provider value={value}>{children}</UiStoreContext.Provider>;
};

export const useUiStore = (): UiStore => {
  const context = useContext(UiStoreContext);

  if (!context) {
    throw new Error('useUiStore deve ser usado dentro de UiStoreProvider.');
  }

  return context;
};

import type { ReactNode } from 'react';

import { UiStoreProvider } from '../store/uiStore';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <UiStoreProvider>{children}</UiStoreProvider>
);

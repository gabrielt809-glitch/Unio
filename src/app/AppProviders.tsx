import type { ReactNode } from 'react';

import { UiStoreProvider } from '../store/uiStore';
import { QueryProvider } from './QueryProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <QueryProvider>
    <UiStoreProvider>{children}</UiStoreProvider>
  </QueryProvider>
);

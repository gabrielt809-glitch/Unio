import type { ReactNode } from 'react';

import { Screen } from '../../../components/Layout';

export const AuthShell = ({ children }: { children: ReactNode }) => (
  <Screen className="grid place-items-center overflow-x-hidden px-4 py-[calc(2rem+var(--safe-top))]">
    <div className="w-full min-w-0 max-w-[calc(100vw-2rem)] sm:max-w-md">{children}</div>
  </Screen>
);

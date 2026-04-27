import { AuthGate } from '../modules/auth/AuthGate';
import { AppProviders } from './AppProviders';
import { AppShell } from './AppShell';
import { VisualQaHarness } from './visualQa/VisualQaHarness';

export const App = () => (
  <AppProviders>
    {import.meta.env.DEV && window.location.search.includes('visual-qa') ? (
      <VisualQaHarness />
    ) : (
      <AuthGate>{(user) => <AppShell user={user} />}</AuthGate>
    )}
  </AppProviders>
);

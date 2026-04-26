import { AuthGate } from '../modules/auth/AuthGate';
import { AppProviders } from './AppProviders';
import { AppShell } from './AppShell';

export const App = () => (
  <AppProviders>
    <AuthGate>{(user) => <AppShell user={user} />}</AuthGate>
  </AppProviders>
);

import { WifiOff } from 'lucide-react';

import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Badge } from '../components/Badge';

type TopBarProps = {
  userEmail: string;
  spaceName: string;
};

export const TopBar = ({ spaceName, userEmail }: TopBarProps) => {
  const isOnline = useOnlineStatus();

  return (
    <header className="safe-area-x sticky top-0 z-30 border-b border-white/10 bg-background/88 pb-3 pt-[calc(0.85rem+var(--safe-top))] backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-accent">Unio</p>
          <h1 className="mt-1 truncate text-xl font-extrabold text-text-primary">{spaceName}</h1>
          <p className="truncate text-xs text-text-secondary">{userEmail}</p>
        </div>
        {!isOnline ? (
          <Badge tone="warning" className="min-h-10 gap-2">
            <WifiOff aria-hidden="true" className="h-4 w-4" />
            Offline
          </Badge>
        ) : null}
      </div>
    </header>
  );
};

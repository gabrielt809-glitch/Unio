import { navigationItems } from '../constants/navigation';
import { useUiStore } from '../store/uiStore';
import { cn } from '../utils/cn';

export const BottomNav = () => {
  const { activeRoute, setActiveRoute } = useUiStore();

  return (
    <nav
      aria-label="Navegacao principal"
      className="fixed inset-x-0 bottom-0 z-40 overflow-x-hidden border-t border-white/10 bg-background/92 px-2 pb-[calc(0.55rem+var(--safe-bottom))] pt-2 backdrop-blur-xl"
    >
      <div className="mx-auto grid w-full max-w-2xl min-w-0 grid-cols-6 gap-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.id;

          return (
            <button
              key={item.id}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'grid min-h-14 min-w-0 place-items-center rounded-app px-1 text-[0.68rem] font-semibold transition duration-200 ease-app active:scale-[0.98]',
                isActive
                  ? 'bg-elevated text-text-primary shadow-accent'
                  : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
              )}
              type="button"
              onClick={() => setActiveRoute(item.id)}
            >
              <Icon aria-hidden="true" className={cn('mb-1 h-5 w-5', isActive && 'text-accent')} />
              <span className="w-full truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

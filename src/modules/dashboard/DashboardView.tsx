import { Activity, CheckSquare, CreditCard, Droplets, Moon, Sparkles } from 'lucide-react';

import { Badge } from '../../components/Badge';
import { MetricTile } from '../../components/MetricTile';
import { ProgressBar } from '../../components/ProgressBar';
import { SectionHeader } from '../../components/SectionHeader';
import { StateView } from '../../components/StateView';
import { Surface } from '../../components/Surface';
import { useUiStore } from '../../store/uiStore';
import { formatTodayLabel } from '../../utils/date';
import { formatCurrencyFromCents, minutesToHours } from '../../utils/format';
import { useFinance } from '../finance/useFinance';
import { useHabits } from '../habits/useHabits';
import { useHealth } from '../health/useHealth';
import { useTasks } from '../tasks/useTasks';
import { isTaskCompleted } from '../tasks/utils/taskFilters';

type DashboardViewProps = {
  userId: string;
  spaceId: string;
};

export const DashboardView = ({ spaceId, userId }: DashboardViewProps) => {
  const { setActiveRoute } = useUiStore();
  const tasks = useTasks(userId, spaceId);
  const habits = useHabits(userId, spaceId);
  const finance = useFinance(userId, spaceId);
  const health = useHealth(userId, spaceId);
  const openTasks = tasks.tasks.filter((task) => !isTaskCompleted(task)).length;
  const habitProgress = habits.habits.length
    ? Math.round((habits.completedHabitIds.size / habits.habits.length) * 100)
    : 0;
  const metric = health.metric;
  const isLoading = tasks.isLoading || habits.isLoading || finance.isLoading || health.isLoading;
  const firstError = tasks.error ?? habits.error ?? finance.error ?? health.error;

  return (
    <div className="grid gap-4">
      <section className="rounded-panel border border-white/10 bg-elevated p-5 shadow-glow">
        <Badge tone="accent">{formatTodayLabel()}</Badge>
        <h2 className="mt-3 text-3xl font-extrabold text-text-primary">Tudo em um so lugar.</h2>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          Seu painel pessoal combina rotina, execucao, energia e dinheiro sem espalhar contexto.
        </p>
        <ProgressBar className="mt-5" label="Habitos de hoje" tone="success" value={habitProgress} />
      </section>

      {isLoading ? (
        <StateView tone="loading" title="Sincronizando seu dia" description="Carregando dados do Supabase." />
      ) : null}
      {firstError ? (
        <StateView tone="error" title="Algum modulo nao carregou" description={firstError} />
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <MetricTile
          icon={<CheckSquare aria-hidden="true" className="h-5 w-5" />}
          label="Tarefas"
          value={`${openTasks}`}
          detail="abertas"
        />
        <MetricTile
          icon={<Activity aria-hidden="true" className="h-5 w-5" />}
          label="Habitos"
          tone="success"
          value={`${habitProgress}%`}
          detail="hoje"
        />
        <MetricTile
          icon={<CreditCard aria-hidden="true" className="h-5 w-5" />}
          label="Saldo"
          tone={finance.summary.balanceCents >= 0 ? 'accent' : 'warning'}
          value={formatCurrencyFromCents(finance.summary.balanceCents)}
          detail="mes atual"
        />
        <MetricTile
          icon={<Droplets aria-hidden="true" className="h-5 w-5" />}
          label="Agua"
          tone="accent"
          value={`${metric?.water_ml ?? 0}ml`}
          detail="registrados"
        />
      </div>

      <SectionHeader title="Rotina" description="Atalhos para as areas mais usadas do Unio." />
      <div className="grid gap-3">
        <Surface variant="interactive" className="p-3">
          <button
            className="flex min-h-16 w-full items-center gap-3 text-left"
            type="button"
            onClick={() => setActiveRoute('tasks')}
          >
            <span className="grid h-11 w-11 place-items-center rounded-app bg-primary/10 text-primary">
              <CheckSquare aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-text-primary">
                Organizar proximas acoes
              </span>
              <span className="mt-1 block text-xs text-text-secondary">{openTasks} tarefas abertas</span>
            </span>
          </button>
        </Surface>
        <Surface variant="interactive" className="p-3">
          <button
            className="flex min-h-16 w-full items-center gap-3 text-left"
            type="button"
            onClick={() => setActiveRoute('health')}
          >
            <span className="grid h-11 w-11 place-items-center rounded-app bg-accent/10 text-accent">
              <Moon aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-text-primary">
                Registrar energia e sono
              </span>
              <span className="mt-1 block text-xs text-text-secondary">
                {minutesToHours(metric?.sleep_minutes ?? 0)} de sono hoje
              </span>
            </span>
          </button>
        </Surface>
        <Surface variant="interactive" className="p-3">
          <button
            className="flex min-h-16 w-full items-center gap-3 text-left"
            type="button"
            onClick={() => setActiveRoute('habits')}
          >
            <span className="grid h-11 w-11 place-items-center rounded-app bg-success/10 text-success">
              <Sparkles aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-text-primary">Manter consistencia</span>
              <span className="mt-1 block text-xs text-text-secondary">
                {habits.completedHabitIds.size}/{habits.habits.length} habitos concluidos
              </span>
            </span>
          </button>
        </Surface>
      </div>
    </div>
  );
};

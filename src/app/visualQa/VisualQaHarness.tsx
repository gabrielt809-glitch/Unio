import { useEffect, useState } from 'react';
import {
  Activity,
  CheckSquare,
  CreditCard,
  Droplets,
  HeartPulse,
  Moon,
  Plus,
  Settings,
  Sparkles,
} from 'lucide-react';

import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { FieldShell, SelectInput, TextArea, TextInput } from '../../components/Field';
import { PageContainer, Screen } from '../../components/Layout';
import { MetricTile } from '../../components/MetricTile';
import { ProgressBar } from '../../components/ProgressBar';
import { SectionHeader } from '../../components/SectionHeader';
import { StateView } from '../../components/StateView';
import { Surface } from '../../components/Surface';
import type { AppRoute } from '../../constants/navigation';
import { TaskFilterTabs } from '../../modules/tasks/components/TaskFilterTabs';
import { TaskForm } from '../../modules/tasks/components/TaskForm';
import { TaskList } from '../../modules/tasks/components/TaskList';
import type { Task } from '../../types/database';
import { useUiStore } from '../../store/uiStore';
import { BottomNav } from '../BottomNav';
import { TopBar } from '../TopBar';

type VisualQaScreen = AppRoute | 'more' | 'dialog';

const screenRouteMap: Record<VisualQaScreen, AppRoute> = {
  today: 'today',
  tasks: 'tasks',
  habits: 'habits',
  finance: 'finance',
  health: 'health',
  settings: 'settings',
  more: 'settings',
  dialog: 'tasks',
};

const visualQaScreens: VisualQaScreen[] = [
  'today',
  'tasks',
  'habits',
  'finance',
  'health',
  'settings',
  'more',
  'dialog',
];

const mockTaskBase = {
  user_id: 'visual-user',
  space_id: 'visual-space',
  created_at: '2026-04-27T10:00:00.000Z',
  updated_at: '2026-04-27T10:00:00.000Z',
  notes: null,
} satisfies Pick<Task, 'created_at' | 'notes' | 'space_id' | 'updated_at' | 'user_id'>;

const visualTasks: Task[] = [
  {
    ...mockTaskBase,
    id: 'visual-task-1',
    title: 'Revisar planejamento semanal com titulo longo controlado',
    description: 'Descricao com varias palavras para validar quebra sem extrapolar o card.',
    due_date: '2026-04-27',
    priority: 'high',
    category: 'Trabalho',
    status: 'open',
    completed_at: null,
  },
  {
    ...mockTaskBase,
    id: 'visual-task-2',
    title: 'Organizar ideias sem prazo',
    description: null,
    due_date: null,
    priority: 'medium',
    category: 'Pessoal',
    status: 'completed',
    completed_at: '2026-04-27T11:00:00.000Z',
  },
];

const getVisualQaScreen = (): VisualQaScreen => {
  const requested = new URLSearchParams(window.location.search).get('visual-qa');
  return visualQaScreens.find((screen) => screen === requested) ?? 'today';
};

const DashboardQa = () => (
  <div className="grid min-w-0 gap-4" data-visual-container>
    <section className="min-w-0 rounded-panel border border-white/10 bg-elevated p-5 shadow-glow">
      <Badge tone="accent">Hoje</Badge>
      <h2 className="mt-3 break-words text-3xl font-extrabold text-text-primary">Tudo em um so lugar.</h2>
      <p className="mt-3 break-words text-sm leading-6 text-text-secondary">
        Painel visual de QA para validar containers, metricas, cards, estados e atalhos.
      </p>
      <ProgressBar className="mt-5" label="Habitos de hoje" tone="success" value={72} />
    </section>
    <div className="grid min-w-0 grid-cols-2 gap-3">
      <MetricTile icon={<CheckSquare className="h-5 w-5" />} label="Tarefas" value="8" detail="abertas" />
      <MetricTile icon={<Activity className="h-5 w-5" />} label="Habitos" tone="success" value="72%" />
      <MetricTile icon={<CreditCard className="h-5 w-5" />} label="Saldo" tone="accent" value="R$ 2.480" />
      <MetricTile icon={<Droplets className="h-5 w-5" />} label="Agua" tone="accent" value="1800ml" />
    </div>
    <StateView title="Estado vazio premium" description="Mensagem longa suficiente para validar quebra." />
  </div>
);

const TasksQa = () => {
  const [filter, setFilter] = useState<'today' | 'upcoming' | 'undated' | 'completed' | 'all'>('today');

  return (
    <div className="grid min-w-0 gap-4" data-visual-container>
      <SectionHeader title="Tarefas" description="Validacao visual do formulario, filtros e cards." />
      <Surface>
        <TaskForm isBusy={false} onSubmit={() => Promise.resolve()} />
      </Surface>
      <TaskFilterTabs
        activeFilter={filter}
        counts={{ all: 12, completed: 2, today: 3, undated: 4, upcoming: 5 }}
        onFilterChange={setFilter}
      />
      <TaskList
        isBusy={false}
        tasks={visualTasks}
        onDelete={() => undefined}
        onEdit={() => undefined}
        onToggle={() => undefined}
      />
    </div>
  );
};

const HabitsQa = () => (
  <div className="grid min-w-0 gap-4" data-visual-container>
    <SectionHeader title="Habitos" description="Progresso e formulario responsivo." />
    <ProgressBar label="Progresso diario" tone="success" value={60} />
    <Surface>
      <form className="grid min-w-0 gap-3">
        <FieldShell label="Novo habito">
          <TextInput placeholder="Ex.: caminhar 20 minutos" />
        </FieldShell>
        <FieldShell label="Ritmo">
          <SelectInput defaultValue="daily">
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
          </SelectInput>
        </FieldShell>
        <Button icon={<Plus className="h-4 w-4" />}>Adicionar habito</Button>
      </form>
    </Surface>
  </div>
);

const FinanceQa = () => (
  <div className="grid min-w-0 gap-4" data-visual-container>
    <SectionHeader title="Financas" description="Valores, cards e inputs financeiros." />
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
      <MetricTile label="Entradas" tone="success" value="R$ 8.500" />
      <MetricTile label="Saidas" tone="danger" value="R$ 3.210" />
      <MetricTile label="Saldo" tone="accent" value="R$ 5.290" />
    </div>
    <Surface>
      <form className="grid min-w-0 gap-3">
        <FieldShell label="Descricao">
          <TextInput placeholder="Ex.: assinatura" />
        </FieldShell>
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
          <FieldShell label="Valor">
            <TextInput inputMode="decimal" placeholder="0,00" />
          </FieldShell>
          <FieldShell label="Data">
            <TextInput type="date" defaultValue="2026-04-27" />
          </FieldShell>
        </div>
      </form>
    </Surface>
  </div>
);

const HealthQa = () => (
  <div className="grid min-w-0 gap-4" data-visual-container>
    <SectionHeader title="Saude" description="Agua, sono, nutricao e bem-estar no mesmo container." />
    <div className="grid min-w-0 grid-cols-2 gap-3">
      <MetricTile icon={<Droplets className="h-5 w-5" />} label="Agua" tone="accent" value="1800ml" />
      <MetricTile icon={<Moon className="h-5 w-5" />} label="Sono" tone="primary" value="7h 20m" />
      <MetricTile icon={<HeartPulse className="h-5 w-5" />} label="Humor" tone="success" value="4/5" />
      <MetricTile icon={<Sparkles className="h-5 w-5" />} label="Proteina" tone="warning" value="96g" />
    </div>
    <Surface>
      <form className="grid min-w-0 gap-3">
        <FieldShell label="Observacao de bem-estar">
          <TextArea placeholder="Sono, foco, refeicoes e energia do dia." />
        </FieldShell>
        <div className="grid min-w-0 grid-cols-2 gap-3">
          <FieldShell label="Agua (ml)">
            <TextInput type="number" defaultValue="1800" />
          </FieldShell>
          <FieldShell label="Sono (min)">
            <TextInput type="number" defaultValue="440" />
          </FieldShell>
        </div>
      </form>
    </Surface>
  </div>
);

const SettingsQa = () => (
  <div className="grid min-w-0 gap-4" data-visual-container>
    <SectionHeader title="Ajustes" description="Perfil, PWA, preferencias e sessao." />
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
      <MetricTile icon={<Settings className="h-5 w-5" />} label="Supabase" tone="success" value="Conectado" />
      <MetricTile label="PWA" tone="warning" value="Aguardando" />
    </div>
    <Surface>
      <p className="break-all text-sm font-semibold text-text-primary">visual-qa-user@example.com</p>
      <p className="mt-2 break-all text-xs text-text-secondary">visual-space-id-000000000000000000000</p>
    </Surface>
  </div>
);

const MoreQa = () => (
  <div className="grid min-w-0 gap-4" data-visual-container>
    <SectionHeader title="Mais" description="Modulos secundarios agrupados para auditoria visual." />
    {['Agua', 'Sono', 'Nutricao', 'Bem-estar', 'Configuracoes'].map((label) => (
      <Surface key={label} variant="interactive" className="p-3">
        <div className="flex min-h-14 min-w-0 items-center justify-between gap-3">
          <span className="min-w-0 truncate text-sm font-bold text-text-primary">{label}</span>
          <Badge tone="accent">Preparado</Badge>
        </div>
      </Surface>
    ))}
  </div>
);

const renderScreen = (screen: VisualQaScreen) => {
  if (screen === 'tasks') return <TasksQa />;
  if (screen === 'habits') return <HabitsQa />;
  if (screen === 'finance') return <FinanceQa />;
  if (screen === 'health') return <HealthQa />;
  if (screen === 'settings') return <SettingsQa />;
  if (screen === 'more') return <MoreQa />;
  if (screen === 'dialog') {
    return (
      <>
        <TasksQa />
        <ConfirmDialog
          confirmLabel="Excluir"
          description="Mensagem de confirmacao longa para garantir que o dialog nao extrapola no iPhone."
          open
          title="Excluir registro?"
          onCancel={() => undefined}
          onConfirm={() => undefined}
        />
      </>
    );
  }
  return <DashboardQa />;
};

export const VisualQaHarness = () => {
  const screen = getVisualQaScreen();
  const { setActiveRoute } = useUiStore();

  useEffect(() => {
    setActiveRoute(screenRouteMap[screen]);
  }, [screen, setActiveRoute]);

  return (
    <Screen data-testid="visual-qa-screen">
      <TopBar spaceName="Espaco pessoal" userEmail="visual-qa@unio.local" />
      <PageContainer>{renderScreen(screen)}</PageContainer>
      <BottomNav />
    </Screen>
  );
};

import { Activity, CheckSquare, CircleGauge, CreditCard, HeartPulse, Settings } from 'lucide-react';

export type AppRoute = 'today' | 'tasks' | 'habits' | 'finance' | 'health' | 'settings';

export const navigationItems = [
  { id: 'today', label: 'Hoje', icon: CircleGauge },
  { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
  { id: 'habits', label: 'Habitos', icon: Activity },
  { id: 'finance', label: 'Financas', icon: CreditCard },
  { id: 'health', label: 'Saude', icon: HeartPulse },
  { id: 'settings', label: 'Ajustes', icon: Settings },
] as const satisfies ReadonlyArray<{
  id: AppRoute;
  label: string;
  icon: typeof CircleGauge;
}>;

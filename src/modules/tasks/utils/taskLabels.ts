import type { TaskFilterOption, TaskPriority, TaskStatus } from '../types/taskTypes';

export const taskPriorityLabels: Record<TaskPriority, string> = {
  low: 'Baixa',
  medium: 'Media',
  high: 'Alta',
};

export const taskStatusLabels: Record<TaskStatus, string> = {
  open: 'Aberta',
  completed: 'Concluida',
};

export const taskFilterOptions: TaskFilterOption[] = [
  { id: 'today', label: 'Hoje', description: 'Com data de hoje e abertas.' },
  { id: 'upcoming', label: 'Proximas', description: 'Futuras e abertas.' },
  { id: 'undated', label: 'Sem data', description: 'Abertas sem prazo.' },
  { id: 'completed', label: 'Concluidas', description: 'Ja finalizadas.' },
  { id: 'all', label: 'Todas', description: 'Tudo no espaco atual.' },
];

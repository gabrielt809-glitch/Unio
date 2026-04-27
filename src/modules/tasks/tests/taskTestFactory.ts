import type { Task } from '../../../types/database';

export const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: overrides.id ?? 'task-id',
  user_id: overrides.user_id ?? 'user-id',
  space_id: overrides.space_id ?? 'space-id',
  title: overrides.title ?? 'Tarefa teste',
  notes: overrides.notes ?? null,
  description: overrides.description ?? null,
  due_date: overrides.due_date ?? null,
  priority: overrides.priority ?? 'medium',
  category: overrides.category ?? null,
  status: overrides.status ?? 'open',
  completed_at: overrides.completed_at ?? null,
  created_at: overrides.created_at ?? '2026-04-27T10:00:00.000Z',
  updated_at: overrides.updated_at ?? '2026-04-27T10:00:00.000Z',
});

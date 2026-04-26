import type { Task } from '../../types/database';

export type TaskPriority = Task['priority'];

export type TaskDraft = {
  title: string;
  notes: string;
  due_date: string;
  priority: TaskPriority;
};

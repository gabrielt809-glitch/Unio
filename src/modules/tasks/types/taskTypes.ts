import type { Task } from '../../../types/database';

export type TaskPriority = Task['priority'];
export type TaskStatus = Task['status'];
export type TaskFilter = 'today' | 'upcoming' | 'undated' | 'completed' | 'all';

export type TaskFormValues = {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  category: string;
};

export type TaskMutationContext = {
  userId: string;
  spaceId: string;
};

export type UpdateTaskInput = TaskMutationContext & {
  taskId: string;
  values: TaskFormValues;
};

export type ToggleTaskInput = {
  task: Task;
  isComplete: boolean;
};

export type DeleteTaskInput = {
  task: Task;
};

export type TaskFilterOption = {
  id: TaskFilter;
  label: string;
  description: string;
};

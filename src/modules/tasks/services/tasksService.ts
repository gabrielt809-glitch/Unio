import { requireSupabase } from '../../../services/supabase/client';
import type { Task } from '../../../types/database';
import { nowIso } from '../../../utils/date';
import type {
  DeleteTaskInput,
  TaskFormValues,
  TaskMutationContext,
  ToggleTaskInput,
  UpdateTaskInput,
} from '../types/taskTypes';
import { sortTasks } from '../utils/taskFilters';

type RawTask = Omit<Task, 'category' | 'description' | 'status'> &
  Partial<Pick<Task, 'category' | 'description' | 'status'>>;

const normalizeTask = (task: RawTask): Task => ({
  ...task,
  category: task.category ?? null,
  description: task.description ?? task.notes ?? null,
  status: task.status ?? (task.completed_at ? 'completed' : 'open'),
});

const toTaskPayload = (values: TaskFormValues) => {
  const description = values.description.trim() || null;

  return {
    title: values.title.trim(),
    notes: description,
    description,
    due_date: values.dueDate || null,
    priority: values.priority,
    category: values.category.trim() || null,
  };
};

export const listTasks = async ({ spaceId, userId }: TaskMutationContext): Promise<Task[]> => {
  const { data, error } = await requireSupabase()
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('space_id', spaceId)
    .order('status', { ascending: true })
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return sortTasks((data ?? []).map((task) => normalizeTask(task)));
};

export const createTask = async (context: TaskMutationContext, values: TaskFormValues): Promise<Task> => {
  const { data, error } = await requireSupabase()
    .from('tasks')
    .insert({
      ...toTaskPayload(values),
      user_id: context.userId,
      space_id: context.spaceId,
      status: 'open',
      completed_at: null,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return normalizeTask(data);
};

export const updateTask = async ({ spaceId, taskId, userId, values }: UpdateTaskInput): Promise<Task> => {
  const { data, error } = await requireSupabase()
    .from('tasks')
    .update(toTaskPayload(values))
    .eq('id', taskId)
    .eq('user_id', userId)
    .eq('space_id', spaceId)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return normalizeTask(data);
};

export const setTaskCompletion = async ({ isComplete, task }: ToggleTaskInput): Promise<Task> => {
  const completedAt = isComplete ? nowIso() : null;
  const { data, error } = await requireSupabase()
    .from('tasks')
    .update({
      completed_at: completedAt,
      status: isComplete ? 'completed' : 'open',
    })
    .eq('id', task.id)
    .eq('user_id', task.user_id)
    .eq('space_id', task.space_id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return normalizeTask(data);
};

export const deleteTask = async ({ task }: DeleteTaskInput): Promise<void> => {
  const { error } = await requireSupabase()
    .from('tasks')
    .delete()
    .eq('id', task.id)
    .eq('user_id', task.user_id)
    .eq('space_id', task.space_id);

  if (error) {
    throw error;
  }
};

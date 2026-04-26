import { requireSupabase } from '../../services/supabase/client';
import type { Task } from '../../types/database';
import { nowIso } from '../../utils/date';
import type { TaskDraft } from './tasksTypes';

export const listTasks = async (userId: string, spaceId: string): Promise<Task[]> => {
  const { data, error } = await requireSupabase()
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('space_id', spaceId)
    .order('completed_at', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const createTask = async (userId: string, spaceId: string, draft: TaskDraft): Promise<Task> => {
  const { data, error } = await requireSupabase()
    .from('tasks')
    .insert({
      user_id: userId,
      space_id: spaceId,
      title: draft.title.trim(),
      notes: draft.notes.trim() || null,
      due_date: draft.due_date || null,
      priority: draft.priority,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const setTaskCompletion = async (task: Task, isComplete: boolean): Promise<Task> => {
  const { data, error } = await requireSupabase()
    .from('tasks')
    .update({ completed_at: isComplete ? nowIso() : null })
    .eq('id', task.id)
    .eq('user_id', task.user_id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteTask = async (task: Task): Promise<void> => {
  const { error } = await requireSupabase()
    .from('tasks')
    .delete()
    .eq('id', task.id)
    .eq('user_id', task.user_id);

  if (error) {
    throw error;
  }
};

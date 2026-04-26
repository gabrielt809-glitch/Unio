import { requireSupabase } from '../../services/supabase/client';
import type { Habit, HabitLog } from '../../types/database';
import type { HabitDraft } from './habitsTypes';

export const listHabits = async (userId: string, spaceId: string): Promise<Habit[]> => {
  const { data, error } = await requireSupabase()
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('space_id', spaceId)
    .is('archived_at', null)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const listHabitLogs = async (
  userId: string,
  spaceId: string,
  loggedOn: string,
): Promise<HabitLog[]> => {
  const { data, error } = await requireSupabase()
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('space_id', spaceId)
    .eq('logged_on', loggedOn);

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const createHabit = async (userId: string, spaceId: string, draft: HabitDraft): Promise<Habit> => {
  const { data, error } = await requireSupabase()
    .from('habits')
    .insert({
      user_id: userId,
      space_id: spaceId,
      title: draft.title.trim(),
      cadence: draft.cadence,
      color: draft.color,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const setHabitLog = async (
  habit: Habit,
  loggedOn: string,
  isLogged: boolean,
): Promise<HabitLog | null> => {
  const client = requireSupabase();

  if (!isLogged) {
    const { error } = await client
      .from('habit_logs')
      .delete()
      .eq('habit_id', habit.id)
      .eq('user_id', habit.user_id)
      .eq('logged_on', loggedOn);

    if (error) {
      throw error;
    }

    return null;
  }

  const { data, error } = await client
    .from('habit_logs')
    .upsert(
      {
        habit_id: habit.id,
        user_id: habit.user_id,
        space_id: habit.space_id,
        logged_on: loggedOn,
        value: 1,
      },
      { onConflict: 'habit_id,logged_on' },
    )
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

import { requireSupabase } from '../../services/supabase/client';
import type { DailyMetric, MealLog } from '../../types/database';
import { toDateKey } from '../../utils/date';
import type { DailyMetricDraft, MealDraft } from './healthTypes';

export const emptyDailyMetric = (userId: string, spaceId: string, metricOn = toDateKey()): DailyMetric => ({
  id: '',
  user_id: userId,
  space_id: spaceId,
  metric_on: metricOn,
  water_ml: 0,
  sleep_minutes: 0,
  mood_score: 3,
  energy_score: 3,
  focus_minutes: 0,
  calories: 0,
  protein_grams: 0,
  created_at: '',
  updated_at: '',
});

export const getDailyMetric = async (
  userId: string,
  spaceId: string,
  metricOn: string,
): Promise<DailyMetric> => {
  const { data, error } = await requireSupabase()
    .from('daily_metrics')
    .select('*')
    .eq('user_id', userId)
    .eq('space_id', spaceId)
    .eq('metric_on', metricOn)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ?? emptyDailyMetric(userId, spaceId, metricOn);
};

export const upsertDailyMetric = async (
  userId: string,
  spaceId: string,
  metricOn: string,
  draft: DailyMetricDraft,
): Promise<DailyMetric> => {
  const { data, error } = await requireSupabase()
    .from('daily_metrics')
    .upsert(
      {
        user_id: userId,
        space_id: spaceId,
        metric_on: metricOn,
        ...draft,
      },
      { onConflict: 'user_id,space_id,metric_on' },
    )
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const listMeals = async (userId: string, spaceId: string, loggedOn: string): Promise<MealLog[]> => {
  const { data, error } = await requireSupabase()
    .from('meal_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('space_id', spaceId)
    .eq('logged_on', loggedOn)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const createMeal = async (userId: string, spaceId: string, draft: MealDraft): Promise<MealLog> => {
  const { data, error } = await requireSupabase()
    .from('meal_logs')
    .insert({
      user_id: userId,
      space_id: spaceId,
      title: draft.title.trim(),
      meal_type: draft.meal_type,
      calories: draft.calories,
      protein_grams: draft.protein_grams,
      logged_on: draft.logged_on,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

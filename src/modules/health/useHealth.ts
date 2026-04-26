import { useCallback, useEffect, useMemo, useState } from 'react';

import type { DailyMetric, MealLog } from '../../types/database';
import { toDateKey } from '../../utils/date';
import { toErrorMessage } from '../../utils/errors';
import { createMeal, getDailyMetric, listMeals, upsertDailyMetric } from './healthService';
import type { DailyMetricDraft, MealDraft } from './healthTypes';

type HealthState = {
  metric: DailyMetric | null;
  meals: MealLog[];
  isLoading: boolean;
  error: string | null;
};

export const useHealth = (userId: string, spaceId: string) => {
  const todayKey = useMemo(() => toDateKey(), []);
  const [state, setState] = useState<HealthState>({ metric: null, meals: [], isLoading: true, error: null });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }));
    try {
      const [metric, meals] = await Promise.all([
        getDailyMetric(userId, spaceId, todayKey),
        listMeals(userId, spaceId, todayKey),
      ]);
      setState({ metric, meals, isLoading: false, error: null });
    } catch (error) {
      setState({ metric: null, meals: [], isLoading: false, error: toErrorMessage(error) });
    }
  }, [spaceId, todayKey, userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveMetric = useCallback(
    async (draft: DailyMetricDraft) => {
      const metric = await upsertDailyMetric(userId, spaceId, todayKey, draft);
      setState((current) => ({ ...current, metric }));
    },
    [spaceId, todayKey, userId],
  );

  const addMeal = useCallback(
    async (draft: MealDraft) => {
      const meal = await createMeal(userId, spaceId, draft);
      setState((current) => ({ ...current, meals: [meal, ...current.meals] }));
    },
    [spaceId, userId],
  );

  return { ...state, addMeal, refresh, saveMetric, todayKey };
};

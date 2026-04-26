import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Habit, HabitLog } from '../../types/database';
import { toDateKey } from '../../utils/date';
import { toErrorMessage } from '../../utils/errors';
import { createHabit, listHabitLogs, listHabits, setHabitLog } from './habitsService';
import type { HabitDraft } from './habitsTypes';

type HabitsState = {
  habits: Habit[];
  logs: HabitLog[];
  isLoading: boolean;
  error: string | null;
};

export const useHabits = (userId: string, spaceId: string) => {
  const todayKey = useMemo(() => toDateKey(), []);
  const [state, setState] = useState<HabitsState>({ habits: [], logs: [], isLoading: true, error: null });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }));
    try {
      const [habits, logs] = await Promise.all([
        listHabits(userId, spaceId),
        listHabitLogs(userId, spaceId, todayKey),
      ]);
      setState({ habits, logs, isLoading: false, error: null });
    } catch (error) {
      setState({ habits: [], logs: [], isLoading: false, error: toErrorMessage(error) });
    }
  }, [spaceId, todayKey, userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const completedHabitIds = useMemo(() => new Set(state.logs.map((log) => log.habit_id)), [state.logs]);

  const addHabit = useCallback(
    async (draft: HabitDraft) => {
      const created = await createHabit(userId, spaceId, draft);
      setState((current) => ({ ...current, habits: [...current.habits, created] }));
    },
    [spaceId, userId],
  );

  const toggleHabit = useCallback(
    async (habit: Habit) => {
      const nextValue = !completedHabitIds.has(habit.id);
      const updatedLog = await setHabitLog(habit, todayKey, nextValue);
      setState((current) => ({
        ...current,
        logs: updatedLog
          ? [...current.logs.filter((log) => log.habit_id !== habit.id), updatedLog]
          : current.logs.filter((log) => log.habit_id !== habit.id),
      }));
    },
    [completedHabitIds, todayKey],
  );

  return { ...state, addHabit, completedHabitIds, refresh, todayKey, toggleHabit };
};

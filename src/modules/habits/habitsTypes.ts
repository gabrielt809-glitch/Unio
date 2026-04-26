import type { Habit } from '../../types/database';

export type HabitDraft = {
  title: string;
  cadence: Habit['cadence'];
  color: string;
};

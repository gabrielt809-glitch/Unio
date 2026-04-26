import type { MealLog } from '../../types/database';

export type DailyMetricDraft = {
  water_ml: number;
  sleep_minutes: number;
  mood_score: number;
  energy_score: number;
  focus_minutes: number;
  calories: number;
  protein_grams: number;
};

export type MealDraft = {
  title: string;
  meal_type: MealLog['meal_type'];
  calories: number;
  protein_grams: number;
  logged_on: string;
};

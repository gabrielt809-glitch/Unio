import type { EntityBase } from './shared';

export type Space = Omit<EntityBase, 'space_id'> & {
  name: string;
  kind: 'personal' | 'shared';
};

export type Profile = Omit<EntityBase, 'space_id'> & {
  display_name: string | null;
  avatar_url: string | null;
};

export type UserPreferences = EntityBase & {
  default_route: 'today' | 'tasks' | 'habits' | 'finance' | 'health' | 'settings';
  theme: 'dark';
  reduce_motion: boolean;
};

export type Task = EntityBase & {
  title: string;
  notes: string | null;
  description: string | null;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  category: string | null;
  status: 'open' | 'completed';
  completed_at: string | null;
};

export type Habit = EntityBase & {
  title: string;
  cadence: 'daily' | 'weekly';
  color: string;
  archived_at: string | null;
};

export type HabitLog = EntityBase & {
  habit_id: string;
  logged_on: string;
  value: number;
};

export type DailyMetric = EntityBase & {
  metric_on: string;
  water_ml: number;
  sleep_minutes: number;
  mood_score: number;
  energy_score: number;
  focus_minutes: number;
  calories: number;
  protein_grams: number;
};

export type FinanceTransaction = EntityBase & {
  title: string;
  amount_cents: number;
  transaction_type: 'income' | 'expense';
  category: string;
  occurred_on: string;
};

export type MealLog = EntityBase & {
  title: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein_grams: number;
  logged_on: string;
};

type TableDefinition<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type SpaceInsert = {
  id?: string;
  user_id: string;
  name: string;
  kind?: Space['kind'];
  created_at?: string;
  updated_at?: string;
};

type ProfileInsert = {
  id?: string;
  user_id: string;
  display_name?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
};

type UserPreferencesInsert = {
  id?: string;
  user_id: string;
  space_id: string;
  default_route?: UserPreferences['default_route'];
  theme?: UserPreferences['theme'];
  reduce_motion?: boolean;
  created_at?: string;
  updated_at?: string;
};

type TaskInsert = {
  id?: string;
  user_id: string;
  space_id: string;
  title: string;
  notes?: string | null;
  description?: string | null;
  due_date?: string | null;
  priority?: Task['priority'];
  category?: string | null;
  status?: Task['status'];
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type HabitInsert = {
  id?: string;
  user_id: string;
  space_id: string;
  title: string;
  cadence?: Habit['cadence'];
  color?: string;
  archived_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type HabitLogInsert = {
  id?: string;
  user_id: string;
  space_id: string;
  habit_id: string;
  logged_on: string;
  value?: number;
  created_at?: string;
  updated_at?: string;
};

type DailyMetricInsert = {
  id?: string;
  user_id: string;
  space_id: string;
  metric_on: string;
  water_ml?: number;
  sleep_minutes?: number;
  mood_score?: number;
  energy_score?: number;
  focus_minutes?: number;
  calories?: number;
  protein_grams?: number;
  created_at?: string;
  updated_at?: string;
};

type FinanceTransactionInsert = {
  id?: string;
  user_id: string;
  space_id: string;
  title: string;
  amount_cents: number;
  transaction_type: FinanceTransaction['transaction_type'];
  category: string;
  occurred_on: string;
  created_at?: string;
  updated_at?: string;
};

type MealLogInsert = {
  id?: string;
  user_id: string;
  space_id: string;
  title: string;
  meal_type: MealLog['meal_type'];
  calories?: number;
  protein_grams?: number;
  logged_on: string;
  created_at?: string;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      spaces: TableDefinition<Space, SpaceInsert>;
      profiles: TableDefinition<Profile, ProfileInsert>;
      user_preferences: TableDefinition<UserPreferences, UserPreferencesInsert>;
      tasks: TableDefinition<Task, TaskInsert>;
      habits: TableDefinition<Habit, HabitInsert>;
      habit_logs: TableDefinition<HabitLog, HabitLogInsert>;
      daily_metrics: TableDefinition<DailyMetric, DailyMetricInsert>;
      finance_transactions: TableDefinition<FinanceTransaction, FinanceTransactionInsert>;
      meal_logs: TableDefinition<MealLog, MealLogInsert>;
    };
    Views: Record<string, never>;
    Functions: {
      ensure_user_foundation: {
        Args: {
          target_user_id: string;
          target_email?: string | null;
        };
        Returns: string | null;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

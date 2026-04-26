create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.spaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  kind text not null default 'personal' check (kind in ('personal', 'shared')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index spaces_one_personal_per_user on public.spaces (user_id) where kind = 'personal';
create index spaces_user_id_idx on public.spaces (user_id);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  space_id uuid not null references public.spaces(id) on delete cascade,
  title text not null check (char_length(title) <= 120),
  notes text,
  due_date date,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_user_space_idx on public.tasks (user_id, space_id);

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  space_id uuid not null references public.spaces(id) on delete cascade,
  title text not null check (char_length(title) <= 80),
  cadence text not null default 'daily' check (cadence in ('daily', 'weekly')),
  color text not null default '#7C5CFF',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index habits_user_space_idx on public.habits (user_id, space_id);

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  space_id uuid not null references public.spaces(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  logged_on date not null,
  value integer not null default 1 check (value >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (habit_id, logged_on)
);

create index habit_logs_user_space_day_idx on public.habit_logs (user_id, space_id, logged_on);

create table public.daily_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  space_id uuid not null references public.spaces(id) on delete cascade,
  metric_on date not null,
  water_ml integer not null default 0 check (water_ml >= 0),
  sleep_minutes integer not null default 0 check (sleep_minutes >= 0),
  mood_score integer not null default 3 check (mood_score between 1 and 5),
  energy_score integer not null default 3 check (energy_score between 1 and 5),
  focus_minutes integer not null default 0 check (focus_minutes >= 0),
  calories integer not null default 0 check (calories >= 0),
  protein_grams integer not null default 0 check (protein_grams >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, space_id, metric_on)
);

create table public.finance_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  space_id uuid not null references public.spaces(id) on delete cascade,
  title text not null check (char_length(title) <= 100),
  amount_cents integer not null check (amount_cents >= 0),
  transaction_type text not null check (transaction_type in ('income', 'expense')),
  category text not null,
  occurred_on date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index finance_user_space_month_idx on public.finance_transactions (user_id, space_id, occurred_on);

create table public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  space_id uuid not null references public.spaces(id) on delete cascade,
  title text not null check (char_length(title) <= 80),
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  calories integer not null default 0 check (calories >= 0),
  protein_grams integer not null default 0 check (protein_grams >= 0),
  logged_on date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index meal_logs_user_space_day_idx on public.meal_logs (user_id, space_id, logged_on);

create trigger spaces_set_updated_at before update on public.spaces for each row execute function public.set_updated_at();
create trigger tasks_set_updated_at before update on public.tasks for each row execute function public.set_updated_at();
create trigger habits_set_updated_at before update on public.habits for each row execute function public.set_updated_at();
create trigger habit_logs_set_updated_at before update on public.habit_logs for each row execute function public.set_updated_at();
create trigger daily_metrics_set_updated_at before update on public.daily_metrics for each row execute function public.set_updated_at();
create trigger finance_transactions_set_updated_at before update on public.finance_transactions for each row execute function public.set_updated_at();
create trigger meal_logs_set_updated_at before update on public.meal_logs for each row execute function public.set_updated_at();

alter table public.spaces enable row level security;
alter table public.tasks enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.daily_metrics enable row level security;
alter table public.finance_transactions enable row level security;
alter table public.meal_logs enable row level security;

create policy spaces_select_own on public.spaces for select using (user_id = auth.uid());
create policy spaces_insert_own on public.spaces for insert with check (user_id = auth.uid());
create policy spaces_update_own on public.spaces for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy spaces_delete_own on public.spaces for delete using (user_id = auth.uid());

create policy tasks_select_own on public.tasks for select using (user_id = auth.uid());
create policy tasks_insert_own on public.tasks for insert with check (
  user_id = auth.uid() and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
);
create policy tasks_update_own on public.tasks for update using (user_id = auth.uid()) with check (
  user_id = auth.uid() and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
);
create policy tasks_delete_own on public.tasks for delete using (user_id = auth.uid());

create policy habits_select_own on public.habits for select using (user_id = auth.uid());
create policy habits_insert_own on public.habits for insert with check (
  user_id = auth.uid() and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
);
create policy habits_update_own on public.habits for update using (user_id = auth.uid()) with check (
  user_id = auth.uid() and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
);
create policy habits_delete_own on public.habits for delete using (user_id = auth.uid());

create policy habit_logs_select_own on public.habit_logs for select using (user_id = auth.uid());
create policy habit_logs_insert_own on public.habit_logs for insert with check (
  user_id = auth.uid()
  and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
  and exists (select 1 from public.habits where habits.id = habit_id and habits.user_id = auth.uid())
);
create policy habit_logs_update_own on public.habit_logs for update using (user_id = auth.uid()) with check (
  user_id = auth.uid()
  and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
  and exists (select 1 from public.habits where habits.id = habit_id and habits.user_id = auth.uid())
);
create policy habit_logs_delete_own on public.habit_logs for delete using (user_id = auth.uid());

create policy daily_metrics_select_own on public.daily_metrics for select using (user_id = auth.uid());
create policy daily_metrics_insert_own on public.daily_metrics for insert with check (
  user_id = auth.uid() and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
);
create policy daily_metrics_update_own on public.daily_metrics for update using (user_id = auth.uid()) with check (
  user_id = auth.uid() and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
);
create policy daily_metrics_delete_own on public.daily_metrics for delete using (user_id = auth.uid());

create policy finance_transactions_select_own on public.finance_transactions for select using (user_id = auth.uid());
create policy finance_transactions_insert_own on public.finance_transactions for insert with check (
  user_id = auth.uid() and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
);
create policy finance_transactions_update_own on public.finance_transactions for update using (user_id = auth.uid()) with check (
  user_id = auth.uid() and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
);
create policy finance_transactions_delete_own on public.finance_transactions for delete using (user_id = auth.uid());

create policy meal_logs_select_own on public.meal_logs for select using (user_id = auth.uid());
create policy meal_logs_insert_own on public.meal_logs for insert with check (
  user_id = auth.uid() and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
);
create policy meal_logs_update_own on public.meal_logs for update using (user_id = auth.uid()) with check (
  user_id = auth.uid() and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
);
create policy meal_logs_delete_own on public.meal_logs for delete using (user_id = auth.uid());

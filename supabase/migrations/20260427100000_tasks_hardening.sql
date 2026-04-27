alter table public.tasks
  add column if not exists description text,
  add column if not exists category text,
  add column if not exists status text not null default 'open';

update public.tasks
set description = notes
where description is null and notes is not null;

update public.tasks
set status = case
  when completed_at is null then 'open'
  else 'completed'
end
where status not in ('open', 'completed')
   or (completed_at is null and status <> 'open')
   or (completed_at is not null and status <> 'completed');

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'tasks_status_check'
      and conrelid = 'public.tasks'::regclass
  ) then
    alter table public.tasks
      add constraint tasks_status_check check (status in ('open', 'completed'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'tasks_category_length_check'
      and conrelid = 'public.tasks'::regclass
  ) then
    alter table public.tasks
      add constraint tasks_category_length_check check (category is null or char_length(category) <= 40);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'tasks_description_length_check'
      and conrelid = 'public.tasks'::regclass
  ) then
    alter table public.tasks
      add constraint tasks_description_length_check check (description is null or char_length(description) <= 500);
  end if;
end;
$$;

create index if not exists tasks_user_space_due_date_idx on public.tasks (user_id, space_id, due_date);
create index if not exists tasks_user_space_status_idx on public.tasks (user_id, space_id, status);
create index if not exists tasks_user_space_updated_idx on public.tasks (user_id, space_id, updated_at desc);

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'tasks_set_updated_at') then
    create trigger tasks_set_updated_at
    before update on public.tasks
    for each row execute function public.set_updated_at();
  end if;
end;
$$;

alter table public.tasks enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tasks' and policyname = 'tasks_select_own'
  ) then
    create policy tasks_select_own on public.tasks for select using (user_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tasks' and policyname = 'tasks_insert_own'
  ) then
    create policy tasks_insert_own on public.tasks for insert with check (
      user_id = auth.uid()
      and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tasks' and policyname = 'tasks_update_own'
  ) then
    create policy tasks_update_own on public.tasks for update using (user_id = auth.uid()) with check (
      user_id = auth.uid()
      and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tasks' and policyname = 'tasks_delete_own'
  ) then
    create policy tasks_delete_own on public.tasks for delete using (user_id = auth.uid());
  end if;
end;
$$;

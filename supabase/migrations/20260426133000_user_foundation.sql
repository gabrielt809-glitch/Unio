create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_user_id_idx on public.profiles (user_id);

create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  space_id uuid not null references public.spaces(id) on delete cascade,
  default_route text not null default 'today',
  theme text not null default 'dark' check (theme in ('dark')),
  reduce_motion boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, space_id)
);

create index if not exists user_preferences_user_space_idx on public.user_preferences (user_id, space_id);

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'profiles_set_updated_at') then
    create trigger profiles_set_updated_at
    before update on public.profiles
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'user_preferences_set_updated_at') then
    create trigger user_preferences_set_updated_at
    before update on public.user_preferences
    for each row execute function public.set_updated_at();
  end if;
end;
$$;

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;

create or replace function public.ensure_user_foundation(target_user_id uuid, target_email text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  personal_space_id uuid;
begin
  insert into public.profiles (user_id, display_name)
  values (target_user_id, nullif(target_email, ''))
  on conflict (user_id) do nothing;

  insert into public.spaces (user_id, name, kind)
  values (target_user_id, 'Pessoal', 'personal')
  on conflict do nothing;

  select id
  into personal_space_id
  from public.spaces
  where user_id = target_user_id and kind = 'personal'
  order by created_at asc
  limit 1;

  if personal_space_id is not null then
    insert into public.user_preferences (user_id, space_id)
    values (target_user_id, personal_space_id)
    on conflict (user_id, space_id) do nothing;
  end if;

  return personal_space_id;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.ensure_user_foundation(new.id, new.email);
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created') then
    create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
  end if;
end;
$$;

insert into public.profiles (user_id, display_name)
select id, nullif(email, '')
from auth.users
on conflict (user_id) do nothing;

select public.ensure_user_foundation(id, email)
from auth.users;

create policy profiles_select_own on public.profiles for select using (user_id = auth.uid());
create policy profiles_insert_own on public.profiles for insert with check (user_id = auth.uid());
create policy profiles_update_own on public.profiles for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy profiles_delete_own on public.profiles for delete using (user_id = auth.uid());

create policy user_preferences_select_own on public.user_preferences for select using (user_id = auth.uid());
create policy user_preferences_insert_own on public.user_preferences for insert with check (
  user_id = auth.uid()
  and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
);
create policy user_preferences_update_own on public.user_preferences for update using (user_id = auth.uid()) with check (
  user_id = auth.uid()
  and exists (select 1 from public.spaces where spaces.id = space_id and spaces.user_id = auth.uid())
);
create policy user_preferences_delete_own on public.user_preferences for delete using (user_id = auth.uid());


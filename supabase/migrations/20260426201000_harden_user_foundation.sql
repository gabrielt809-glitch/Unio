create or replace function public.ensure_user_foundation(target_user_id uuid, target_email text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  personal_space_id uuid;
begin
  if auth.uid() is not null and auth.uid() <> target_user_id then
    raise exception 'Cannot ensure foundation for another user.';
  end if;

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

revoke execute on function public.ensure_user_foundation(uuid, text) from anon;
grant execute on function public.ensure_user_foundation(uuid, text) to authenticated;

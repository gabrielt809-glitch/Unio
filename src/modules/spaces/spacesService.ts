import { requireSupabase } from '../../services/supabase/client';
import type { Space } from '../../types/database';

export const ensurePersonalSpace = async (userId: string): Promise<Space> => {
  const client = requireSupabase();
  const { data: existing, error: readError } = await client
    .from('spaces')
    .select('*')
    .eq('user_id', userId)
    .eq('kind', 'personal')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (readError) {
    throw readError;
  }

  if (existing) {
    return existing;
  }

  const { data: created, error: createError } = await client
    .from('spaces')
    .insert({ user_id: userId, name: 'Pessoal', kind: 'personal' })
    .select('*')
    .single();

  if (createError) {
    throw createError;
  }

  return created;
};

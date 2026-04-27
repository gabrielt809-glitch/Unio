import type { User } from '@supabase/supabase-js';

import { requireSupabase } from '../../../services/supabase/client';
import { toAuthErrorMessage } from '../utils/authErrors';

export const ensureUserFoundation = async (
  user: Pick<User, 'id' | 'email'>,
  displayName?: string | null,
): Promise<void> => {
  const client = requireSupabase();
  const { error } = await client.rpc('ensure_user_foundation', {
    target_user_id: user.id,
    target_email: displayName?.trim() || user.email || null,
  });

  if (error) {
    throw new Error(toAuthErrorMessage(error));
  }
};

import { createClient } from '@supabase/supabase-js';

import { getSupabaseSetupMessage, supabaseEnv } from '../../config/env';
import type { Database } from '../../types/database';

export const supabase = supabaseEnv.isConfigured
  ? createClient<Database>(supabaseEnv.url, supabaseEnv.publishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const requireSupabase = () => {
  if (!supabase) {
    throw new Error(getSupabaseSetupMessage());
  }

  return supabase;
};

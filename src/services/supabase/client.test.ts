import { describe, expect, it } from 'vitest';

import { supabaseEnv } from '../../config/env';
import { supabase } from './client';

describe('Supabase client', () => {
  it('validates the local client safely without creating users or rows', async () => {
    if (!supabaseEnv.isConfigured) {
      expect(supabase).toBeNull();
      return;
    }

    if (!supabase) {
      throw new Error('Supabase client should be configured for this branch.');
    }

    const { data, error } = await supabase.auth.getSession();

    expect(error).toBeNull();
    expect(data).toHaveProperty('session');
  });
});

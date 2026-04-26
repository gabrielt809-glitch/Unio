import { describe, expect, it } from 'vitest';

import { createSupabaseEnv, getSupabaseSetupMessage } from './env';

describe('Supabase env', () => {
  it('marks placeholders as not configured', () => {
    const env = createSupabaseEnv('https://your-project.supabase.co', 'your-publishable-key');

    expect(env.isConfigured).toBe(false);
    expect(env.missingKeys).toEqual(['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY']);
  });

  it('accepts non-placeholder public Supabase values', () => {
    const env = createSupabaseEnv('https://abc.supabase.co', 'sb_publishable_test');

    expect(env.isConfigured).toBe(true);
    expect(env.keySource).toBe('publishable');
    expect(env.missingKeys).toEqual([]);
  });

  it('keeps a temporary fallback for legacy anon key setups', () => {
    const env = createSupabaseEnv('https://abc.supabase.co', '', 'legacy-anon-key');

    expect(env.isConfigured).toBe(true);
    expect(env.keySource).toBe('legacy-anon');
    expect(env.publishableKey).toBe('legacy-anon-key');
  });

  it('returns a clear setup message', () => {
    const env = createSupabaseEnv('', 'sb_publishable_test');

    expect(getSupabaseSetupMessage(env)).toContain('VITE_SUPABASE_URL');
  });
});

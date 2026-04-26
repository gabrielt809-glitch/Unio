import { describe, expect, it } from 'vitest';

import { toSupabaseMutationError } from './errors';

describe('toSupabaseMutationError', () => {
  it('returns null when there is no error', () => {
    expect(toSupabaseMutationError(null)).toBeNull();
  });

  it('normalizes Supabase-like errors', () => {
    expect(toSupabaseMutationError({ message: 'RLS denied' })?.message).toBe('RLS denied');
  });

  it('falls back to a stable message', () => {
    expect(toSupabaseMutationError({})?.message).toBe('Nao foi possivel sincronizar com o Supabase.');
  });
});

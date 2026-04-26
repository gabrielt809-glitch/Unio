import type { Session, User } from '@supabase/supabase-js';

import { requireSupabase } from '../../services/supabase/client';

export const getCurrentSession = async (): Promise<Session | null> => {
  const client = requireSupabase();
  const { data, error } = await client.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const client = requireSupabase();
  const { data, error } = await client.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
};

export const signInWithEmail = async (email: string): Promise<void> => {
  const client = requireSupabase();
  const { error } = await client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) {
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  const client = requireSupabase();
  const { error } = await client.auth.signOut();

  if (error) {
    throw error;
  }
};

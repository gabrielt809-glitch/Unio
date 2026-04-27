import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockUser = { id: 'user-id', email: 'teste@example.com' };

const supabaseMock = vi.hoisted(() => ({
  auth: {
    getSession: vi.fn(),
    getUser: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    signInWithOtp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    signUp: vi.fn(),
    updateUser: vi.fn(),
  },
  rpc: vi.fn(),
}));

vi.mock('../../../services/supabase/client', () => ({
  requireSupabase: () => supabaseMock,
}));

import {
  sendPasswordRecovery,
  signInWithMagicLink,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  updatePassword,
} from './authService';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabaseMock.auth.signInWithOtp.mockResolvedValue({ error: null });
    supabaseMock.auth.signInWithPassword.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });
    supabaseMock.auth.signUp.mockResolvedValue({
      data: { session: null, user: mockUser },
      error: null,
    });
    supabaseMock.auth.resetPasswordForEmail.mockResolvedValue({ error: null });
    supabaseMock.auth.updateUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    supabaseMock.auth.signOut.mockResolvedValue({ error: null });
    supabaseMock.rpc.mockResolvedValue({ data: 'space-id', error: null });
  });

  it('sends a magic link without creating a real email in tests', async () => {
    await signInWithMagicLink({ email: 'Teste@Example.com' });

    expect(supabaseMock.auth.signInWithOtp).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'teste@example.com' }),
    );
  });

  it('signs in with password and ensures user foundation', async () => {
    await signInWithPassword({ email: 'teste@example.com', password: 'senhateste' });

    expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'teste@example.com',
      password: 'senhateste',
    });
    expect(supabaseMock.rpc).toHaveBeenCalledWith('ensure_user_foundation', {
      target_email: 'teste@example.com',
      target_user_id: 'user-id',
    });
  });

  it('creates an account and reports email confirmation when there is no session', async () => {
    const result = await signUpWithPassword({
      confirmPassword: 'senhateste',
      displayName: 'Pessoa Teste',
      email: 'teste@example.com',
      password: 'senhateste',
    });

    expect(result.needsEmailConfirmation).toBe(true);
    expect(supabaseMock.auth.signUp).toHaveBeenCalled();
  });

  it('creates foundation after account creation when Supabase returns a session', async () => {
    supabaseMock.auth.signUp.mockResolvedValueOnce({
      data: { session: { user: mockUser }, user: mockUser },
      error: null,
    });

    const result = await signUpWithPassword({
      confirmPassword: 'senhateste',
      displayName: 'Pessoa Teste',
      email: 'teste@example.com',
      password: 'senhateste',
    });

    expect(result.needsEmailConfirmation).toBe(false);
    expect(supabaseMock.rpc).toHaveBeenCalledWith('ensure_user_foundation', {
      target_email: 'Pessoa Teste',
      target_user_id: 'user-id',
    });
  });

  it('sends password recovery with reset redirect', async () => {
    await sendPasswordRecovery({ email: 'teste@example.com' });

    expect(supabaseMock.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'teste@example.com',
      expect.objectContaining({
        redirectTo: expect.stringContaining('auth=reset'),
      }),
    );
  });

  it('updates password and signs out through mocked Supabase', async () => {
    await updatePassword({ confirmPassword: 'senhanova', password: 'senhanova' });
    await signOut();

    expect(supabaseMock.auth.updateUser).toHaveBeenCalledWith({ password: 'senhanova' });
    expect(supabaseMock.auth.signOut).toHaveBeenCalled();
  });
});

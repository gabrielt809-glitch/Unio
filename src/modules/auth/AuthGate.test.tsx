import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { User } from '@supabase/supabase-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  signInWithEmail: vi.fn(() => Promise.resolve()),
  useAuth: vi.fn(),
}));

vi.mock('../../config/env', () => ({
  supabaseEnv: {
    url: 'https://project.supabase.co',
    publishableKey: 'sb_publishable_test',
    legacyAnonKey: '',
    isConfigured: true,
    keySource: 'publishable',
    missingKeys: [],
  },
}));

vi.mock('./authService', () => ({
  signInWithEmail: mocks.signInWithEmail,
}));

vi.mock('./useAuth', () => ({
  useAuth: mocks.useAuth,
}));

import { AuthGate } from './AuthGate';

describe('AuthGate', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mocks.signInWithEmail.mockClear();
    mocks.useAuth.mockReturnValue({
      error: null,
      isAuthenticated: false,
      session: null,
      status: 'ready',
      user: null,
    });
  });

  it('renders the login form when Supabase is configured and there is no session', () => {
    render(<AuthGate>{() => <div>Private app</div>}</AuthGate>);

    expect(screen.getByRole('heading', { name: 'Tudo em um so lugar.' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.queryByText('Private app')).not.toBeInTheDocument();
  });

  it('calls the mocked magic link action without sending a real email', async () => {
    const user = userEvent.setup();

    render(<AuthGate>{() => <div>Private app</div>}</AuthGate>);
    await user.type(screen.getByLabelText('Email'), 'teste@example.com');
    await user.click(screen.getByRole('button', { name: 'Enviar link seguro' }));

    expect(mocks.signInWithEmail).toHaveBeenCalledWith('teste@example.com');
  });

  it('renders protected content when a session exists', () => {
    mocks.useAuth.mockReturnValue({
      error: null,
      isAuthenticated: true,
      session: { user: { id: 'user-id', email: 'teste@example.com' } },
      status: 'ready',
      user: { id: 'user-id', email: 'teste@example.com' } as User,
    });

    render(<AuthGate>{() => <div>Private app</div>}</AuthGate>);

    expect(screen.getByText('Private app')).toBeInTheDocument();
  });
});

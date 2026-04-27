import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { User } from '@supabase/supabase-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockUser = { id: 'user-id', email: 'teste@example.com' } as User;

const mocks = vi.hoisted(() => ({
  clearRecoveryRequired: vi.fn(),
  sendPasswordRecovery: vi.fn(() => Promise.resolve({ message: 'Recuperacao enviada.' })),
  signInWithMagicLink: vi.fn(() => Promise.resolve({ message: 'Magic link enviado.' })),
  signInWithPassword: vi.fn(() => Promise.resolve({ message: 'Login confirmado.' })),
  signUpWithPassword: vi.fn(() =>
    Promise.resolve({ message: 'Cadastro criado.', needsEmailConfirmation: false }),
  ),
  updatePassword: vi.fn(() => Promise.resolve({ message: 'Senha atualizada.' })),
  useAuth: vi.fn(),
  useUserFoundation: vi.fn(),
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

vi.mock('./hooks/useAuth', () => ({
  useAuth: mocks.useAuth,
}));

vi.mock('./hooks/useUserFoundation', () => ({
  useUserFoundation: mocks.useUserFoundation,
}));

vi.mock('./services/authService', () => ({
  sendPasswordRecovery: mocks.sendPasswordRecovery,
  signInWithMagicLink: mocks.signInWithMagicLink,
  signInWithPassword: mocks.signInWithPassword,
  signUpWithPassword: mocks.signUpWithPassword,
  updatePassword: mocks.updatePassword,
}));

import { AuthGate } from './AuthGate';

describe('AuthGate', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useAuth.mockReturnValue({
      clearRecoveryRequired: mocks.clearRecoveryRequired,
      error: null,
      isAuthenticated: false,
      recoveryRequired: false,
      session: null,
      status: 'ready',
      user: null,
    });
    mocks.useUserFoundation.mockReturnValue({
      error: null,
      retry: vi.fn(),
      status: 'ready',
    });
  });

  it('renders password login when there is no session', () => {
    render(<AuthGate>{() => <div>Private app</div>}</AuthGate>);

    expect(screen.getByRole('heading', { name: 'Entrar no Unio.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar com senha' })).toBeInTheDocument();
    expect(screen.queryByText('Private app')).not.toBeInTheDocument();
  });

  it('submits password login with mocked service', async () => {
    const user = userEvent.setup();

    render(<AuthGate>{() => <div>Private app</div>}</AuthGate>);
    await user.type(screen.getByLabelText('Email'), 'teste@example.com');
    await user.type(screen.getByPlaceholderText('Sua senha'), 'senhateste');
    await user.click(screen.getByRole('button', { name: 'Entrar com senha' }));

    expect(mocks.signInWithPassword).toHaveBeenCalledWith({
      email: 'teste@example.com',
      password: 'senhateste',
    });
  });

  it('keeps magic link flow available', async () => {
    const user = userEvent.setup();

    render(<AuthGate>{() => <div>Private app</div>}</AuthGate>);
    await user.click(screen.getByRole('tab', { name: 'Magic link' }));
    await user.type(screen.getByLabelText('Email'), 'teste@example.com');
    await user.click(screen.getByRole('button', { name: 'Enviar link seguro' }));

    expect(mocks.signInWithMagicLink).toHaveBeenCalledWith({ email: 'teste@example.com' });
  });

  it('submits account creation with mocked service', async () => {
    const user = userEvent.setup();

    render(<AuthGate>{() => <div>Private app</div>}</AuthGate>);
    await user.click(screen.getByRole('tab', { name: 'Cadastro' }));
    await user.type(screen.getByLabelText('Nome'), 'Pessoa Teste');
    await user.type(screen.getByLabelText('Email'), 'teste@example.com');
    await user.type(screen.getByPlaceholderText('Crie uma senha'), 'senhateste');
    await user.type(screen.getByLabelText('Confirmar senha'), 'senhateste');
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(mocks.signUpWithPassword).toHaveBeenCalledWith({
      confirmPassword: 'senhateste',
      displayName: 'Pessoa Teste',
      email: 'teste@example.com',
      password: 'senhateste',
    });
  });

  it('submits password recovery with mocked service', async () => {
    const user = userEvent.setup();

    render(<AuthGate>{() => <div>Private app</div>}</AuthGate>);
    await user.click(screen.getByRole('button', { name: 'Esqueci minha senha' }));
    await user.type(screen.getByLabelText('Email'), 'teste@example.com');
    await user.click(screen.getByRole('button', { name: 'Enviar recuperacao' }));

    expect(mocks.sendPasswordRecovery).toHaveBeenCalledWith({ email: 'teste@example.com' });
  });

  it('renders reset password flow when recovery is required', async () => {
    const user = userEvent.setup();
    mocks.useAuth.mockReturnValue({
      clearRecoveryRequired: mocks.clearRecoveryRequired,
      error: null,
      isAuthenticated: true,
      recoveryRequired: true,
      session: { user: mockUser },
      status: 'ready',
      user: mockUser,
    });

    render(<AuthGate>{() => <div>Private app</div>}</AuthGate>);
    await user.type(screen.getByLabelText('Nova senha'), 'senhanova');
    await user.type(screen.getByLabelText('Confirmar nova senha'), 'senhanova');
    await user.click(screen.getByRole('button', { name: 'Atualizar senha' }));

    expect(mocks.updatePassword).toHaveBeenCalledWith({
      confirmPassword: 'senhanova',
      password: 'senhanova',
    });
  });

  it('renders protected content and ensures foundation when a session exists', () => {
    mocks.useAuth.mockReturnValue({
      clearRecoveryRequired: mocks.clearRecoveryRequired,
      error: null,
      isAuthenticated: true,
      recoveryRequired: false,
      session: { user: mockUser },
      status: 'ready',
      user: mockUser,
    });

    render(<AuthGate>{() => <div>Private app</div>}</AuthGate>);

    expect(mocks.useUserFoundation).toHaveBeenCalledWith(mockUser);
    expect(screen.getByText('Private app')).toBeInTheDocument();
  });
});

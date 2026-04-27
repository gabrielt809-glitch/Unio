import type { Session, User } from '@supabase/supabase-js';

import { requireSupabase } from '../../../services/supabase/client';
import type {
  LoginFormValues,
  MagicLinkFormValues,
  PasswordRecoveryFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
} from '../schemas/authSchemas';
import type { AuthSubmitResult, SignUpResult } from '../types/authTypes';
import { toAuthErrorMessage } from '../utils/authErrors';
import { getAuthRedirectUrl } from '../utils/authRedirect';
import { ensureUserFoundation } from './userFoundationService';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const getCurrentSession = async (): Promise<Session | null> => {
  const client = requireSupabase();
  const { data, error } = await client.auth.getSession();

  if (error) {
    throw new Error(toAuthErrorMessage(error));
  }

  return data.session;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const client = requireSupabase();
  const { data, error } = await client.auth.getUser();

  if (error) {
    throw new Error(toAuthErrorMessage(error));
  }

  return data.user;
};

export const signInWithPassword = async (values: LoginFormValues): Promise<AuthSubmitResult> => {
  const client = requireSupabase();
  const { data, error } = await client.auth.signInWithPassword({
    email: normalizeEmail(values.email),
    password: values.password,
  });

  if (error) {
    throw new Error(toAuthErrorMessage(error));
  }

  if (data.session?.user) {
    await ensureUserFoundation(data.session.user);
  }

  return { message: 'Login confirmado. Preparando seu espaco.' };
};

export const signUpWithPassword = async (values: RegisterFormValues): Promise<SignUpResult> => {
  const client = requireSupabase();
  const { data, error } = await client.auth.signUp({
    email: normalizeEmail(values.email),
    password: values.password,
    options: {
      data: {
        display_name: values.displayName.trim(),
      },
      emailRedirectTo: getAuthRedirectUrl(),
    },
  });

  if (error) {
    throw new Error(toAuthErrorMessage(error));
  }

  if (data.session?.user) {
    await ensureUserFoundation(data.session.user, values.displayName);
  }

  return {
    message: data.session
      ? 'Conta criada. Preparando seu espaco.'
      : 'Cadastro criado. Confirme seu email para acessar o Unio.',
    needsEmailConfirmation: !data.session,
  };
};

export const signInWithMagicLink = async (values: MagicLinkFormValues): Promise<AuthSubmitResult> => {
  const client = requireSupabase();
  const { error } = await client.auth.signInWithOtp({
    email: normalizeEmail(values.email),
    options: {
      emailRedirectTo: getAuthRedirectUrl(),
    },
  });

  if (error) {
    throw new Error(toAuthErrorMessage(error));
  }

  return { message: 'Link enviado. Confira sua caixa de entrada para continuar.' };
};

export const sendPasswordRecovery = async (values: PasswordRecoveryFormValues): Promise<AuthSubmitResult> => {
  const client = requireSupabase();
  const { error } = await client.auth.resetPasswordForEmail(normalizeEmail(values.email), {
    redirectTo: getAuthRedirectUrl('reset'),
  });

  if (error) {
    throw new Error(toAuthErrorMessage(error));
  }

  return { message: 'Enviamos um link seguro para redefinir sua senha.' };
};

export const updatePassword = async (values: ResetPasswordFormValues): Promise<AuthSubmitResult> => {
  const client = requireSupabase();
  const { data, error } = await client.auth.updateUser({
    password: values.password,
  });

  if (error) {
    throw new Error(toAuthErrorMessage(error));
  }

  if (data.user) {
    await ensureUserFoundation(data.user);
  }

  return { message: 'Senha atualizada com sucesso.' };
};

export const signOut = async (): Promise<void> => {
  const client = requireSupabase();
  const { error } = await client.auth.signOut();

  if (error) {
    throw new Error(toAuthErrorMessage(error));
  }
};

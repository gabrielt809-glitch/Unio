import { describe, expect, it } from 'vitest';

import {
  loginSchema,
  magicLinkSchema,
  passwordRecoverySchema,
  registerSchema,
  resetPasswordSchema,
} from './authSchemas';

describe('auth schemas', () => {
  it('validates login data', () => {
    expect(loginSchema.safeParse({ email: 'teste@example.com', password: 'senha' }).success).toBe(true);
    expect(loginSchema.safeParse({ email: 'email-invalido', password: '' }).success).toBe(false);
  });

  it('validates registration data and matching passwords', () => {
    expect(
      registerSchema.safeParse({
        confirmPassword: 'senhateste',
        displayName: 'Pessoa Teste',
        email: 'teste@example.com',
        password: 'senhateste',
      }).success,
    ).toBe(true);
    expect(
      registerSchema.safeParse({
        confirmPassword: 'outrasenha',
        displayName: 'Pessoa Teste',
        email: 'teste@example.com',
        password: 'senhateste',
      }).success,
    ).toBe(false);
  });

  it('validates magic link and recovery email data', () => {
    expect(magicLinkSchema.safeParse({ email: 'teste@example.com' }).success).toBe(true);
    expect(passwordRecoverySchema.safeParse({ email: 'teste@example.com' }).success).toBe(true);
    expect(passwordRecoverySchema.safeParse({ email: 'sem-email' }).success).toBe(false);
  });

  it('validates reset password data', () => {
    expect(
      resetPasswordSchema.safeParse({
        confirmPassword: 'senhanova',
        password: 'senhanova',
      }).success,
    ).toBe(true);
    expect(
      resetPasswordSchema.safeParse({
        confirmPassword: 'diferente',
        password: 'senhanova',
      }).success,
    ).toBe(false);
  });
});

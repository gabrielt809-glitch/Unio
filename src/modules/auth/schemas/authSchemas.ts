import { z } from 'zod';

const emailSchema = z.string().trim().min(1, 'Informe seu email.').email('Informe um email valido.');

const passwordSchema = z.string().min(8, 'Use pelo menos 8 caracteres.').max(128, 'Use uma senha menor.');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe sua senha.'),
});

export const registerSchema = z
  .object({
    displayName: z.string().trim().min(2, 'Informe seu nome.').max(80, 'Use um nome menor.'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas precisam ser iguais.',
    path: ['confirmPassword'],
  });

export const magicLinkSchema = z.object({
  email: emailSchema,
});

export const passwordRecoverySchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme sua nova senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas precisam ser iguais.',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type MagicLinkFormValues = z.infer<typeof magicLinkSchema>;
export type PasswordRecoveryFormValues = z.infer<typeof passwordRecoverySchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

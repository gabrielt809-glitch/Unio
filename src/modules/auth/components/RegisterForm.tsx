import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '../../../components/Button';
import { FieldShell, TextInput } from '../../../components/Field';
import { useAsyncAction } from '../../../hooks/useAsyncAction';
import { registerSchema, type RegisterFormValues } from '../schemas/authSchemas';
import { signUpWithPassword } from '../services/authService';
import { AuthNotice } from './AuthNotice';

export const RegisterForm = () => {
  const action = useAsyncAction();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { confirmPassword: '', displayName: '', email: '', password: '' },
  });

  const submit = handleSubmit((values) => {
    void action.run(async () => {
      const result = await signUpWithPassword(values);
      setSuccessMessage(result.message);
    });
  });

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <FieldShell label="Nome" error={errors.displayName?.message}>
        <TextInput autoComplete="name" placeholder="Seu nome" {...register('displayName')} />
      </FieldShell>
      <FieldShell label="Email" error={errors.email?.message}>
        <TextInput
          autoComplete="email"
          inputMode="email"
          placeholder="voce@email.com"
          {...register('email')}
        />
      </FieldShell>
      <FieldShell label="Senha" error={errors.password?.message} hint="Use pelo menos 8 caracteres.">
        <TextInput
          autoComplete="new-password"
          placeholder="Crie uma senha"
          type="password"
          {...register('password')}
        />
      </FieldShell>
      <FieldShell label="Confirmar senha" error={errors.confirmPassword?.message}>
        <TextInput
          autoComplete="new-password"
          placeholder="Repita a senha"
          type="password"
          {...register('confirmPassword')}
        />
      </FieldShell>
      <Button
        icon={<UserPlus aria-hidden="true" className="h-4 w-4" />}
        isLoading={action.isRunning}
        size="lg"
        type="submit"
      >
        Criar conta
      </Button>
      {successMessage ? <AuthNotice tone="success">{successMessage}</AuthNotice> : null}
      {action.error ? <AuthNotice tone="error">{action.error}</AuthNotice> : null}
    </form>
  );
};

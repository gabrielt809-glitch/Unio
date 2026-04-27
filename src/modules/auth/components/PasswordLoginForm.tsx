import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '../../../components/Button';
import { FieldShell, TextInput } from '../../../components/Field';
import { useAsyncAction } from '../../../hooks/useAsyncAction';
import { loginSchema, type LoginFormValues } from '../schemas/authSchemas';
import { signInWithPassword } from '../services/authService';
import { AuthNotice } from './AuthNotice';

type PasswordLoginFormProps = {
  onRecoverPassword: () => void;
};

export const PasswordLoginForm = ({ onRecoverPassword }: PasswordLoginFormProps) => {
  const action = useAsyncAction();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const submit = handleSubmit((values) => {
    void action.run(async () => {
      const result = await signInWithPassword(values);
      setSuccessMessage(result.message);
    });
  });

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <FieldShell label="Email" error={errors.email?.message}>
        <TextInput
          autoComplete="email"
          inputMode="email"
          placeholder="voce@email.com"
          {...register('email')}
        />
      </FieldShell>
      <FieldShell label="Senha" error={errors.password?.message}>
        <TextInput
          autoComplete="current-password"
          placeholder="Sua senha"
          type="password"
          {...register('password')}
        />
      </FieldShell>
      <Button
        icon={<LogIn aria-hidden="true" className="h-4 w-4" />}
        isLoading={action.isRunning}
        size="lg"
        type="submit"
      >
        Entrar com senha
      </Button>
      <button
        className="text-left text-sm font-semibold text-accent"
        type="button"
        onClick={onRecoverPassword}
      >
        Esqueci minha senha
      </button>
      {successMessage ? <AuthNotice tone="success">{successMessage}</AuthNotice> : null}
      {action.error ? <AuthNotice tone="error">{action.error}</AuthNotice> : null}
    </form>
  );
};

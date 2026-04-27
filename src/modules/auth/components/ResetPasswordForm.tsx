import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '../../../components/Button';
import { FieldShell, TextInput } from '../../../components/Field';
import { useAsyncAction } from '../../../hooks/useAsyncAction';
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas/authSchemas';
import { updatePassword } from '../services/authService';
import { AuthNotice } from './AuthNotice';

type ResetPasswordFormProps = {
  onComplete: () => void;
};

export const ResetPasswordForm = ({ onComplete }: ResetPasswordFormProps) => {
  const action = useAsyncAction();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { confirmPassword: '', password: '' },
  });

  const submit = handleSubmit((values) => {
    void action.run(async () => {
      const result = await updatePassword(values);
      setSuccessMessage(result.message);
    });
  });

  if (successMessage) {
    return (
      <div className="grid gap-4">
        <AuthNotice tone="success">{successMessage}</AuthNotice>
        <Button icon={<CheckCircle2 aria-hidden="true" className="h-4 w-4" />} size="lg" onClick={onComplete}>
          Continuar no Unio
        </Button>
      </div>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <FieldShell label="Nova senha" error={errors.password?.message}>
        <TextInput
          autoComplete="new-password"
          placeholder="Nova senha"
          type="password"
          {...register('password')}
        />
      </FieldShell>
      <FieldShell label="Confirmar nova senha" error={errors.confirmPassword?.message}>
        <TextInput
          autoComplete="new-password"
          placeholder="Repita a nova senha"
          type="password"
          {...register('confirmPassword')}
        />
      </FieldShell>
      <Button
        icon={<KeyRound aria-hidden="true" className="h-4 w-4" />}
        isLoading={action.isRunning}
        size="lg"
        type="submit"
      >
        Atualizar senha
      </Button>
      {action.error ? <AuthNotice tone="error">{action.error}</AuthNotice> : null}
    </form>
  );
};

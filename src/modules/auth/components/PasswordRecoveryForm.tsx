import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '../../../components/Button';
import { FieldShell, TextInput } from '../../../components/Field';
import { useAsyncAction } from '../../../hooks/useAsyncAction';
import { passwordRecoverySchema, type PasswordRecoveryFormValues } from '../schemas/authSchemas';
import { sendPasswordRecovery } from '../services/authService';
import { AuthNotice } from './AuthNotice';

type PasswordRecoveryFormProps = {
  onBack: () => void;
};

export const PasswordRecoveryForm = ({ onBack }: PasswordRecoveryFormProps) => {
  const action = useAsyncAction();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<PasswordRecoveryFormValues>({
    resolver: zodResolver(passwordRecoverySchema),
    defaultValues: { email: '' },
  });

  const submit = handleSubmit((values) => {
    void action.run(async () => {
      const result = await sendPasswordRecovery(values);
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
      <Button
        icon={<Send aria-hidden="true" className="h-4 w-4" />}
        isLoading={action.isRunning}
        size="lg"
        type="submit"
      >
        Enviar recuperacao
      </Button>
      <Button icon={<ArrowLeft aria-hidden="true" className="h-4 w-4" />} variant="ghost" onClick={onBack}>
        Voltar para login
      </Button>
      {successMessage ? <AuthNotice tone="success">{successMessage}</AuthNotice> : null}
      {action.error ? <AuthNotice tone="error">{action.error}</AuthNotice> : null}
    </form>
  );
};

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '../../../components/Button';
import { FieldShell, TextInput } from '../../../components/Field';
import { useAsyncAction } from '../../../hooks/useAsyncAction';
import { magicLinkSchema, type MagicLinkFormValues } from '../schemas/authSchemas';
import { signInWithMagicLink } from '../services/authService';
import { AuthNotice } from './AuthNotice';

export const MagicLinkForm = () => {
  const action = useAsyncAction();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<MagicLinkFormValues>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: '' },
  });

  const submit = handleSubmit((values) => {
    void action.run(async () => {
      const result = await signInWithMagicLink(values);
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
        icon={<Mail aria-hidden="true" className="h-4 w-4" />}
        isLoading={action.isRunning}
        size="lg"
        type="submit"
      >
        Enviar link seguro
      </Button>
      {successMessage ? <AuthNotice tone="success">{successMessage}</AuthNotice> : null}
      {action.error ? <AuthNotice tone="error">{action.error}</AuthNotice> : null}
    </form>
  );
};

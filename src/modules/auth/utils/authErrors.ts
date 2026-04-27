export const toAuthErrorMessage = (error: { message?: string } | null): string => {
  const message = error?.message?.toLowerCase() ?? '';

  if (message.includes('invalid login credentials')) {
    return 'Email ou senha incorretos.';
  }

  if (message.includes('email not confirmed')) {
    return 'Confirme seu email antes de entrar.';
  }

  if (message.includes('user already registered') || message.includes('already registered')) {
    return 'Ja existe uma conta com este email.';
  }

  if (message.includes('password')) {
    return 'Verifique a senha informada e tente novamente.';
  }

  if (message.includes('rate limit') || message.includes('too many')) {
    return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos.';
  }

  return error?.message || 'Nao foi possivel concluir a autenticacao agora.';
};

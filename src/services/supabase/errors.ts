export const toSupabaseMutationError = (error: { message?: string } | null): Error | null => {
  if (!error) {
    return null;
  }

  return new Error(error.message || 'Nao foi possivel sincronizar com o Supabase.');
};

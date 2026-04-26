export type SupabaseEnv = {
  url: string;
  publishableKey: string;
  legacyAnonKey: string;
  isConfigured: boolean;
  keySource: 'publishable' | 'legacy-anon' | 'missing';
  missingKeys: Array<'VITE_SUPABASE_URL' | 'VITE_SUPABASE_PUBLISHABLE_KEY'>;
};

const readEnvValue = (value: string | undefined): string => value?.trim() ?? '';

const isPlaceholder = (value: string): boolean =>
  value.includes('your-project') ||
  value.includes('your-public-anon-key') ||
  value.includes('your-publishable-key');

export const createSupabaseEnv = (
  urlValue: string | undefined,
  publishableKeyValue: string | undefined,
  legacyAnonKeyValue?: string | undefined,
): SupabaseEnv => {
  const url = readEnvValue(urlValue);
  const publishableKey = readEnvValue(publishableKeyValue);
  const legacyAnonKey = readEnvValue(legacyAnonKeyValue);
  const resolvedKey = publishableKey || legacyAnonKey;
  const keySource = publishableKey ? 'publishable' : legacyAnonKey ? 'legacy-anon' : 'missing';
  const missingKeys: SupabaseEnv['missingKeys'] = [];

  if (!url || isPlaceholder(url)) {
    missingKeys.push('VITE_SUPABASE_URL');
  }

  if (!resolvedKey || isPlaceholder(resolvedKey)) {
    missingKeys.push('VITE_SUPABASE_PUBLISHABLE_KEY');
  }

  return {
    url,
    publishableKey: resolvedKey,
    legacyAnonKey,
    isConfigured: missingKeys.length === 0,
    keySource,
    missingKeys,
  };
};

export const supabaseEnv = createSupabaseEnv(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const getSupabaseSetupMessage = (env: SupabaseEnv = supabaseEnv): string => {
  if (env.isConfigured) {
    return 'Supabase configurado.';
  }

  return `Configure ${env.missingKeys.join(' e ')} para usar o Unio.`;
};

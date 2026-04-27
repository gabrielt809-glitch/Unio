const LOCALHOST_ORIGIN = 'http://localhost:5173';

export const getAuthRedirectUrl = (target: 'app' | 'reset' = 'app'): string => {
  const currentOrigin = window.location.origin;
  const origin = currentOrigin === 'http://127.0.0.1:5173' ? LOCALHOST_ORIGIN : currentOrigin;
  const url = new URL(origin);

  if (target === 'reset') {
    url.searchParams.set('auth', 'reset');
  }

  return url.toString();
};

export const hasPasswordRecoveryIntent = (): boolean => {
  const params = new URLSearchParams(window.location.search);

  return (
    params.get('auth') === 'reset' ||
    window.location.hash.includes('type=recovery') ||
    window.location.hash.includes('type=invite')
  );
};

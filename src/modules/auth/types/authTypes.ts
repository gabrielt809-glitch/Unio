export type AuthMode = 'login' | 'register' | 'magic-link' | 'recover-password' | 'reset-password';

export type AuthSubmitResult = {
  message: string;
};

export type SignUpResult = AuthSubmitResult & {
  needsEmailConfirmation: boolean;
};

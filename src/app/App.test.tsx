import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../config/env', () => ({
  createSupabaseEnv: vi.fn(),
  getSupabaseSetupMessage: () =>
    'Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY para usar o Unio.',
  supabaseEnv: {
    url: '',
    publishableKey: '',
    legacyAnonKey: '',
    isConfigured: false,
    keySource: 'missing',
    missingKeys: ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'],
  },
}));

import { App } from './App';

describe('App', () => {
  it('renders the Supabase setup state when environment variables are not configured', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Conecte o Supabase' })).toBeInTheDocument();
  });
});

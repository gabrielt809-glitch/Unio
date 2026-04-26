import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders an accessible clamped progress value', () => {
    render(<ProgressBar label="Progresso" value={140} />);

    expect(screen.getByRole('progressbar', { name: 'Progresso' })).toHaveAttribute('aria-valuenow', '100');
  });
});

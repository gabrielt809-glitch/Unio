import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TaskForm } from '../components/TaskForm';

describe('TaskForm', () => {
  it('renders date and form fields with safe responsive width classes', () => {
    render(<TaskForm isBusy={false} onSubmit={() => Promise.resolve()} />);

    for (const control of [
      screen.getByLabelText('Titulo'),
      screen.getByLabelText('Descricao'),
      screen.getByLabelText(/^Data/),
      screen.getByLabelText('Prioridade'),
      screen.getByLabelText('Categoria'),
    ]) {
      expect(control).toHaveClass('w-full');
      expect(control).toHaveClass('min-w-0');
      expect(control).toHaveClass('max-w-full');
    }
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FieldShell, Input, Select, Textarea } from './Field';

describe('Field components', () => {
  it('connects labels to the input interaction area', async () => {
    const user = userEvent.setup();

    render(
      <FieldShell label="Nome">
        <Input placeholder="Seu nome" />
      </FieldShell>,
    );

    await user.type(screen.getByLabelText('Nome'), 'Unio');

    expect(screen.getByDisplayValue('Unio')).toBeInTheDocument();
  });

  it('renders textarea and select with accessible labels', () => {
    render(
      <div>
        <FieldShell label="Notas">
          <Textarea />
        </FieldShell>
        <FieldShell label="Prioridade">
          <Select defaultValue="medium">
            <option value="medium">Media</option>
          </Select>
        </FieldShell>
      </div>,
    );

    expect(screen.getByLabelText('Notas')).toBeInTheDocument();
    expect(screen.getByLabelText('Prioridade')).toHaveValue('medium');
  });

  it('keeps form controls constrained to their parent width', () => {
    render(
      <div>
        <FieldShell label="Data">
          <Input type="date" />
        </FieldShell>
        <FieldShell label="Descricao">
          <Textarea />
        </FieldShell>
        <FieldShell label="Categoria">
          <Select defaultValue="personal">
            <option value="personal">Pessoal</option>
          </Select>
        </FieldShell>
      </div>,
    );

    for (const control of [
      screen.getByLabelText('Data'),
      screen.getByLabelText('Descricao'),
      screen.getByLabelText('Categoria'),
    ]) {
      expect(control).toHaveClass('w-full');
      expect(control).toHaveClass('min-w-0');
      expect(control).toHaveClass('max-w-full');
    }
  });
});

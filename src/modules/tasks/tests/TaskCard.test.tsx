import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TaskCard } from '../components/TaskCard';
import { makeTask } from './taskTestFactory';

describe('TaskCard', () => {
  it('exposes edit, delete and completion actions', async () => {
    const user = userEvent.setup();
    const task = makeTask({ title: 'Enviar relatorio', category: 'Trabalho' });
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    const onToggle = vi.fn();

    render(<TaskCard isBusy={false} task={task} onDelete={onDelete} onEdit={onEdit} onToggle={onToggle} />);

    expect(screen.getByText('Enviar relatorio')).toBeInTheDocument();
    expect(screen.getByText('Trabalho')).toBeInTheDocument();
    expect(screen.getByText('Enviar relatorio')).toHaveClass('break-words');

    await user.click(screen.getByRole('button', { name: 'Concluir tarefa' }));
    await user.click(screen.getByRole('button', { name: 'Editar tarefa' }));
    await user.click(screen.getByRole('button', { name: 'Excluir tarefa' }));

    expect(onToggle).toHaveBeenCalledWith(task);
    expect(onEdit).toHaveBeenCalledWith(task);
    expect(onDelete).toHaveBeenCalledWith(task);
  });
});

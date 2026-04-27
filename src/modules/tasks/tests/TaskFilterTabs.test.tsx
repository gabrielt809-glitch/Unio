import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { TaskFilter } from '../types/taskTypes';
import { TaskFilterTabs } from '../components/TaskFilterTabs';

describe('TaskFilterTabs', () => {
  it('changes filters from a stable tab control', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    const counts: Record<TaskFilter, number> = {
      today: 1,
      upcoming: 2,
      undated: 3,
      completed: 4,
      all: 10,
    };

    render(<TaskFilterTabs activeFilter="today" counts={counts} onFilterChange={onFilterChange} />);

    expect(screen.getByRole('tablist')).toHaveClass('max-w-full');
    expect(screen.getByRole('tablist')).toHaveClass('overflow-x-auto');
    expect(screen.getByRole('tab', { name: 'Hoje, 1 tarefas' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('tab', { name: 'Sem data, 3 tarefas' }));

    expect(onFilterChange).toHaveBeenCalledWith('undated');
  });
});

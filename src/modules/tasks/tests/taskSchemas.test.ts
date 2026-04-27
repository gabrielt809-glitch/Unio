import { describe, expect, it } from 'vitest';

import { taskSchema } from '../schemas/taskSchemas';

describe('taskSchema', () => {
  it('rejects empty titles', () => {
    const result = taskSchema.safeParse({
      title: '   ',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: '',
    });

    expect(result.success).toBe(false);
  });

  it('accepts tasks without a date', () => {
    const result = taskSchema.safeParse({
      title: 'Revisar semana',
      description: 'Separar proximas acoes',
      dueDate: '',
      priority: 'high',
      category: 'Planejamento',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid date formats', () => {
    const result = taskSchema.safeParse({
      title: 'Tarefa com data ruim',
      description: '',
      dueDate: '27/04/2026',
      priority: 'low',
      category: '',
    });

    expect(result.success).toBe(false);
  });
});

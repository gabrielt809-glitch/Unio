import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeTask } from './taskTestFactory';

type Chain = {
  data?: unknown;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  error?: unknown;
  from: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  select: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

const supabaseMock = vi.hoisted(() => ({
  chain: null as Chain | null,
  from: vi.fn(),
}));

vi.mock('../../../services/supabase/client', () => ({
  requireSupabase: () => ({
    from: supabaseMock.from,
  }),
}));

import { createTask, deleteTask, listTasks, setTaskCompletion, updateTask } from '../services/tasksService';

const createChain = (result: unknown): Chain => {
  const chain = {} as Chain;
  if (typeof result === 'object' && result !== null && 'data' in result) {
    chain.data = result.data;
  }
  if (typeof result === 'object' && result !== null && 'error' in result) {
    chain.error = result.error;
  }
  chain.delete = vi.fn(() => chain);
  chain.eq = vi.fn(() => chain);
  chain.from = vi.fn(() => chain);
  chain.insert = vi.fn(() => chain);
  chain.order = vi.fn(() => chain);
  chain.select = vi.fn(() => chain);
  chain.single = vi.fn(() => Promise.resolve(result));
  chain.update = vi.fn(() => chain);
  return chain;
};

const taskValues = {
  title: 'Tarefa nova',
  description: 'Descricao',
  dueDate: '',
  priority: 'medium' as const,
  category: 'Casa',
};

describe('tasksService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists tasks scoped by user and space', async () => {
    const chain = createChain({ data: [makeTask()], error: null });
    supabaseMock.from.mockReturnValue(chain);

    const result = await listTasks({ userId: 'user-id', spaceId: 'space-id' });

    expect(result).toHaveLength(1);
    expect(supabaseMock.from).toHaveBeenCalledWith('tasks');
    expect(chain.eq).toHaveBeenCalledWith('user_id', 'user-id');
    expect(chain.eq).toHaveBeenCalledWith('space_id', 'space-id');
  });

  it('creates tasks with null due date and scoped ids', async () => {
    const chain = createChain({ data: makeTask({ title: 'Tarefa nova' }), error: null });
    supabaseMock.from.mockReturnValue(chain);

    await createTask({ userId: 'user-id', spaceId: 'space-id' }, taskValues);

    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-id',
        space_id: 'space-id',
        title: 'Tarefa nova',
        due_date: null,
        status: 'open',
      }),
    );
  });

  it('updates editable task fields without changing ownership', async () => {
    const chain = createChain({ data: makeTask(), error: null });
    supabaseMock.from.mockReturnValue(chain);

    await updateTask({ userId: 'user-id', spaceId: 'space-id', taskId: 'task-id', values: taskValues });

    expect(chain.update).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Tarefa nova',
        description: 'Descricao',
        category: 'Casa',
      }),
    );
    expect(chain.eq).toHaveBeenCalledWith('id', 'task-id');
    expect(chain.eq).toHaveBeenCalledWith('user_id', 'user-id');
    expect(chain.eq).toHaveBeenCalledWith('space_id', 'space-id');
  });

  it('marks and reopens a task with status and completed_at', async () => {
    const task = makeTask();
    const chain = createChain({ data: task, error: null });
    supabaseMock.from.mockReturnValue(chain);

    await setTaskCompletion({ task, isComplete: true });
    expect(chain.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'completed',
        completed_at: expect.any(String),
      }),
    );

    await setTaskCompletion({ task, isComplete: false });
    expect(chain.update).toHaveBeenCalledWith({ status: 'open', completed_at: null });
  });

  it('deletes by id, user and space', async () => {
    const chain = createChain({ error: null });
    supabaseMock.from.mockReturnValue(chain);

    await deleteTask({ task: makeTask() });

    expect(chain.delete).toHaveBeenCalled();
    expect(chain.eq).toHaveBeenCalledWith('id', 'task-id');
    expect(chain.eq).toHaveBeenCalledWith('user_id', 'user-id');
    expect(chain.eq).toHaveBeenCalledWith('space_id', 'space-id');
  });
});

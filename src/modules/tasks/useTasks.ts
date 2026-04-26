import { useCallback, useEffect, useState } from 'react';

import type { Task } from '../../types/database';
import { toErrorMessage } from '../../utils/errors';
import { createTask, deleteTask, listTasks, setTaskCompletion } from './tasksService';
import type { TaskDraft } from './tasksTypes';

type TasksState = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
};

export const useTasks = (userId: string, spaceId: string) => {
  const [state, setState] = useState<TasksState>({ tasks: [], isLoading: true, error: null });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }));
    try {
      const tasks = await listTasks(userId, spaceId);
      setState({ tasks, isLoading: false, error: null });
    } catch (error) {
      setState({ tasks: [], isLoading: false, error: toErrorMessage(error) });
    }
  }, [spaceId, userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addTask = useCallback(
    async (draft: TaskDraft) => {
      const created = await createTask(userId, spaceId, draft);
      setState((current) => ({ ...current, tasks: [created, ...current.tasks] }));
    },
    [spaceId, userId],
  );

  const toggleTask = useCallback(async (task: Task) => {
    const updated = await setTaskCompletion(task, !task.completed_at);
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((item) => (item.id === updated.id ? updated : item)),
    }));
  }, []);

  const removeTask = useCallback(async (task: Task) => {
    await deleteTask(task);
    setState((current) => ({
      ...current,
      tasks: current.tasks.filter((item) => item.id !== task.id),
    }));
  }, []);

  return { ...state, addTask, refresh, removeTask, toggleTask };
};

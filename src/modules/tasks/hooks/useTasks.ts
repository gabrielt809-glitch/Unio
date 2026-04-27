import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Task } from '../../../types/database';
import { toErrorMessage } from '../../../utils/errors';
import { createTask, deleteTask, listTasks, setTaskCompletion, updateTask } from '../services/tasksService';
import type { TaskFormValues, TaskMutationContext, UpdateTaskInput } from '../types/taskTypes';
import { isTaskCompleted } from '../utils/taskFilters';

export const tasksQueryKeys = {
  all: ['tasks'] as const,
  list: (userId: string, spaceId: string) => ['tasks', 'list', userId, spaceId] as const,
};

export const useTasks = (userId: string, spaceId: string) => {
  const queryClient = useQueryClient();
  const context: TaskMutationContext = { spaceId, userId };
  const queryKey = tasksQueryKeys.list(userId, spaceId);

  const tasksQuery = useQuery({
    enabled: Boolean(userId && spaceId),
    queryKey,
    queryFn: () => listTasks(context),
  });

  const invalidateTasks = () => queryClient.invalidateQueries({ queryKey });

  const createMutation = useMutation({
    mutationFn: (values: TaskFormValues) => createTask(context, values),
    onSuccess: invalidateTasks,
  });

  const updateMutation = useMutation({
    mutationFn: (input: Omit<UpdateTaskInput, 'spaceId' | 'userId'>) =>
      updateTask({ ...input, spaceId, userId }),
    onSuccess: invalidateTasks,
  });

  const toggleMutation = useMutation({
    mutationFn: (task: Task) => setTaskCompletion({ isComplete: !isTaskCompleted(task), task }),
    onSuccess: invalidateTasks,
  });

  const deleteMutation = useMutation({
    mutationFn: (task: Task) => deleteTask({ task }),
    onSuccess: invalidateTasks,
  });

  const mutationError =
    createMutation.error ?? updateMutation.error ?? toggleMutation.error ?? deleteMutation.error;

  return {
    tasks: tasksQuery.data ?? [],
    error: tasksQuery.error ? toErrorMessage(tasksQuery.error) : null,
    actionError: mutationError ? toErrorMessage(mutationError) : null,
    isLoading: tasksQuery.isPending,
    isRefreshing: tasksQuery.isFetching,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      toggleMutation.isPending ||
      deleteMutation.isPending,
    addTask: createMutation.mutateAsync,
    updateTask: updateMutation.mutateAsync,
    toggleTask: toggleMutation.mutateAsync,
    removeTask: deleteMutation.mutateAsync,
    refresh: tasksQuery.refetch,
  };
};

import { useMemo, useState } from 'react';

import { Button } from '../../../components/Button';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { SectionHeader } from '../../../components/SectionHeader';
import { StateView } from '../../../components/StateView';
import { Surface } from '../../../components/Surface';
import type { Task } from '../../../types/database';
import { toDateKey } from '../../../utils/date';
import { TaskFilterTabs } from '../components/TaskFilterTabs';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';
import type { TaskFilter, TaskFormValues } from '../types/taskTypes';
import { countTasksByFilter, filterTasks, isTaskCompleted } from '../utils/taskFilters';
import { taskFilterOptions } from '../utils/taskLabels';

type TasksViewProps = {
  userId: string;
  spaceId: string;
};

const getEmptyDescription = (filter: TaskFilter): string => {
  const option = taskFilterOptions.find((item) => item.id === filter);

  if (filter === 'today') {
    return 'Tarefas sem data continuam fora de Hoje. Crie uma com data de hoje para aparecer aqui.';
  }

  if (filter === 'undated') {
    return 'Tarefas sem data ficam aqui ate voce definir um prazo.';
  }

  return option?.description ?? 'Crie uma tarefa para iniciar.';
};

export const TasksView = ({ spaceId, userId }: TasksViewProps) => {
  const {
    actionError,
    addTask,
    error,
    isLoading,
    isMutating,
    isRefreshing,
    refresh,
    removeTask,
    tasks,
    toggleTask,
    updateTask,
  } = useTasks(userId, spaceId);
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('today');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const todayKey = toDateKey();
  const counts = useMemo(() => countTasksByFilter(tasks, todayKey), [tasks, todayKey]);
  const visibleTasks = useMemo(
    () => filterTasks(tasks, activeFilter, todayKey),
    [activeFilter, tasks, todayKey],
  );
  const openTasks = useMemo(() => tasks.filter((task) => !isTaskCompleted(task)).length, [tasks]);

  const handleSubmit = async (values: TaskFormValues) => {
    if (editingTask) {
      await updateTask({ taskId: editingTask.id, values });
      setEditingTask(null);
      return;
    }

    await addTask(values);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) {
      return;
    }

    await removeTask(taskToDelete);
    setTaskToDelete(null);

    if (editingTask?.id === taskToDelete.id) {
      setEditingTask(null);
    }
  };

  return (
    <div className="grid gap-4">
      <SectionHeader
        title="Tarefas"
        description={`${openTasks} abertas de ${tasks.length} tarefas no espaco atual.`}
      />

      <Surface>
        <div className="mb-4">
          <h2 className="text-base font-bold text-text-primary">
            {editingTask ? 'Editar tarefa' : 'Nova tarefa'}
          </h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Tarefas sem data permanecem sem prazo e nao entram no filtro Hoje.
          </p>
        </div>
        <TaskForm
          initialTask={editingTask}
          isBusy={isMutating}
          onCancelEdit={() => setEditingTask(null)}
          onSubmit={handleSubmit}
        />
        {actionError ? <p className="mt-3 text-sm text-danger">{actionError}</p> : null}
      </Surface>

      <TaskFilterTabs activeFilter={activeFilter} counts={counts} onFilterChange={setActiveFilter} />

      {isLoading ? (
        <StateView tone="loading" title="Carregando tarefas" description="Buscando dados no Supabase." />
      ) : null}

      {error ? (
        <StateView
          action={
            <Button isLoading={isRefreshing} variant="secondary" onClick={() => void refresh()}>
              Tentar novamente
            </Button>
          }
          tone="error"
          title="Erro ao carregar tarefas"
          description={error}
        />
      ) : null}

      {!isLoading && !error && visibleTasks.length === 0 ? (
        <StateView
          title="Nada por aqui"
          description={getEmptyDescription(activeFilter)}
          action={
            activeFilter !== 'all' ? (
              <Button variant="secondary" onClick={() => setActiveFilter('all')}>
                Ver todas
              </Button>
            ) : null
          }
        />
      ) : null}

      {!isLoading && !error && visibleTasks.length > 0 ? (
        <TaskList
          isBusy={isMutating}
          tasks={visibleTasks}
          onDelete={setTaskToDelete}
          onEdit={setEditingTask}
          onToggle={(task) => void toggleTask(task)}
        />
      ) : null}

      <ConfirmDialog
        confirmLabel="Excluir"
        description="Esta tarefa sera removida do Supabase. Essa acao nao pode ser desfeita."
        onCancel={() => setTaskToDelete(null)}
        onConfirm={() => void confirmDelete()}
        open={Boolean(taskToDelete)}
        title="Excluir tarefa?"
      />
    </div>
  );
};

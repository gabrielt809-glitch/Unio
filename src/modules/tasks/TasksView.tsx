import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { Calendar, Check, Plus, Trash2 } from 'lucide-react';

import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { FieldShell, SelectInput, TextArea, TextInput } from '../../components/Field';
import { IconButton } from '../../components/IconButton';
import { SectionHeader } from '../../components/SectionHeader';
import { StateView } from '../../components/StateView';
import { Surface } from '../../components/Surface';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import type { Task } from '../../types/database';
import { cn } from '../../utils/cn';
import { toDateKey } from '../../utils/date';
import { useTasks } from './useTasks';
import type { TaskDraft } from './tasksTypes';

type TasksViewProps = {
  userId: string;
  spaceId: string;
};

const emptyDraft: TaskDraft = {
  title: '',
  notes: '',
  due_date: '',
  priority: 'medium',
};

const priorityLabel: Record<Task['priority'], string> = {
  low: 'Baixa',
  medium: 'Media',
  high: 'Alta',
};

export const TasksView = ({ spaceId, userId }: TasksViewProps) => {
  const { addTask, error, isLoading, removeTask, tasks, toggleTask } = useTasks(userId, spaceId);
  const [draft, setDraft] = useState<TaskDraft>(emptyDraft);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const action = useAsyncAction();
  const openTasks = useMemo(() => tasks.filter((task) => !task.completed_at), [tasks]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.title.trim()) {
      return;
    }

    void action.run(async () => {
      await addTask(draft);
      setDraft(emptyDraft);
    });
  };

  const confirmDelete = () => {
    if (!taskToDelete) {
      return;
    }

    void action.run(async () => {
      await removeTask(taskToDelete);
      setTaskToDelete(null);
    });
  };

  return (
    <div className="grid gap-4">
      <SectionHeader
        title="Tarefas"
        description={`${openTasks.length} abertas de ${tasks.length} tarefas no espaco atual.`}
      />

      <Surface>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <FieldShell label="Nova tarefa">
            <TextInput
              maxLength={120}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              placeholder="Ex.: revisar planejamento da semana"
              required
              value={draft.title}
            />
          </FieldShell>
          <FieldShell label="Notas">
            <TextArea
              maxLength={280}
              onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Contexto rapido, sem poluir a lista"
              value={draft.notes}
            />
          </FieldShell>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FieldShell label="Data">
              <TextInput
                min={toDateKey()}
                onChange={(event) => setDraft((current) => ({ ...current, due_date: event.target.value }))}
                type="date"
                value={draft.due_date}
              />
            </FieldShell>
            <FieldShell label="Prioridade">
              <SelectInput
                onChange={(event) =>
                  setDraft((current) => ({ ...current, priority: event.target.value as Task['priority'] }))
                }
                value={draft.priority}
              >
                <option value="low">Baixa</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </SelectInput>
            </FieldShell>
          </div>
          <Button
            icon={<Plus aria-hidden="true" className="h-4 w-4" />}
            isLoading={action.isRunning}
            type="submit"
          >
            Adicionar tarefa
          </Button>
          {action.error ? <p className="text-sm text-danger">{action.error}</p> : null}
        </form>
      </Surface>

      {isLoading ? (
        <StateView tone="loading" title="Carregando tarefas" description="Buscando dados no Supabase." />
      ) : null}
      {error ? <StateView tone="error" title="Erro ao carregar tarefas" description={error} /> : null}
      {!isLoading && !error && tasks.length === 0 ? (
        <StateView
          title="Nenhuma tarefa ainda"
          description="Crie a primeira tarefa para tirar algo da cabeca com seguranca."
        />
      ) : null}

      <div className="grid gap-3">
        {tasks.map((task) => {
          const isComplete = Boolean(task.completed_at);
          return (
            <Surface key={task.id} className={cn('p-3', isComplete && 'opacity-65')}>
              <div className="flex items-start gap-3">
                <button
                  aria-label={isComplete ? 'Reabrir tarefa' : 'Concluir tarefa'}
                  className={cn(
                    'mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-app border transition',
                    isComplete
                      ? 'border-success bg-success/10 text-success'
                      : 'border-white/10 bg-background text-text-secondary',
                  )}
                  type="button"
                  onClick={() => void action.run(() => toggleTask(task))}
                >
                  {isComplete ? <Check aria-hidden="true" className="h-4 w-4" /> : null}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={cn('text-sm font-bold text-text-primary', isComplete && 'line-through')}>
                    {task.title}
                  </p>
                  {task.notes ? (
                    <p className="mt-1 text-sm leading-6 text-text-secondary">{task.notes}</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-text-secondary">
                    <Badge tone={task.priority === 'high' ? 'warning' : 'neutral'}>
                      {priorityLabel[task.priority]}
                    </Badge>
                    {task.due_date ? (
                      <Badge className="gap-1">
                        <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
                        {task.due_date}
                      </Badge>
                    ) : null}
                  </div>
                </div>
                <IconButton
                  icon={<Trash2 aria-hidden="true" className="h-4 w-4" />}
                  label="Excluir tarefa"
                  variant="danger"
                  onClick={() => setTaskToDelete(task)}
                />
              </div>
            </Surface>
          );
        })}
      </div>

      <ConfirmDialog
        confirmLabel="Excluir"
        description="Esta tarefa sera removida do Supabase. Essa acao nao pode ser desfeita."
        onCancel={() => setTaskToDelete(null)}
        onConfirm={confirmDelete}
        open={Boolean(taskToDelete)}
        title="Excluir tarefa?"
      />
    </div>
  );
};

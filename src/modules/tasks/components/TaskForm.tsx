import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarPlus, Save } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '../../../components/Button';
import { FieldShell, SelectInput, TextArea, TextInput } from '../../../components/Field';
import type { Task } from '../../../types/database';
import { taskSchema } from '../schemas/taskSchemas';
import type { TaskFormValues } from '../types/taskTypes';

type TaskFormProps = {
  initialTask?: Task | null;
  isBusy: boolean;
  onCancelEdit?: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
};

const emptyValues: TaskFormValues = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
  category: '',
};

const getInitialValues = (task?: Task | null): TaskFormValues =>
  task
    ? {
        title: task.title,
        description: task.description ?? task.notes ?? '',
        dueDate: task.due_date ?? '',
        priority: task.priority,
        category: task.category ?? '',
      }
    : emptyValues;

export const TaskForm = ({ initialTask, isBusy, onCancelEdit, onSubmit }: TaskFormProps) => {
  const isEditing = Boolean(initialTask);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: getInitialValues(initialTask),
  });

  useEffect(() => {
    reset(getInitialValues(initialTask));
  }, [initialTask, reset]);

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);

    if (!isEditing) {
      reset(emptyValues);
    }
  });

  return (
    <form className="grid gap-3" onSubmit={submit}>
      <FieldShell label={isEditing ? 'Editar titulo' : 'Titulo'} error={errors.title?.message}>
        <TextInput
          autoComplete="off"
          maxLength={120}
          placeholder="Ex.: revisar planejamento da semana"
          {...register('title')}
        />
      </FieldShell>

      <FieldShell label="Descricao" error={errors.description?.message}>
        <TextArea
          maxLength={500}
          placeholder="Contexto, criterio de pronto ou proximos passos"
          {...register('description')}
        />
      </FieldShell>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FieldShell label="Data" error={errors.dueDate?.message} hint="Opcional. Sem data fica sem prazo.">
          <TextInput type="date" {...register('dueDate')} />
        </FieldShell>

        <FieldShell label="Prioridade" error={errors.priority?.message}>
          <SelectInput {...register('priority')}>
            <option value="low">Baixa</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </SelectInput>
        </FieldShell>

        <FieldShell label="Categoria" error={errors.category?.message}>
          <TextInput autoComplete="off" maxLength={40} placeholder="Opcional" {...register('category')} />
        </FieldShell>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <Button
          icon={
            isEditing ? (
              <Save aria-hidden="true" className="h-4 w-4" />
            ) : (
              <CalendarPlus aria-hidden="true" className="h-4 w-4" />
            )
          }
          isLoading={isSubmitting || isBusy}
          size="lg"
          type="submit"
        >
          {isEditing ? 'Salvar tarefa' : 'Adicionar tarefa'}
        </Button>
        {isEditing ? (
          <Button variant="secondary" onClick={onCancelEdit}>
            Cancelar edicao
          </Button>
        ) : null}
      </div>
    </form>
  );
};

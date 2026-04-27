import { Calendar, Check, Pencil, RotateCcw, Tag, Trash2 } from 'lucide-react';

import { Badge } from '../../../components/Badge';
import { IconButton } from '../../../components/IconButton';
import { Surface } from '../../../components/Surface';
import type { Task } from '../../../types/database';
import { cn } from '../../../utils/cn';
import { formatTaskDueDate } from '../utils/taskDates';
import { isTaskCompleted } from '../utils/taskFilters';
import { taskPriorityLabels, taskStatusLabels } from '../utils/taskLabels';

type TaskCardProps = {
  isBusy: boolean;
  task: Task;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onToggle: (task: Task) => void;
};

const priorityTone = {
  low: 'neutral',
  medium: 'accent',
  high: 'warning',
} as const;

export const TaskCard = ({ isBusy, onDelete, onEdit, onToggle, task }: TaskCardProps) => {
  const isComplete = isTaskCompleted(task);

  return (
    <Surface className={cn('p-3', isComplete && 'opacity-70')} variant="interactive">
      <div className="flex min-w-0 items-start gap-3">
        <button
          aria-label={isComplete ? 'Reabrir tarefa' : 'Concluir tarefa'}
          className={cn(
            'mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-app border transition disabled:cursor-not-allowed disabled:opacity-50',
            isComplete
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-white/10 bg-background text-text-secondary hover:border-success/30 hover:text-success',
          )}
          disabled={isBusy}
          type="button"
          onClick={() => onToggle(task)}
        >
          {isComplete ? (
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Check aria-hidden="true" className="h-4 w-4" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={isComplete ? 'success' : 'primary'}>{taskStatusLabels[task.status]}</Badge>
            <Badge tone={priorityTone[task.priority]}>{taskPriorityLabels[task.priority]}</Badge>
          </div>
          <h3
            className={cn(
              'mt-2 min-w-0 break-words text-sm font-bold text-text-primary',
              isComplete && 'line-through',
            )}
          >
            {task.title}
          </h3>
          {task.description || task.notes ? (
            <p className="mt-1 min-w-0 break-words text-sm leading-6 text-text-secondary">
              {task.description ?? task.notes}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-text-secondary">
            <Badge className="gap-1">
              <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
              {formatTaskDueDate(task.due_date)}
            </Badge>
            {task.category ? (
              <Badge className="gap-1" tone="accent">
                <Tag aria-hidden="true" className="h-3.5 w-3.5" />
                {task.category}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="grid shrink-0 gap-2">
          <IconButton
            disabled={isBusy}
            icon={<Pencil aria-hidden="true" className="h-4 w-4" />}
            label="Editar tarefa"
            variant="ghost"
            onClick={() => onEdit(task)}
          />
          <IconButton
            disabled={isBusy}
            icon={<Trash2 aria-hidden="true" className="h-4 w-4" />}
            label="Excluir tarefa"
            variant="danger"
            onClick={() => onDelete(task)}
          />
        </div>
      </div>
    </Surface>
  );
};

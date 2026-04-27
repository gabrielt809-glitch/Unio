import type { Task } from '../../../types/database';
import { TaskCard } from './TaskCard';

type TaskListProps = {
  isBusy: boolean;
  tasks: Task[];
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onToggle: (task: Task) => void;
};

export const TaskList = ({ isBusy, onDelete, onEdit, onToggle, tasks }: TaskListProps) => (
  <div className="grid gap-3">
    {tasks.map((task) => (
      <TaskCard
        key={task.id}
        isBusy={isBusy}
        task={task}
        onDelete={onDelete}
        onEdit={onEdit}
        onToggle={onToggle}
      />
    ))}
  </div>
);

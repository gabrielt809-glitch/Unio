import { Chip } from '../../../components/Chip';
import type { TaskFilter } from '../types/taskTypes';
import { taskFilterOptions } from '../utils/taskLabels';

type TaskFilterTabsProps = {
  activeFilter: TaskFilter;
  counts: Record<TaskFilter, number>;
  onFilterChange: (filter: TaskFilter) => void;
};

export const TaskFilterTabs = ({ activeFilter, counts, onFilterChange }: TaskFilterTabsProps) => (
  <div className="-mx-1 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filtros de tarefas">
    <div className="flex min-w-max gap-2">
      {taskFilterOptions.map((option) => (
        <Chip
          key={option.id}
          role="tab"
          aria-label={`${option.label}, ${counts[option.id]} tarefas`}
          aria-selected={activeFilter === option.id}
          selected={activeFilter === option.id}
          title={option.description}
          onClick={() => onFilterChange(option.id)}
        >
          {option.label}
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px]">{counts[option.id]}</span>
        </Chip>
      ))}
    </div>
  </div>
);

import type { Task } from '../../../types/database';
import { toDateKey } from '../../../utils/date';
import type { TaskFilter, TaskPriority } from '../types/taskTypes';

const priorityWeight: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const isTaskCompleted = (task: Task): boolean =>
  task.status === 'completed' || Boolean(task.completed_at);

export const isTodayTask = (task: Task, todayKey: string = toDateKey()): boolean =>
  !isTaskCompleted(task) && task.due_date === todayKey;

export const isUpcomingTask = (task: Task, todayKey: string = toDateKey()): boolean =>
  !isTaskCompleted(task) && task.due_date !== null && task.due_date > todayKey;

export const isUndatedTask = (task: Task): boolean => !isTaskCompleted(task) && !task.due_date;

export const filterTasks = (tasks: Task[], filter: TaskFilter, todayKey: string = toDateKey()): Task[] => {
  const filtered = tasks.filter((task) => {
    if (filter === 'today') {
      return isTodayTask(task, todayKey);
    }

    if (filter === 'upcoming') {
      return isUpcomingTask(task, todayKey);
    }

    if (filter === 'undated') {
      return isUndatedTask(task);
    }

    if (filter === 'completed') {
      return isTaskCompleted(task);
    }

    return true;
  });

  return sortTasks(filtered);
};

export const countTasksByFilter = (
  tasks: Task[],
  todayKey: string = toDateKey(),
): Record<TaskFilter, number> => ({
  today: filterTasks(tasks, 'today', todayKey).length,
  upcoming: filterTasks(tasks, 'upcoming', todayKey).length,
  undated: filterTasks(tasks, 'undated', todayKey).length,
  completed: filterTasks(tasks, 'completed', todayKey).length,
  all: tasks.length,
});

export const sortTasks = (tasks: Task[]): Task[] =>
  [...tasks].sort((first, second) => {
    const firstComplete = isTaskCompleted(first);
    const secondComplete = isTaskCompleted(second);

    if (firstComplete !== secondComplete) {
      return firstComplete ? 1 : -1;
    }

    const firstDate = first.due_date ?? '9999-12-31';
    const secondDate = second.due_date ?? '9999-12-31';

    if (firstDate !== secondDate) {
      return firstDate.localeCompare(secondDate);
    }

    if (first.priority !== second.priority) {
      return priorityWeight[first.priority] - priorityWeight[second.priority];
    }

    return second.created_at.localeCompare(first.created_at);
  });

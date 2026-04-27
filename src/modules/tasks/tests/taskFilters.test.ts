import { describe, expect, it } from 'vitest';

import { formatTaskDueDate } from '../utils/taskDates';
import {
  countTasksByFilter,
  filterTasks,
  isTodayTask,
  isUndatedTask,
  isUpcomingTask,
} from '../utils/taskFilters';
import { makeTask } from './taskTestFactory';

describe('task filters', () => {
  const today = '2026-04-27';
  const todayTask = makeTask({ id: 'today', due_date: today, title: 'Hoje' });
  const upcomingTask = makeTask({ id: 'upcoming', due_date: '2026-04-28', title: 'Futura' });
  const undatedTask = makeTask({ id: 'undated', due_date: null, title: 'Sem data' });
  const completedTask = makeTask({
    id: 'completed',
    completed_at: '2026-04-27T12:00:00.000Z',
    due_date: today,
    status: 'completed',
    title: 'Concluida',
  });
  const tasks = [undatedTask, completedTask, upcomingTask, todayTask];

  it('keeps undated tasks out of Hoje', () => {
    expect(isTodayTask(undatedTask, today)).toBe(false);
    expect(filterTasks(tasks, 'today', today)).toEqual([todayTask]);
  });

  it('filters upcoming, undated, completed and all tasks', () => {
    expect(isUpcomingTask(upcomingTask, today)).toBe(true);
    expect(isUndatedTask(undatedTask)).toBe(true);
    expect(filterTasks(tasks, 'upcoming', today)).toEqual([upcomingTask]);
    expect(filterTasks(tasks, 'undated', today)).toEqual([undatedTask]);
    expect(filterTasks(tasks, 'completed', today)).toEqual([completedTask]);
    expect(filterTasks(tasks, 'all', today)).toHaveLength(4);
  });

  it('counts every filter without moving undated tasks to today', () => {
    expect(countTasksByFilter(tasks, today)).toEqual({
      today: 1,
      upcoming: 1,
      undated: 1,
      completed: 1,
      all: 4,
    });
  });

  it('formats task dates by local day keys', () => {
    expect(formatTaskDueDate(null)).toBe('Sem data');
    expect(formatTaskDueDate('2026-04-27')).toContain('27');
  });
});

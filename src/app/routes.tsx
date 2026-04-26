import type { User } from '@supabase/supabase-js';

import type { AppRoute } from '../constants/navigation';
import { DashboardView } from '../modules/dashboard/DashboardView';
import { FinanceView } from '../modules/finance/FinanceView';
import { HabitsView } from '../modules/habits/HabitsView';
import { HealthView } from '../modules/health/HealthView';
import { SettingsView } from '../modules/settings/SettingsView';
import type { Space } from '../types/database';
import { TasksView } from '../modules/tasks/TasksView';

type RouteProps = {
  route: AppRoute;
  user: User;
  space: Space;
};

export const renderRoute = ({ route, space, user }: RouteProps) => {
  const sharedProps = { userId: user.id, spaceId: space.id };

  switch (route) {
    case 'today':
      return <DashboardView {...sharedProps} />;
    case 'tasks':
      return <TasksView {...sharedProps} />;
    case 'habits':
      return <HabitsView {...sharedProps} />;
    case 'finance':
      return <FinanceView {...sharedProps} />;
    case 'health':
      return <HealthView {...sharedProps} />;
    case 'settings':
      return <SettingsView space={space} user={user} />;
    default:
      return <DashboardView {...sharedProps} />;
  }
};

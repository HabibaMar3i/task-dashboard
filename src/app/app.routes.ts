import { Routes } from '@angular/router';
import { TasksPage } from './features/tasks/tasks.page';

/** Application routes, with the task dashboard as the default page. */
export const routes: Routes = [
  { path: '', component: TasksPage },
  {
    path: 'analytics',
    loadComponent: () => import('./features/analytics/analytics.page').then((m) => m.AnalyticsPage),
  },
  {
    path: 'team',
    loadComponent: () => import('./features/team/team.page').then((m) => m.TeamPage),
  },
];

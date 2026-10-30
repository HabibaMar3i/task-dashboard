import { Routes } from '@angular/router';
import { TasksPage } from './features/tasks/tasks.page';

/** Application routes, with the task dashboard as the default page. */
export const routes: Routes = [{ path: '', component: TasksPage }];

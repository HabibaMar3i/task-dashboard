/** Available task workflow states. */
export type TaskStatus = 'todo' | 'in_progress' | 'done';

/** Available task priority levels. */
export type TaskPriority = 'high' | 'medium' | 'low';

/** User assigned to a task. */
export interface Assignee {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

/** Task record returned by the API. */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  isOverdue?: boolean;
  completedAt?: string;
  assignee: Assignee;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/** Filters used to select tasks for display. */
export interface TaskFilters {
  status: TaskStatus | null;
  priority: TaskPriority | null;
  assigneeId: string | null;
  search: string;
}

/** Task fields required when creating a task. */
export type NewTask = Omit<Task, 'id' | 'isOverdue' | 'completedAt' | 'createdAt' | 'updatedAt'>;

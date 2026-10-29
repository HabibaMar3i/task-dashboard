export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

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

export interface TaskFilters {
  status: TaskStatus | null;
  priority: TaskPriority | null;
  assigneeId: string | null;
  search: string;
}

export type NewTask = Omit<Task, 'id' | 'isOverdue' | 'completedAt' | 'createdAt' | 'updatedAt'>;

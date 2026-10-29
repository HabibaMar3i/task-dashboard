import { computed, inject, Injectable, signal } from '@angular/core';
import { Task, TaskFilters, TaskPriority, TaskStatus } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksStore {
  private readonly taskService = inject(TaskService);

  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _filters = signal<TaskFilters>({
    status: null,
    priority: null,
    assigneeId: null,
    search: '',
  });

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly filters = this._filters.asReadonly();

  readonly filteredTasks = computed(() => {
    const { status, priority, assigneeId, search } = this._filters();
    const term = search.trim().toLowerCase();

    return this._tasks().filter(
      (task) =>
        (!status || task.status === status) &&
        (!priority || task.priority === priority) &&
        (!assigneeId || task.assignee.id === assigneeId) &&
        (!term ||
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term)),
    );
  });

  loadTasks(): void {
    this._loading.set(true);
    this._error.set(null);

    this.taskService
      .getAllTasks()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (tasks) => this._tasks.set(tasks),
        error: (err: Error) => this._error.set(err.message),
      });
  }

  setStatus(status: TaskStatus | null): void {
    this._filters.update((current) => ({ ...current, status }));
  }

  setPriority(priority: TaskPriority | null): void {
    this._filters.update((current) => ({ ...current, priority }));
  }

  setAssignee(assigneeId: string | null): void {
    this._filters.update((current) => ({ ...current, assigneeId }));
  }

  setSearch(search: string): void {
    this._filters.update((current) => ({ ...current, search }));
  }

  clearFilters(): void {
    this._filters.set({ status: null, priority: null, assigneeId: null, search: '' });
  }
}

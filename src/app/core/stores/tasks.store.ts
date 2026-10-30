import { computed, inject, Injectable, signal } from '@angular/core';
import {
  Assignee,
  NewTask,
  Task,
  TaskFilters,
  TaskPriority,
  TaskStatus,
} from '../models/task.model';
import { TaskService } from '../services/task.service';
import { finalize, Observable, tap } from 'rxjs';
import { UserService } from '../services/user.service';

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

  readonly todoTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'todo'));
  readonly inProgressTasks = computed(() =>
    this.filteredTasks().filter((t) => t.status === 'in_progress'),
  );
  readonly doneTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'done'));

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

  addTask(task: NewTask): Observable<Task> {
    return this.taskService
      .createNewTask(task)
      .pipe(tap((created) => this._tasks.update((tasks) => [...tasks, created])));
  }

  updateTask(id: string, changes: Partial<Task>): Observable<Task> {
    return this.taskService
      .updateTask(id, changes)
      .pipe(
        tap((updated) =>
          this._tasks.update((tasks) => tasks.map((t) => (t.id === updated.id ? updated : t))),
        ),
      );
  }

  removeTask(id: string): Observable<void> {
    return this.taskService
      .removeTask(id)
      .pipe(tap(() => this._tasks.update((tasks) => tasks.filter((t) => t.id !== id))));
  }

  moveTask(id: string, status: TaskStatus): void {
    const previous = this._tasks();

    this._tasks.update((tasks) => tasks.map((t) => (t.id === id ? { ...t, status } : t)));

    this.taskService.updateTask(id, { status }).subscribe({
      error: (err: Error) => {
        this._tasks.set(previous);
        this._error.set(err.message);
      },
    });
  }

  // Users
  private readonly userService = inject(UserService);
  private readonly _users = signal<Assignee[]>([]);
  readonly users = this._users.asReadonly();

  loadUsers(): void {
    this.userService.getAllUsers().subscribe((users) => this._users.set(users));
  }
}

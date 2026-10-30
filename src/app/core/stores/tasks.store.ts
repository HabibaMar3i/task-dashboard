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

/** Holds task and user data and exposes reactive task filtering and mutations. */
@Injectable({ providedIn: 'root' })
export class TasksStore {
  private readonly taskService = inject(TaskService);
  private readonly userService = inject(UserService);

  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _users = signal<Assignee[]>([]);
  private readonly _filters = signal<TaskFilters>({
    status: null,
    priority: null,
    assigneeId: null,
    search: '',
  });

  /** Current task collection. */
  readonly tasks = this._tasks.asReadonly();

  /** Whether tasks are currently being loaded. */
  readonly loading = this._loading.asReadonly();

  /** Most recent task-loading or task-move error. */
  readonly error = this._error.asReadonly();

  /** Active task filters. */
  readonly filters = this._filters.asReadonly();

  /** Tasks matching all active filters. */
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

  /** Filtered tasks with the To Do status. */
  readonly todoTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'todo'));

  /** Filtered tasks with the In Progress status. */
  readonly inProgressTasks = computed(() =>
    this.filteredTasks().filter((t) => t.status === 'in_progress'),
  );

  /** Filtered tasks with the Done status. */
  readonly doneTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'done'));

  /** Users available for task assignment. */
  readonly users = this._users.asReadonly();

  /** Loads tasks from the task service and updates loading and error state. */
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

  /** Sets the status filter. */
  setStatus(status: TaskStatus | null): void {
    this._filters.update((current) => ({ ...current, status }));
  }

  /** Sets the priority filter. */
  setPriority(priority: TaskPriority | null): void {
    this._filters.update((current) => ({ ...current, priority }));
  }

  /** Sets the assignee filter. */
  setAssignee(assigneeId: string | null): void {
    this._filters.update((current) => ({ ...current, assigneeId }));
  }

  /** Sets the task title and description search term. */
  setSearch(search: string): void {
    this._filters.update((current) => ({ ...current, search }));
  }

  /** Clears all active task filters. */
  clearFilters(): void {
    this._filters.set({ status: null, priority: null, assigneeId: null, search: '' });
  }

  /** Creates a task and appends it to the local task collection. */
  addTask(task: NewTask): Observable<Task> {
    return this.taskService
      .createNewTask(task)
      .pipe(tap((created) => this._tasks.update((tasks) => [...tasks, created])));
  }

  /** Updates a task and replaces it in the local task collection. */
  updateTask(id: string, changes: Partial<Task>): Observable<Task> {
    return this.taskService
      .updateTask(id, changes)
      .pipe(
        tap((updated) =>
          this._tasks.update((tasks) => tasks.map((t) => (t.id === updated.id ? updated : t))),
        ),
      );
  }

  /** Removes a task from the service and local task collection. */
  removeTask(id: string): Observable<void> {
    return this.taskService
      .removeTask(id)
      .pipe(tap(() => this._tasks.update((tasks) => tasks.filter((t) => t.id !== id))));
  }

  /** Updates a task status optimistically and restores it if the request fails. */
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

  /** Loads users and updates the available assignee list. */
  loadUsers(): void {
    this.userService.getAllUsers().subscribe((users) => this._users.set(users));
  }
}

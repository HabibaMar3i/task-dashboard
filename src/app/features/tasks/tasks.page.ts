import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { TasksStore } from '../../core/stores/tasks.store';
import { TaskColumnComponent } from './task-column/task-column.component';
import { TaskStatus, TaskPriority, Task } from '../../core/models/task.model';
import {
  TaskFormValue,
  TaskFormDialogComponent,
} from './task-form-dialog/task-form-dialog.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { httpResource } from '@angular/common/http';
import { Statistic } from '../../core/models/statistic.model';
import { StatCardComponent } from './statistic-card/statistic-card.component';

/** Coordinates task filtering, editing, deletion, and drag-and-drop on the dashboard. */
@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TaskColumnComponent,
    TaskFormDialogComponent,
    ConfirmDialogModule,
    CdkDropListGroup,
    StatCardComponent,
  ],
  providers: [ConfirmationService],
})
export class TasksPage implements OnInit {
  /** Shared task data and filtering state. */
  store = inject(TasksStore);

  private confirmationService = inject(ConfirmationService);

  /** Statistics loaded for the dashboard cards. */
  statistics = httpResource<Statistic[]>(() => '/api/statistics');

  /** Whether the task form dialog is open. */
  showForm = signal(false);

  /** Task currently being edited, or null when creating a task. */
  editingTask = signal<Task | null>(null);

  /** Status filter choices displayed above the task columns. */
  statusTabs: { label: string; value: TaskStatus | null }[] = [
    { label: 'All', value: null },
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Done', value: 'done' },
  ];

  /** Emits a task selected for removal. */
  remove = output<Task>();

  /** Loads tasks and users when the page is initialized. */
  ngOnInit() {
    this.store.loadTasks();
    this.store.loadUsers();
  }

  /** Updates the task priority filter from the selected option. */
  onPriorityChange(value: string): void {
    this.store.setPriority((value || null) as TaskPriority | null);
  }

  /** Opens the form to create a new task. */
  openCreate() {
    this.editingTask.set(null);
    this.showForm.set(true);
  }

  /** Opens the form with the selected task for editing. */
  openEdit(task: Task) {
    this.editingTask.set(task);
    this.showForm.set(true);
  }

  /** Creates or updates a task using the submitted form values. */
  onSave(value: TaskFormValue) {
    const assignee = this.store.users().find((u) => u.id === value.assigneeId);
    if (!assignee) return;

    const fields = {
      title: value.title,
      description: value.description,
      priority: value.priority,
      status: value.status,
      dueDate: value.dueDate,
      tags: value.tags,
      assignee,
    };

    const editing = this.editingTask();
    const request = editing
      ? this.store.updateTask(editing.id, fields)
      : this.store.addTask(fields);

    request.subscribe({ error: (e: Error) => console.log(e.message) });
  }

  /** Requests confirmation before removing the selected task. */
  confirmDelete(task: Task) {
    this.confirmationService.confirm({
      header: 'Delete task',
      message: `Delete "${task.title}"?`,
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.store.removeTask(task.id).subscribe({
          error: (e: Error) => console.log(e.message),
        });
      },
    });
  }

  /** Persists the destination status after a task is moved to another column. */
  onMoved(event: { task: Task; status: TaskStatus }) {
    this.store.moveTask(event.task.id, event.status);
  }
}

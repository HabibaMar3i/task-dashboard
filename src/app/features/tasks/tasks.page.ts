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

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskColumnComponent, TaskFormDialogComponent, ConfirmDialogModule],
  providers: [ConfirmationService],
})
export class TasksPage implements OnInit {
  store = inject(TasksStore);
  private confirmationService = inject(ConfirmationService);

  ngOnInit() {
    this.store.loadTasks();
    this.store.loadUsers();
  }

  statusTabs: { label: string; value: TaskStatus | null }[] = [
    { label: 'All', value: null },
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Done', value: 'done' },
  ];

  onPriorityChange(value: string): void {
    this.store.setPriority((value || null) as TaskPriority | null);
  }

  showForm = signal(false);

  editingTask = signal<Task | null>(null);

  openCreate() {
    this.editingTask.set(null);
    this.showForm.set(true);
  }

  openEdit(task: Task) {
    this.editingTask.set(task);
    this.showForm.set(true);
  }

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

  remove = output<Task>();

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
}

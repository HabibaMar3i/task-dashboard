import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TasksStore } from '../../core/stores/tasks.store';
import { TaskColumnComponent } from './task-column/task-column.component';
import { TaskStatus, TaskPriority } from '../../core/models/task.model';
import {
  TaskFormValue,
  TaskFormDialogComponent,
} from './task-form-dialog/task-form-dialog.component';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskColumnComponent, TaskFormDialogComponent],
})
export class TasksPage implements OnInit {
  store = inject(TasksStore);

  ngOnInit() {
    this.store.loadTasks();
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

  onSave(value: TaskFormValue) {
    console.log(value);
  }
}

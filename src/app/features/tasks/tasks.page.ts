import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TasksStore } from '../../core/stores/tasks.store';
import { TaskColumnComponent } from './task-column/task-column.component';
import { TaskStatus, TaskPriority } from '../../core/models/task.model';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskColumnComponent],
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
}

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TasksStore } from '../../core/stores/tasks.store';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskColumnComponent } from './task-column/task-column.component';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskCardComponent, TaskColumnComponent],
})
export class TasksPage implements OnInit {
  store = inject(TasksStore);

  ngOnInit() {
    this.store.loadTasks();
  }
}

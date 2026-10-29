import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  task = input.required<Task>();

  isOverdue = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.task().status !== 'done' && this.task().dueDate < today;
  });
}

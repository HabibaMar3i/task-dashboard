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

  overdueMessage = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    const days = Math.max(
      1,
      Math.floor((Date.parse(today) - Date.parse(this.task().dueDate)) / 86_400_000),
    );
    return `Overdue by ${days} ${days === 1 ? 'day' : 'days'}`;
  });

  priorityClass = computed(() => {
    const classes = {
      high: 'bg-danger-subtle text-danger',
      medium: 'bg-[#FFF3E0] text-[#F57C00]',
      low: 'bg-[#FFF3E0] text-[#388E3C]',
    };
    return classes[this.task().priority];
  });
}

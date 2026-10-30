import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Task } from '../../../core/models/task.model';

/** Displays task details and emits the selected task action. */
@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  /** Task displayed by this card. */
  task = input.required<Task>();

  /** Emits when the task is selected for editing. */
  edit = output<Task>();

  /** Emits when the task is selected for deletion. */
  deleteTask = output<Task>();

  /** Whether this task is overdue and not yet complete. */
  isOverdue = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.task().status !== 'done' && this.task().dueDate < today;
  });

  /** Message describing how long the task is overdue. */
  overdueMessage = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    const days = Math.max(
      1,
      Math.floor((Date.parse(today) - Date.parse(this.task().dueDate)) / 86_400_000),
    );
    return `Overdue by ${days} ${days === 1 ? 'day' : 'days'}`;
  });

  /** CSS classes associated with the task's priority. */
  priorityClass = computed(() => {
    const classes = {
      high: 'bg-danger-subtle text-danger',
      medium: 'bg-[#FFF3E0] text-[#F57C00]',
      low: 'bg-[#FFF3E0] text-[#388E3C]',
    };
    return classes[this.task().priority];
  });
}

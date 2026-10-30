import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Task } from '../../../core/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-column',
  imports: [TaskCardComponent],
  templateUrl: './task-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskColumnComponent {
  heading = input.required<string>();
  tasks = input.required<Task[]>();
  edit = output<Task>();
  deleteTask = output<Task>();
}

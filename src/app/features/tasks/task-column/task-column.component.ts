import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';

/** Displays a task column and supports moving tasks between columns. */
@Component({
  selector: 'app-task-column',
  imports: [TaskCardComponent, CdkDropList, CdkDrag],
  templateUrl: './task-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskColumnComponent {
  /** Heading displayed above the column. */
  heading = input.required<string>();

  /** Tasks displayed in this column. */
  tasks = input.required<Task[]>();

  /** Status assigned to tasks dropped into this column. */
  status = input.required<TaskStatus>();

  /** Emits when a task is selected for editing. */
  edit = output<Task>();

  /** Emits when a task is selected for deletion. */
  deleteTask = output<Task>();

  /** Emits the task and destination status after a cross-column drop. */
  moved = output<{ task: Task; status: TaskStatus }>();

  /** Emits a move event when a task is dropped into a different column. */
  onDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) return;
    this.moved.emit({ task: event.item.data as Task, status: this.status() });
  }
}

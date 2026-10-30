import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-column',
  imports: [TaskCardComponent, CdkDropList, CdkDrag],
  templateUrl: './task-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskColumnComponent {
  heading = input.required<string>();
  tasks = input.required<Task[]>();
  edit = output<Task>();
  deleteTask = output<Task>();
  status = input.required<TaskStatus>();
  moved = output<{ task: Task; status: TaskStatus }>();

  onDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) return;
    this.moved.emit({ task: event.item.data as Task, status: this.status() });
  }
}

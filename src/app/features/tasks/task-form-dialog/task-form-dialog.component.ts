import { ChangeDetectionStrategy, Component, inject, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TaskPriority, TaskStatus } from '../../../core/models/task.model';

export interface TaskFormValue {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

@Component({
  selector: 'app-task-form-dialog',
  imports: [DialogModule, ReactiveFormsModule],
  templateUrl: './task-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormDialogComponent {
  private fb = inject(FormBuilder);

  visible = model(false);
  save = output<TaskFormValue>();

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    priority: ['medium' as TaskPriority],
    status: ['todo' as TaskStatus],
    dueDate: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue());
    this.visible.set(false);
    this.form.reset();
  }
}

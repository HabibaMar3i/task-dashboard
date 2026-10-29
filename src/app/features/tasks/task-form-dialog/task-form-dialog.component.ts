import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Assignee, TaskPriority, TaskStatus } from '../../../core/models/task.model';
import { notPastDate } from '../../../core/validators/not-past-date.validator';

export interface TaskFormValue {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assigneeId: string;
  tags: string[];
}

@Component({
  selector: 'app-task-form-dialog',
  imports: [DialogModule, ReactiveFormsModule],
  templateUrl: './task-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormDialogComponent {
  private fb = inject(FormBuilder);
  users = input.required<Assignee[]>();

  visible = model(false);
  save = output<TaskFormValue>();

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    priority: ['medium' as TaskPriority],
    status: ['todo' as TaskStatus],
    dueDate: ['', [Validators.required, notPastDate]],
    assigneeId: ['', Validators.required],
    tags: this.fb.nonNullable.array<string>([]),
  });

  get tags() {
    return this.form.controls.tags;
  }

  addTag() {
    this.tags.push(this.fb.nonNullable.control('', Validators.required));
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue());
    this.visible.set(false);
    this.tags.clear();
    this.form.reset();
  }
}

import { TestBed } from '@angular/core/testing';
import { TaskFormDialogComponent } from './task-form-dialog.component';

describe('TaskFormDialogComponent', () => {
  it('requires a title', async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormDialogComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TaskFormDialogComponent);
    fixture.componentRef.setInput('users', []);
    fixture.detectChanges();

    expect(fixture.componentInstance.form.controls.title.hasError('required')).toBe(true);
  });

  it('emits the form values when submitted', async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormDialogComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TaskFormDialogComponent);
    fixture.componentRef.setInput('users', []);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    let savedTitle = '';
    component.save.subscribe((value) => (savedTitle = value.title));
    component.form.patchValue({
      title: 'Prepare report',
      dueDate: '2099-01-01',
      assigneeId: 'user-1',
    });

    component.submit();

    expect(savedTitle).toBe('Prepare report');
  });
});

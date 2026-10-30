import { TestBed } from '@angular/core/testing';
import { TaskColumnComponent } from './task-column.component';

describe('TaskColumnComponent', () => {
  it('displays the column heading', async () => {
    await TestBed.configureTestingModule({
      imports: [TaskColumnComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TaskColumnComponent);
    fixture.componentRef.setInput('heading', 'To Do');
    fixture.componentRef.setInput('tasks', []);
    fixture.componentRef.setInput('status', 'todo');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('To Do');
  });
});

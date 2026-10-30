import { TestBed } from '@angular/core/testing';
import { Task } from '../../../core/models/task.model';
import { TaskCardComponent } from './task-card.component';

describe('TaskCardComponent', () => {
  it('displays the task title', async () => {
    const task: Task = {
      id: '1',
      title: 'Prepare report',
      description: 'Finish the weekly report',
      status: 'todo',
      priority: 'medium',
      dueDate: '2099-01-01',
      assignee: { id: '1', name: 'Alex', avatar: 'A', email: 'alex@example.com' },
      tags: [],
      createdAt: '',
      updatedAt: '',
    };

    await TestBed.configureTestingModule({
      imports: [TaskCardComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TaskCardComponent);
    fixture.componentRef.setInput('task', task);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Prepare report');
  });
});

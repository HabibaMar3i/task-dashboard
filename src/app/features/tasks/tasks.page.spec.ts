import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { TasksStore } from '../../core/stores/tasks.store';
import { TasksPage } from './tasks.page';

describe('TasksPage', () => {
  it('opens a blank form when creating a task', async () => {
    await TestBed.configureTestingModule({
      imports: [TasksPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: TasksStore,
          useValue: { loadTasks: vi.fn(), loadUsers: vi.fn(), users: () => [] },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TasksPage);
    const page = fixture.componentInstance;

    page.openCreate();

    expect(page.showForm()).toBe(true);
    expect(page.editingTask()).toBeNull();
  });
});

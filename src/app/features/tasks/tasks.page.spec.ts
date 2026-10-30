import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { TasksStore } from '../../core/stores/tasks.store';
import { TasksPage } from './tasks.page';

describe('TasksPage', () => {
  let fixture: ComponentFixture<TasksPage>;
  let httpMock: HttpTestingController;
  let storeMock: {
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    filters: ReturnType<
      typeof signal<{ status: null; priority: null; search: string; assigneeId: null }>
    >;
    users: ReturnType<typeof signal<never[]>>;
    todoTasks: ReturnType<typeof signal<never[]>>;
    inProgressTasks: ReturnType<typeof signal<never[]>>;
    doneTasks: ReturnType<typeof signal<never[]>>;
    loadTasks: ReturnType<typeof vi.fn>;
    loadUsers: ReturnType<typeof vi.fn>;
    setStatus: ReturnType<typeof vi.fn>;
    setPriority: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    storeMock = {
      loading: signal(false),
      error: signal(null),
      filters: signal({ status: null, priority: null, search: '', assigneeId: null }),
      users: signal([]),
      todoTasks: signal([]),
      inProgressTasks: signal([]),
      doneTasks: signal([]),
      loadTasks: vi.fn(),
      loadUsers: vi.fn(),
      setStatus: vi.fn(),
      setPriority: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TasksPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TasksStore, useValue: storeMock },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TasksPage);
    fixture.detectChanges();
    httpMock.expectOne('/api/statistics').flush([]);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('opens a blank form when creating a task', () => {
    const page = fixture.componentInstance;

    page.openCreate();

    expect(page.showForm()).toBe(true);
    expect(page.editingTask()).toBeNull();
  });

  it('loads tasks and users when the page starts', () => {
    expect(storeMock.loadTasks).toHaveBeenCalled();
    expect(storeMock.loadUsers).toHaveBeenCalled();
  });

  it('filters tasks by status when a status tab is clicked', () => {
    const element = fixture.nativeElement as HTMLElement;
    const doneTab = Array.from(element.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.trim() === 'Done',
    ) as HTMLButtonElement;

    doneTab.click();

    expect(storeMock.setStatus).toHaveBeenCalledWith('done');
  });

  it('filters tasks by priority when the priority is changed', () => {
    const element = fixture.nativeElement as HTMLElement;
    const prioritySelect = element.querySelector('select') as HTMLSelectElement;
    prioritySelect.value = 'high';
    prioritySelect.dispatchEvent(new Event('change'));

    expect(storeMock.setPriority).toHaveBeenCalledWith('high');
  });

  it('opens the new task form from the button', () => {
    const element = fixture.nativeElement as HTMLElement;
    const newTaskButton = Array.from(element.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.includes('New Task'),
    ) as HTMLButtonElement;

    newTaskButton.click();

    expect(fixture.componentInstance.showForm()).toBe(true);
  });
});

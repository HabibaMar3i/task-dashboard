import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { TasksStore } from './tasks.store';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { NewTask, Task } from '../models/task.model';

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Write docs',
  description: 'API documentation',
  status: 'todo',
  priority: 'low',
  dueDate: '2099-01-01',
  assignee: { id: 'u1', name: 'Sara', avatar: 'S', email: 'sara@test.com' },
  tags: [],
  createdAt: '',
  updatedAt: '',
  ...overrides,
});

const createFakeTaskService = () => ({
  getAllTasks: vi.fn(),
  createNewTask: vi.fn(),
  updateTask: vi.fn(),
  removeTask: vi.fn(),
});

describe('TasksStore', () => {
  let store: TasksStore;
  let taskService: ReturnType<typeof createFakeTaskService>;

  beforeEach(() => {
    taskService = createFakeTaskService();
    TestBed.configureTestingModule({
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: UserService, useValue: { getUsers: () => of([]) } },
      ],
    });
    store = TestBed.inject(TasksStore);
  });

  it('loads tasks and stops loading', () => {
    taskService.getAllTasks.mockReturnValue(of([makeTask()]));
    store.loadTasks();
    expect(store.tasks().length).toBe(1);
    expect(store.loading()).toBe(false);
  });

  it('keeps the error message when loading fails', () => {
    taskService.getAllTasks.mockReturnValue(throwError(() => new Error('boom')));
    store.loadTasks();
    expect(store.error()).toBe('boom');
    expect(store.loading()).toBe(false);
  });

  it('filters tasks by status', () => {
    taskService.getAllTasks.mockReturnValue(
      of([makeTask({ id: '1', status: 'todo' }), makeTask({ id: '2', status: 'done' })]),
    );
    store.loadTasks();
    store.setStatus('done');
    expect(store.filteredTasks().map((t) => t.id)).toEqual(['2']);
  });

  it('searches in the title', () => {
    taskService.getAllTasks.mockReturnValue(
      of([makeTask({ id: '1', title: 'Fix login' }), makeTask({ id: '2', title: 'Write docs' })]),
    );
    store.loadTasks();
    store.setSearch('login');
    expect(store.filteredTasks().map((t) => t.id)).toEqual(['1']);
  });

  it('combines priority and assignee filters', () => {
    taskService.getAllTasks.mockReturnValue(
      of([
        makeTask({ id: '1', priority: 'high' }),
        makeTask({
          id: '2',
          priority: 'high',
          assignee: { id: 'u2', name: 'Omar', avatar: 'O', email: 'omar@test.com' },
        }),
        makeTask({ id: '3', priority: 'low' }),
      ]),
    );
    store.loadTasks();

    store.setPriority('high');
    store.setAssignee('u1');

    expect(store.filteredTasks().map((t) => t.id)).toEqual(['1']);
  });

  it('clears all filters', () => {
    store.setStatus('done');
    store.setPriority('high');
    store.setAssignee('u1');
    store.setSearch('abc');

    store.clearFilters();

    expect(store.filters()).toEqual({
      status: null,
      priority: null,
      assigneeId: null,
      search: '',
    });
  });

  it('adds a created task to the list', () => {
    const created = makeTask({ id: '9' });
    taskService.createNewTask.mockReturnValue(of(created));

    store.addTask({} as NewTask).subscribe();

    expect(store.tasks()).toContain(created);
  });

  it('replaces a task when it is updated', () => {
    taskService.getAllTasks.mockReturnValue(of([makeTask({ id: '1', title: 'Old' })]));
    store.loadTasks();
    taskService.updateTask.mockReturnValue(of(makeTask({ id: '1', title: 'New' })));

    store.updateTask('1', { title: 'New' }).subscribe();

    expect(store.tasks().length).toBe(1);
    expect(store.tasks()[0].title).toBe('New');
  });

  it('removes a task from the list', () => {
    taskService.getAllTasks.mockReturnValue(of([makeTask({ id: '1' }), makeTask({ id: '2' })]));
    store.loadTasks();
    taskService.removeTask.mockReturnValue(of(undefined));

    store.removeTask('1').subscribe();

    expect(store.tasks().map((t) => t.id)).toEqual(['2']);
  });

  it('keeps the new status when moving a task succeeds', () => {
    taskService.getAllTasks.mockReturnValue(of([makeTask({ id: '1', status: 'todo' })]));
    store.loadTasks();
    taskService.updateTask.mockReturnValue(of(makeTask({ id: '1', status: 'done' })));

    store.moveTask('1', 'done');

    expect(store.tasks()[0].status).toBe('done');
    expect(store.error()).toBeNull();
  });

  it('moves a task right away and puts it back when the server fails', () => {
    taskService.getAllTasks.mockReturnValue(of([makeTask({ id: '1', status: 'todo' })]));
    store.loadTasks();
    taskService.updateTask.mockReturnValue(throwError(() => new Error('fail')));

    store.moveTask('1', 'done');

    expect(store.tasks()[0].status).toBe('todo');
    expect(store.error()).toBe('fail');
  });
});

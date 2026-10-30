import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { TaskService } from './task.service';
import { NewTask, Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('gets all tasks', () => {
    const fakeTasks = [{ id: '1', title: 'A' }] as Task[];
    let result: Task[] = [];

    service.getAllTasks().subscribe((tasks) => (result = tasks));

    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(fakeTasks);

    expect(result).toEqual(fakeTasks);
  });

  it('creates a task with POST and adds timestamps', () => {
    service.createNewTask({ title: 'New' } as NewTask).subscribe();

    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.title).toBe('New');
    expect(req.request.body.createdAt).toBeDefined();
    expect(req.request.body.updatedAt).toBeDefined();
    req.flush({});
  });

  it('updates a task with PATCH and adds updatedAt', () => {
    service.updateTask('5', { status: 'done' }).subscribe();

    const req = httpMock.expectOne('/api/tasks/5');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.status).toBe('done');
    expect(req.request.body.updatedAt).toBeDefined();
    req.flush({});
  });

  it('deletes a task with DELETE', () => {
    service.removeTask('7').subscribe();

    const req = httpMock.expectOne('/api/tasks/7');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('turns a server error into a friendly message', () => {
    let message = '';

    service.createNewTask({} as NewTask).subscribe({ error: (e: Error) => (message = e.message) });

    httpMock.expectOne('/api/tasks').flush('fail', { status: 500, statusText: 'Server Error' });

    expect(message).toBe('Server error. Please try again later.');
  });

  it('retries a failed GET twice before giving a friendly error', () => {
    vi.useFakeTimers();
    let message = '';

    service.getAllTasks().subscribe({ error: (e: Error) => (message = e.message) });

    for (let attempt = 0; attempt < 3; attempt++) {
      httpMock.expectOne('/api/tasks').flush('fail', { status: 500, statusText: 'Server Error' });
      vi.advanceTimersByTime(500);
    }

    expect(message).toBe('Server error. Please try again later.');
    vi.useRealTimers();
  });
});

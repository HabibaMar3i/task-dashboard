import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
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

  it('updates a task with PATCH and adds updatedAt', () => {
    service.updateTask('5', { status: 'done' }).subscribe();

    const req = httpMock.expectOne('/api/tasks/5');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.status).toBe('done');
    expect(req.request.body.updatedAt).toBeDefined();
    req.flush({});
  });

  it('turns a server error into a friendly message', () => {
    let message = '';

    service.createNewTask({} as NewTask).subscribe({ error: (e: Error) => (message = e.message) });

    httpMock.expectOne('/api/tasks').flush('fail', { status: 500, statusText: 'Server Error' });

    expect(message).toBe('Server error. Please try again later.');
  });
});

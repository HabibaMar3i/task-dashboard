import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { NewTask, Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseURL = '/api/tasks';

  getAllTasks(): Observable<Task[]> {
    return this.httpClient
      .get<Task[]>(this.baseURL)
      .pipe(retry({ count: 2, delay: 500 }), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message: string;

    if (error.status === 0) {
      message = 'Cannot reach the server. Check your connection.';
    } else if (error.status === 404) {
      message = 'The requested item was not found.';
    } else if (error.status >= 500) {
      message = 'Server error. Please try again later.';
    } else {
      message = 'Something went wrong. Please try again.';
    }

    return throwError(() => new Error(message));
  }

  createNewTask(task: NewTask): Observable<Task> {
    return this.httpClient.post<Task>(this.baseURL, {
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  updateTask(id: string, changes: Partial<Task>): Observable<Task> {
    return this.httpClient.patch<Task>(`${this.baseURL}/${id}`, {
      ...changes,
      updatedAt: new Date().toISOString(),
    });
  }

  removeTask(id: string): Observable<Task> {
    return this.httpClient.delete<Task>(`${this.baseURL}/${id}`);
  }
}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { NewTask, Task } from '../models/task.model';

/** Sends task requests to the task API and maps HTTP errors to friendly messages. */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseURL = '/api/tasks';

  /** Retrieves all tasks, retrying transient failures before reporting an error. */
  getAllTasks(): Observable<Task[]> {
    return this.httpClient
      .get<Task[]>(this.baseURL)
      .pipe(retry({ count: 2, delay: 500 }), catchError(this.handleError));
  }

  /** Converts an HTTP error into a user-friendly error message. */
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

  /** Creates a task and adds its creation and update timestamps. */
  createNewTask(task: NewTask): Observable<Task> {
    return this.httpClient
      .post<Task>(this.baseURL, {
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .pipe(catchError(this.handleError));
  }

  /** Updates a task and sets its updated timestamp. */
  updateTask(id: string, changes: Partial<Task>): Observable<Task> {
    return this.httpClient
      .patch<Task>(`${this.baseURL}/${id}`, {
        ...changes,
        updatedAt: new Date().toISOString(),
      })
      .pipe(catchError(this.handleError));
  }

  /** Deletes the task with the given ID. */
  removeTask(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseURL}/${id}`).pipe(catchError(this.handleError));
  }
}

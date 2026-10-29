import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewTask, Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseURL = '/api/tasks';

  getAllTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.baseURL);
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

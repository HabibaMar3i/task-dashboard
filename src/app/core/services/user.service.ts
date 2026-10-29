import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Assignee } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseURL = '/api/users';

  getAllUsers(): Observable<Assignee[]> {
    return this.httpClient.get<Assignee[]>(this.baseURL);
  }
}

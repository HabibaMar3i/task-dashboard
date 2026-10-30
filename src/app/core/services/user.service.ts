import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Assignee } from '../models/task.model';

/** Retrieves users that can be assigned to tasks. */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseURL = '/api/users';

  /** Fetches all available users from the user API. */
  getAllUsers(): Observable<Assignee[]> {
    return this.httpClient.get<Assignee[]>(this.baseURL);
  }
}

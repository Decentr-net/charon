import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Gender, UserCreateRequest } from './user-api';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  public createUser({}: UserCreateRequest): Observable<void> {
    return of(void 0);
  }
}

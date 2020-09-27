import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Gender, UserCreateRequest, UserData } from './user-api';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  public createUser({}: UserCreateRequest): Observable<void> {
    return of(void 0);
  }

  // TODO
  public getUserData(): Observable<UserData> {
    return of({
      birthdate: 0,
      gender: Gender.Male,
      emails: [],
      usernames: [],
    });
  }
}

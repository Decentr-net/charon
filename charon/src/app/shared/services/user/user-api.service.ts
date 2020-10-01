import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { Environment } from '@environments/environment.definitions';
import { Gender } from './user-api';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(
    private http: HttpClient,
    private environment: Environment,
  ) {
  }

  public createUser(email: string, walletAddress: string): Observable<void> {
    return this.http.post(`${this.environment.vulcanApi}/register`, {
      address: walletAddress,
      email,
    }).pipe(
      mapTo(void 0),
    );
  }

  public getUserPrivate({}: string): Observable<string> {
    return of(JSON.stringify({
      emails: [],
      usernames: [],
    }));
  }

  public getUserPublic({}: string): Observable<string> {
    return of(JSON.stringify({
      gender: Gender.Male,
      birthday: '',
    }));
  }

  public setUserPublic({}: string): Observable<void> {
    return EMPTY;
  }

  public setUserPrivate({}: string): Observable<void> {
    return EMPTY;
  }
}

import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserApiService } from './user-api.service';
import { UserPrivate } from './user-api';

@Injectable()
export class UserService {
  constructor(
    private userApiService: UserApiService,
  ) {
  }

  public createUser(email: string, walletAddress: string): Observable<void> {
    return this.userApiService.createUser(email, walletAddress);
  }

  public getUserPrivate(walletAddress: string): Observable<UserPrivate> {
    return this.userApiService.getUserPrivate(walletAddress).pipe(
      map((response) => JSON.parse(response)),
    );
  }

  public getUserPublic(walletAddress: string): Observable<string> {
    return this.userApiService.getUserPublic(walletAddress).pipe(
      map((response) => JSON.parse(response)),
    );
  }

  public setUserPublic(userPublic: string): Observable<void> {
    return EMPTY;
  }

  public setUserPrivate(userPrivate: string): Observable<void> {
    return EMPTY;
  }
}

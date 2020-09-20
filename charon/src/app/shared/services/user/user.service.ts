import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserCreate, User } from './user';
import { UserApiService } from './user-api.service';
import { CryptoService } from '../crypto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private userApiService: UserApiService,
  ) {
  }

  public createUser(user: UserCreate): Observable<User> {
    const { birthDate, gender, emails, usernames, password, seedPhrase } = user;

    return this.userApiService.createUser().pipe(
      map(() => ({
        birthDate,
        gender,
        emails,
        usernames,
        passwordHash: CryptoService.encryptPassword(password),
        privateKey: CryptoService.generatePrivateKey(seedPhrase),
      })),
    );
  }
}

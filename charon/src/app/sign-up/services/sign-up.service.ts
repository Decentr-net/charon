import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first, mergeMap, mergeMapTo } from 'rxjs/operators';

import { CryptoService } from '../../shared/services/crypto';
import { UserApiService, UserCreateRequest } from '../../shared/services/user-api';
import { WalletService } from '../../shared/services/wallet';
import { AuthService, User } from '../../auth';

export type UserSignUpForm = Omit<UserCreateRequest, 'publicKey'> & { password: string };

@Injectable()
export class SignUpService {
  private user: UserSignUpForm;
  private seedPhrase: string;

  constructor(
    private authService: AuthService,
    private userApiService: UserApiService,
  ) {
  }

  public getSeedPhrase(): string {
    return this.seedPhrase;
  }

  public setSeedPhrase(seedPhrase: string): void {
    this.seedPhrase = seedPhrase;
  }

  public setUserData(user: UserSignUpForm): void {
    this.user = user;
  }

  public signUp(): Observable<User> {
    const { birthDate, gender, emails, password, usernames } = this.user;
    const { privateKey, publicKey } = WalletService.getNewWallet(this.seedPhrase);

    return this.userApiService.createUser({
      birthDate,
      gender,
      emails,
      publicKey,
      usernames,
    }).pipe(
      mergeMap(() => this.authService.createUser({
        birthDate,
        gender,
        emails,
        emailConfirmed: false,
        passwordHash: CryptoService.encryptPassword(password),
        privateKey,
        usernames,
      })),
      mergeMap((id) => this.authService.changeUser(id)),
      mergeMapTo(this.authService.getActiveUser()),
      first(),
    );
  }
}

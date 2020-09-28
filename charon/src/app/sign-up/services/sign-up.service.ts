import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first, mergeMap, mergeMapTo } from 'rxjs/operators';

import { WalletService } from '../../shared/services/wallet';
import { UserService } from '../../shared/services/user';
import { AuthService, User } from '../../auth';

export interface UserSignUpForm extends Omit<User, 'id' | 'passwordHash' | 'privateKey' | 'publicKey' | 'emailConfirmed'> {
  password: string;
}

@Injectable()
export class SignUpService {
  private user: UserSignUpForm;
  private seedPhrase: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
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
    const { privateKey, publicKey, walletAddress } = WalletService.getNewWallet(this.seedPhrase);

    return this.userService.createUser(emails[0], walletAddress).pipe(
      mergeMap(() => this.authService.createUser({
        birthDate,
        gender,
        emails,
        password,
        privateKey,
        publicKey,
        usernames,
        walletAddress,
        emailConfirmed: false,
      })),
      mergeMap((id) => this.authService.changeUser(id)),
      mergeMapTo(this.authService.getActiveUser()),
      first(),
    );
  }
}

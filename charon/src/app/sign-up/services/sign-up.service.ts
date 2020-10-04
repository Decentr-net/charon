import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Wallet, WalletService } from '@shared/services/wallet';
import { UserService } from '@shared/services/user';
import { AuthService, User } from '../../auth';
import { switchMap } from 'rxjs/operators';

export interface UserSignUpForm extends Omit<User, 'id'
  | 'mainEmail'
  | 'passwordHash'
  | 'privateKey'
  | 'publicKey'
  | 'emailConfirmed'
  | 'walletAddress'
> {
  password: string;
}

@Injectable()
export class SignUpService {
  private userForm: UserSignUpForm;
  private seedPhrase: string;
  private wallet: Wallet;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private walletService: WalletService,
  ) {
  }

  public getSeedPhrase(): string {
    return this.seedPhrase;
  }

  public setSeedPhrase(seedPhrase: string): void {
    this.seedPhrase = seedPhrase;
    this.wallet = this.walletService.getNewWallet(this.seedPhrase);
  }

  public setUserData(user: UserSignUpForm): void {
    this.userForm = user;
  }

  public sendEmail(): Observable<void> {
    const user = this.authService.getActiveUserInstant();
    return this.userService.createUser(user.mainEmail, user.walletAddress);
  }

  public confirmEmail(code: string): Observable<void> {
    const user = this.authService.getActiveUserInstant();
    return this.userService.confirmUser(code, user.walletAddress).pipe(
      switchMap(() => this.authService.confirmCurrentUserEmail()),
    );
  }

  public signInWithNewUser(): Promise<User['id']> {
    const { birthdate, gender, emails, password, usernames } = this.userForm;
    const { privateKey, publicKey, walletAddress } = this.wallet;

    return this.authService.createUser({
      birthdate,
      gender,
      emails,
      password,
      privateKey,
      publicKey,
      usernames,
      walletAddress,
      emailConfirmed: false,
    }).then((id) => this.authService.changeUser(id).then(() => id));
  }

  public reset(): void {
    const user = this.authService.getActiveUserInstant();
    this.authService.removeUser(user.id);
  }
}

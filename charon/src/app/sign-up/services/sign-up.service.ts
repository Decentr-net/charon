import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { createWalletFromMnemonic } from 'decentr-js';

import { Wallet } from '@shared/models/wallet';
import { LocalStoreSection, LocalStoreService } from '@shared/services/local-store';
import { UserService } from '@shared/services/user';
import { AuthService, User } from '../../auth';

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

interface SignUpStore {
  lastEmailSendingTime: number;
}

@Injectable()
export class SignUpService {
  private userForm: UserSignUpForm;
  private seedPhrase: string;
  private wallet: Wallet;
  private readonly signUpStore: LocalStoreSection<SignUpStore>;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    localStore: LocalStoreService,
  ) {
    this.signUpStore = localStore.useSection('signUp');
  }

  public getSeedPhrase(): string {
    return this.seedPhrase;
  }

  public setSeedPhrase(seedPhrase: string): void {
    this.seedPhrase = seedPhrase;
    this.wallet = createWalletFromMnemonic(this.seedPhrase);
  }

  public setUserData(user: UserSignUpForm): void {
    this.userForm = user;
  }

  public sendEmail(): Observable<void> {
    const user = this.authService.getActiveUserInstant();
    return this.userService.createUser(user.mainEmail, user.walletAddress).pipe(
      switchMap(() => this.signUpStore.set('lastEmailSendingTime', Date.now())),
    );
  }

  public confirmEmail(code: string): Observable<void> {
    const user = this.authService.getActiveUserInstant();
    return this.userService.confirmUser(code, user.mainEmail).pipe(
      switchMap(() => this.authService.confirmCurrentUserEmail()),
    );
  }

  public signInWithNewUser(): Promise<User['id']> {
    const { birthdate, gender, emails, password, usernames } = this.userForm;
    const { privateKey, publicKey, address: walletAddress } = this.wallet;

    return this.authService.createUser({
      birthdate,
      gender,
      emails,
      password,
      privateKey: (privateKey as unknown as Uint8Array).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), ''),
      publicKey: (publicKey as unknown as Uint8Array).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), ''),
      usernames,
      walletAddress,
      emailConfirmed: false,
    }).then((id) => this.authService.changeUser(id).then(() => id));
  }

  public getLastEmailSendingTime(): Promise<number> {
    return this.signUpStore.get('lastEmailSendingTime');
  }

  public endSignUp(): Promise<void> {
    return this.signUpStore.clear();
  }

  public async resetSignUp(): Promise<void> {
    await this.endSignUp();

    const user = this.authService.getActiveUserInstant();
    return this.authService.removeUser(user.id);
  }

  public updateRemoteUser(): Observable<unknown> {
    const user = this.authService.getActiveUserInstant();

    return this.userService.waitAccount(user.walletAddress).pipe(
      mergeMap(() => forkJoin([
        this.userService.setUserPrivate(
          {
            emails: user.emails,
            usernames: user.usernames,
          },
          user.walletAddress,
          new Uint8Array(user.privateKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16))) as any as string,
        ),
        this.userService.setUserPublic(
          {
            gender: user.gender,
            birthdate: user.birthdate,
          },
          user.walletAddress,
          new Uint8Array(user.privateKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16))) as any as string,
        ),
      ])),
    );
  }
}

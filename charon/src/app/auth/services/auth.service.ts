import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { uuid } from '@shared/utils/uuid';
import { CryptoService } from '@shared/services/crypto';
import { AuthStorage, AuthUser } from '../models';

@UntilDestroy()
@Injectable()
export class AuthService {
  private activeUser$: BehaviorSubject<AuthUser | undefined> = new BehaviorSubject(undefined);

  constructor(private authStorage: AuthStorage<AuthUser>) {
  }

  public get isLoggedIn(): boolean {
    return !!this.getActiveUserInstant();
  }

  public async init(): Promise<void> {
    this.authStorage.getActiveUser().pipe(
      untilDestroyed(this),
    ).subscribe(this.activeUser$);
  }

  public confirmUserEmail(userId: AuthUser['id']): Promise<void> {
    return this.authStorage.updateUser(userId, { emailConfirmed: true });
  }

  public getActiveUser(): Observable<AuthUser | undefined> {
    return this.activeUser$.asObservable();
  }

  public getActiveUserInstant(): AuthUser | undefined {
    return this.activeUser$.value;
  }

  public async createUser(
    user: Omit<AuthUser, 'id' | 'mainEmail' | 'passwordHash'> & { password: string },
  ): Promise<AuthUser['id']> {
    const id = uuid();

    await this.authStorage.createUser({
      id,
      birthday: user.birthday,
      emailConfirmed: user.emailConfirmed,
      emails: user.emails,
      gender: user.gender,
      mainEmail: user.emails[0],
      passwordHash: CryptoService.encryptPassword(user.password),
      privateKey: user.privateKey,
      publicKey: user.publicKey,
      usernames: user.usernames,
      walletAddress: user.walletAddress,
    });

    return id;
  }

  public changeUser(userId: AuthUser['id']): Promise<void> {
    return this.authStorage.setActiveUserId(userId);
  }

  public async removeUser(userId: AuthUser['id']): Promise<void> {
    if (this.isLoggedIn && userId === this.getActiveUserInstant().id) {
      await this.logout();
    }
    await this.authStorage.removeUser(userId);
  }

  public logout(): Promise<void> {
    return this.authStorage.removeActiveUserId();
  }

  public validateCurrentUserPassword(password: string): boolean {
    return CryptoService.encryptPassword(password) === this.getActiveUserInstant().passwordHash;
  }

  public updateUser(
    userId: string,
    update: Partial<Pick<AuthUser, 'birthday' | 'gender' | 'emails' | 'usernames'> & { password: string }>
  ): Promise<void> {
    return this.authStorage.updateUser(
      userId,
      {
        birthday: update.birthday || update.birthday,
        gender: update.gender || update.gender,
        emails: update.emails || update.emails,
        usernames: update.usernames || update.usernames,
        ...update.password
          ? {
            passwordHash: CryptoService.encryptPassword(update.password),
          }
          : {},
      }
    )
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { sha256 } from 'js-sha256';

import { AuthBrowserStorageService } from '@root-shared/services/auth';
import { uuid } from '@shared/utils/uuid';
import { AuthUser, AuthUserUpdate } from '../models';

@UntilDestroy()
@Injectable()
export class AuthService {
  private activeUser$: BehaviorSubject<AuthUser | undefined> = new BehaviorSubject(undefined);

  private authStorage = new AuthBrowserStorageService<AuthUser>();

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

  public completeRegistration(userId: AuthUser['id']): Promise<void> {
    return this.authStorage.updateUser(userId, { registrationCompleted: true });
  }

  public getActiveUser(): Observable<AuthUser | undefined> {
    return this.activeUser$.asObservable();
  }

  public getActiveUserInstant(): AuthUser | undefined {
    return this.activeUser$.value;
  }

  public async createUser(
    user: Omit<AuthUser, 'id' | 'primaryUsername' | 'passwordHash'> & { password: string },
  ): Promise<AuthUser['id']> {
    const id = uuid();

    await this.authStorage.createUser({
      id,
      birthday: user.birthday,
      emailConfirmed: user.emailConfirmed,
      emails: user.emails,
      gender: user.gender,
      passwordHash: this.encryptPassword(user.password),
      primaryEmail: user.primaryEmail || user.emails?.[0],
      primaryUsername: user.usernames?.[0],
      registrationCompleted: user.registrationCompleted,
      usernames: user.usernames,
      wallet: user.wallet,
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
    return this.encryptPassword(password) === this.getActiveUserInstant().passwordHash;
  }

  public updateUser(userId: AuthUser['id'], update: AuthUserUpdate): Promise<void> {
    return this.authStorage.updateUser(
      userId,
      {
        birthday: update.birthday,
        gender: update.gender,
        emails: update.emails,
        usernames: update.usernames,
        primaryEmail: update.emails[0],
        primaryUsername: update.usernames[0],
        ...update.password
          ? {
            passwordHash: this.encryptPassword(update.password),
          }
          : {},
      }
    )
  }

  private encryptPassword(password: string): string {
    return sha256(password);
  }
}

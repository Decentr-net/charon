import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, skip } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { sha256 } from 'js-sha256';

import { AuthBrowserStorageService } from '@shared/services/auth';
import { uuid } from '@shared/utils/uuid';
import { AuthUser, AuthUserCreate, AuthUserUpdate } from '../models';

@UntilDestroy()
@Injectable()
export class AuthService {
  private activeUser$: BehaviorSubject<AuthUser | undefined> = new BehaviorSubject(undefined);

  private authStorage = new AuthBrowserStorageService<AuthUser>();

  public get isLoggedIn(): boolean {
    return !!this.getActiveUserInstant();
  }

  private static encryptPassword(password: string): string {
    return sha256(password);
  }

  public async init(): Promise<void> {
    this.authStorage.getActiveUser().pipe(
      untilDestroyed(this),
    ).subscribe(this.activeUser$);

    return this.activeUser$.pipe(
      skip(1),
      first(),
    ).toPromise().then();
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

  public async createUser(user: AuthUserCreate): Promise<AuthUser['id']> {
    const id = uuid();

    await this.authStorage.createUser({
      id,
      birthday: user.birthday,
      emailConfirmed: user.emailConfirmed,
      emails: user.emails,
      gender: user.gender,
      passwordHash: AuthService.encryptPassword(user.password),
      primaryEmail: user.primaryEmail,
      primaryUsername: user.usernames?.[0],
      registrationCompleted: user.registrationCompleted,
      usernames: user.usernames,
      wallet: user.wallet,
    });

    await this.updateUser(id, user);

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
    return AuthService.encryptPassword(password) === this.getActiveUserInstant().passwordHash;
  }

  public updateUser(userId: AuthUser['id'], update: AuthUserUpdate): Promise<void> {
    return this.authStorage.updateUser(
      userId,
      {
        birthday: update.birthday,
        gender: update.gender,
        emails: update.emails,
        usernames: update.usernames,
        primaryUsername: update.usernames?.[0],
        ...update.password
          ? {
            passwordHash: AuthService.encryptPassword(update.password),
          }
          : {},
      }
    );
  }
}

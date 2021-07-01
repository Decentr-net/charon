import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, skip } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthBrowserStorageService } from '@shared/services/auth';
import { sha256 } from '@shared/utils/crypto';
import { uuid } from '@shared/utils/uuid';
import { AuthUser, AuthUserCreate, AuthUserUpdate } from '../models';

@UntilDestroy()
@Injectable()
export class AuthService {
  constructor(
    private router: Router,
  ) {
  }

  private activeUser$: BehaviorSubject<AuthUser | undefined> = new BehaviorSubject(undefined);

  private authStorage = new AuthBrowserStorageService<AuthUser>();

  public get isLoggedIn(): boolean {
    return !!this.getActiveUserInstant();
  }

  private static encryptPassword(password: string): Promise<string> {
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

  public getActiveUser(): Observable<AuthUser | undefined> {
    return this.activeUser$.asObservable();
  }

  public getActiveUserInstant(): AuthUser | undefined {
    return this.activeUser$.value;
  }

  public async createUser(user: AuthUserCreate): Promise<AuthUser['id']> {
    const id = uuid();

    const passwordHash = await AuthService.encryptPassword(user.password);

    // TODO: temporary solution to disable birthday
    await this.authStorage.createUser({
      id,
      passwordHash,
      primaryEmail: user.primaryEmail,
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
    return this.authStorage.removeActiveUserId()
      .then(() => this.router.navigate(['/']))
      .then();
  }

  public async validateCurrentUserPassword(password: string): Promise<boolean> {
    const passwordHash = await AuthService.encryptPassword(password);

    return passwordHash === this.getActiveUserInstant().passwordHash;
  }

  public async updateUser(userId: AuthUser['id'], update: AuthUserUpdate): Promise<void> {
    // TODO: temporary solution to disable birthday
    const passwordHash = update.password
      ? await AuthService.encryptPassword(update.password)
      : undefined;

    return this.authStorage.updateUser(
      userId,
      {
        ...passwordHash ? { passwordHash} : {},
      });
  }
}

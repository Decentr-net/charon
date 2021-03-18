import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AuthService, AuthUserUpdate } from '@core/auth';
import { UserService } from '@core/services';

@Injectable()
export class EditProfilePageService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
  }

  public editProfile(update: AuthUserUpdate): Observable<void> {
    const user = this.authService.getActiveUserInstant();

    return forkJoin([
      this.shouldUpdatePublicProfile(update)
        ? this.updatePublicProfile(update)
        : of(void 0),
      this.shouldUpdatePrivateProfile(update)
        ? this.updatePrivateProfile(update)
        : of(void 0),
    ]).pipe(
      mergeMap(() => this.authService.updateUser(user.id, update)),
    );
  }

  private shouldUpdatePrivateProfile(update: AuthUserUpdate): boolean {
    const user = this.authService.getActiveUserInstant();

    return update.emails.join() !== user.emails.join()
      || update.usernames.join() !== user.usernames.join();
  }

  private shouldUpdatePublicProfile(update: AuthUserUpdate): boolean {
    const user = this.authService.getActiveUserInstant();

    return update.avatar !== user.avatar
      || update.birthday !== user.birthday
      || update.firstName !== user.firstName
      || update.gender !== user.gender
      || update.lastName !== user.lastName;
  }

  private updatePrivateProfile(update: AuthUserUpdate): Observable<void> {
    const user = this.authService.getActiveUserInstant();

    return this.userService.setPrivateProfile(
      {
        registrationCompleted: user.registrationCompleted,
        primaryEmail: user.primaryEmail,
        emails: update.emails,
        usernames: update.usernames,
      },
      user.wallet.address,
      user.wallet.privateKey,
    );
  }

  private updatePublicProfile(update: AuthUserUpdate): Observable<void> {
    const user = this.authService.getActiveUserInstant();

    // TODO: temporary solution to disable birthday
    return this.userService.setPublicProfile(
      {
        avatar: update.avatar,
        bio: update.bio,
        birthday: '1911-11-11',
        firstName: update.firstName,
        gender: update.gender,
        lastName: update.lastName,
      },
      user.wallet.address,
      user.wallet.privateKey,
    );
  }
}

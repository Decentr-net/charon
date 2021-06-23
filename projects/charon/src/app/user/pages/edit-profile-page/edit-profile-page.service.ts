import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ProfileUpdate } from 'decentr-js';

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

    const remoteUpdate = {
      ...update as Required<AuthUserUpdate>,
      emails: [user.primaryEmail, ...user.emails].filter(Boolean),
      password: undefined,
      primaryEmail: undefined,
    };

    return (this.shouldUpdateRemoteProfile(remoteUpdate)
      ? this.updateRemoteProfile(remoteUpdate)
      : of(void 0)
    ).pipe(
      mergeMap(() => this.authService.updateUser(user.id, update)),
    );
  }

  private shouldUpdateRemoteProfile(update: AuthUserUpdate): boolean {
    const user = this.authService.getActiveUserInstant();

    return update.emails.join() !== [user.primaryEmail, ...user.emails].filter(Boolean).join()
      || update.bio !== user.bio
      || update.avatar !== user.avatar
      || update.birthday !== user.birthday
      || update.firstName !== user.firstName
      || update.gender !== user.gender
      || update.lastName !== user.lastName;
  }

  private updateRemoteProfile(update: ProfileUpdate): Observable<void> {
    const user = this.authService.getActiveUserInstant();

    return this.userService.setProfile(
      update,
      user.wallet,
    );
  }
}

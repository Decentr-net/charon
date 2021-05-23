import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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

    return (this.shouldUpdateRemoteProfile(update)
      ? this.updateRemoteProfile(update)
      : of(void 0)
    ).pipe(
      mergeMap(() => this.authService.updateUser(user.id, update)),
    );
  }

  private shouldUpdateRemoteProfile(update: AuthUserUpdate): boolean {
    const user = this.authService.getActiveUserInstant();

    return update.emails.join() !== user.emails.join()
      || update.bio !== user.bio
      || update.avatar !== user.avatar
      || update.birthday !== user.birthday
      || update.firstName !== user.firstName
      || update.gender !== user.gender
      || update.lastName !== user.lastName;
  }

  private updateRemoteProfile(update: AuthUserUpdate): Observable<void> {
    const user = this.authService.getActiveUserInstant();

    return this.userService.setProfile(
      update as Required<AuthUserUpdate>,
      user.wallet,
    );
  }
}

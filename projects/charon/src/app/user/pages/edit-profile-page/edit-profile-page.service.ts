import { Injectable } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
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

  public createCurrentPasswordValidAsyncValidator(): AsyncValidatorFn {
    return async (control) => {
      if (!control.value) {
        return of(null);
      }

      const validPassword = await this.authService.validateCurrentUserPassword(control.value);

      return validPassword
        ? null
        : {
          invalid: true,
        };
    };
  }

  public editProfile(update: ProfileUpdate & AuthUserUpdate): Observable<void> {
    const user = this.authService.getActiveUserInstant();

    const remoteUpdate = {
      ...update,
      password: undefined,
    };

    return this.userService.getProfile(user.wallet.address, user.wallet).pipe(
      mergeMap((oldProfile) => {
        return this.areProfilesIdentical(oldProfile, remoteUpdate)
          ? of(void 0)
          : this.updateRemoteProfile(remoteUpdate);
      }),
      mergeMap(() => this.authService.updateUser(user.id, update)),
    );
  }

  private updateRemoteProfile(update: ProfileUpdate): Observable<void> {
    return this.userService.setProfile(update);
  }

  public areProfilesIdentical(profileA: ProfileUpdate, profileB: ProfileUpdate): boolean {
    return profileA.bio === profileB.bio
      && profileA.avatar === profileB.avatar
      && JSON.stringify(profileA.emails) === JSON.stringify(profileB.emails)
      && profileA.gender === profileB.gender
      && profileA.birthday === profileB.birthday
      && profileA.firstName === profileB.firstName
      && profileA.lastName === profileB.lastName;
  }
}

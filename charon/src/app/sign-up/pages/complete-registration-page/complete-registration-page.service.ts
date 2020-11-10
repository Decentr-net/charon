import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PublicProfile } from 'decentr-js';

import { AuthService } from '@core/auth';
import { UserService } from '@core/services';
import { UserPrivate } from '@root-shared/services/auth';

export type UserCompleteUpdate = Pick<UserPrivate, 'emails' | 'usernames'> & PublicProfile;

@Injectable()
export class CompleteRegistrationPageService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
  }

  public updateUser(update: UserCompleteUpdate): Observable<void> {
    const user = this.authService.getActiveUserInstant();

    return this.userService.setPublicProfile(
      {
        gender: update.gender,
        birthday: update.birthday,
      },
      user.wallet.address,
      user.wallet.privateKey,
    )
      .pipe(
        mergeMap(() => {
          return this.userService.setPrivateProfile(
            {
              primaryEmail: user.primaryEmail,
              emails: update.emails,
              usernames: update.usernames,
              registrationCompleted: true,
            },
            user.wallet.address,
            user.wallet.privateKey,
          )
        }),
        mergeMap(() => this.authService.updateUser(user.id, update)),
        mergeMap(() => this.authService.completeRegistration(user.id)),
      );
  }
}

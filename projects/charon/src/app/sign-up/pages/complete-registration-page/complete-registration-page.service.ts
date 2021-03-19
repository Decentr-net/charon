import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { PublicProfile } from 'decentr-js';

import { UserPrivate } from '@shared/services/auth';
import { AuthService } from '@core/auth';
import { UserService } from '@core/services';

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
          );
        }),
        mergeMap(() => this.authService.updateUser(user.id, update)),
        mergeMap(() => this.authService.completeRegistration(user.id)),
        delay(100),
      );
  }
}

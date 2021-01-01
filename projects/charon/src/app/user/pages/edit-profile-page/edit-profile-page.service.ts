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

    return (() => {
      if (update.avatar === user.avatar
        && update.birthday === user.birthday
        && update.firstName === user.firstName
        && update.gender === user.gender
        && update.lastName === user.lastName) {
        return of(void 0);
      }

      // TODO: temporary solution to disable birthday
      return this.userService.setPublicProfile(
        {
          avatar: update.avatar,
          birthday: '1911-11-11',
          firstName: update.firstName,
          gender: update.gender,
          lastName: update.lastName,
        },
        user.wallet.address,
        user.wallet.privateKey,
      );
    })().pipe(
      mergeMap(() => {
        if (update.emails.join() === user.emails.join()
          && update.usernames.join() === user.usernames.join()
        ) {
          return of(void 0);
        }

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
      }),
      mergeMap(() => this.authService.updateUser(user.id, update)),
    );
  }
}

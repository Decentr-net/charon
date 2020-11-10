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
      if (update.gender === user.gender && update.birthday === user.birthday) {
        return of(void 0);
      }

      return this.userService.setPublicProfile(
        {
          gender: update.gender,
          birthday: update.birthday,
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
        )
      }),
      mergeMap(() => this.authService.updateUser(user.id, update)),
    );
  }
}

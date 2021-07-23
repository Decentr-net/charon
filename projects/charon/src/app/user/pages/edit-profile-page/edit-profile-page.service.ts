import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  public editProfile(update: ProfileUpdate & AuthUserUpdate): Observable<void> {
    const user = this.authService.getActiveUserInstant();

    const remoteUpdate = {
      ...update,
      password: undefined,
    };

    return this.updateRemoteProfile(remoteUpdate).pipe(
      mergeMap(() => this.authService.updateUser(user.id, update)),
    );
  }

  private updateRemoteProfile(update: ProfileUpdate): Observable<void> {
    const user = this.authService.getActiveUserInstant();

    return this.userService.setProfile(
      update,
      user.wallet,
    );
  }
}

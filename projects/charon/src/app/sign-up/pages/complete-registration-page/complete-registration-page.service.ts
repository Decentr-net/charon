import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProfileUpdate } from 'decentr-js';

import { AuthService } from '@core/auth';
import { UserService } from '@core/services';

@Injectable()
export class CompleteRegistrationPageService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
  }

  public updateUser(update: ProfileUpdate): Observable<void> {
    const user = this.authService.getActiveUserInstant();

    return this.userService.setProfile(
      update,
      user.wallet,
    ).pipe(
      delay(100),
    );
  }
}

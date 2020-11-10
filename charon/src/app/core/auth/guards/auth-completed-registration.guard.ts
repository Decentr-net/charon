import { Inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services';
import { UNAUTHORIZED_REDIRECT_URL, UNCOMPLETED_REGISTRATION_REDIRECT_URL } from '../auth.tokens';

@Injectable()
export class AuthCompletedRegistrationGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(UNCOMPLETED_REGISTRATION_REDIRECT_URL) private uncompletedRegistrationRedirectUrl: string,
    @Inject(UNAUTHORIZED_REDIRECT_URL) private unauthorizedRedirectUrl: string,
  ) {
  }

  public canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn) {
      const user = this.authService.getActiveUserInstant();
      if (user.registrationCompleted) {
        return true;
      }

      return this.router.createUrlTree([this.uncompletedRegistrationRedirectUrl]);
    }

    return this.router.createUrlTree([this.unauthorizedRedirectUrl]);
  }

  public canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}

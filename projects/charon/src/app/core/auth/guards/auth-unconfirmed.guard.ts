import { Inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services';
import { CONFIRMED_EMAIL_REDIRECT_URL, UNAUTHORIZED_REDIRECT_URL } from '../auth.tokens';

@Injectable()
export class AuthUnconfirmedGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(CONFIRMED_EMAIL_REDIRECT_URL) private confirmedEmailRedirectUrl: string,
    @Inject(UNAUTHORIZED_REDIRECT_URL) private unauthorizedRedirectUrl: string,
  ) {
  }

  public canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn) {
      const user = this.authService.getActiveUserInstant();
      if (!user.emailConfirmed) {
        return true;
      }

      return this.router.createUrlTree([this.confirmedEmailRedirectUrl]);
    }

    return this.router.createUrlTree([this.unauthorizedRedirectUrl]);
  }

  public canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}

import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { Inject, Injectable } from '@angular/core';

import { AuthService } from '../services';
import { UNAUTHORIZED_REDIRECT_URL, UNCONFIRMED_EMAIL_REDIRECT_URL } from '../auth.tokens';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(UNAUTHORIZED_REDIRECT_URL) private unauthorizedRedirectUrl: string,
    @Inject(UNCONFIRMED_EMAIL_REDIRECT_URL) private unconfirmedEmailRedirectUrl: string,
  ) {
  }

  public canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn) {
      const user = this.authService.getActiveUserInstant();
      if (user.emailConfirmed) {
        return true;
      }

      return this.router.createUrlTree([this.unconfirmedEmailRedirectUrl]);
    }

    return this.router.createUrlTree([this.unauthorizedRedirectUrl]);
  }

  public canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}

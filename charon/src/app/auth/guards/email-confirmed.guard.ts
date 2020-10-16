import { Inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services';
import { UNCONFIRMED_EMAIL_REDIRECT_URL } from '../auth.tokens';

@Injectable()
export class EmailConfirmedGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(UNCONFIRMED_EMAIL_REDIRECT_URL) private unconfirmedEmailRedirectUrl: string,
  ) {
  }

  public canActivate(): boolean | UrlTree {
    if (!this.authService.isLoggedIn) {
      throw ('There is no authorized user in system, use EmailConfirmedGuard together with AuthGuard');
    }

    const user = this.authService.getActiveUserInstant();
    if (user.emailConfirmed) {
      return true;
    }

    return this.router.createUrlTree([this.unconfirmedEmailRedirectUrl]);
  }

  public canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}

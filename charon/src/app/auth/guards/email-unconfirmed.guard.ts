import { Inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services';
import { CONFIRMED_EMAIL_REDIRECT_URL } from '../auth.tokens';

@Injectable()
export class EmailUnconfirmedGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(CONFIRMED_EMAIL_REDIRECT_URL) private confirmedEmailRedirectUrl: string,
  ) {
  }

  public canActivate(): boolean | UrlTree {
    if (!this.authService.isLoggedIn) {
      throw ('There is no authorized user in system, use EmailConfirmedGuard together with AuthGuard');
    }

    const user = this.authService.getActiveUserInstant();
    if (!user.emailConfirmed) {
      return true;
    }

    return this.router.createUrlTree([this.confirmedEmailRedirectUrl]);
  }

  public canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}

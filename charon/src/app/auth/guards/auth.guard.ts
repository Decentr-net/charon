import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { Inject, Injectable } from '@angular/core';

import { UNAUTHORIZED_REDIRECT_URL } from '../auth.tokens';
import { AuthService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(UNAUTHORIZED_REDIRECT_URL) private unauthorizedRedirectUrl: string,
  ) {
  }

  public canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn) {
      return true;
    }

    return this.router.createUrlTree([this.unauthorizedRedirectUrl]);
  }

  public canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}

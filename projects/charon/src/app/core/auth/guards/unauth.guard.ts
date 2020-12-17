import { Inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services';
import { AUTHORIZED_REDIRECT_URL } from '../auth.tokens';

@Injectable()
export class UnauthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(AUTHORIZED_REDIRECT_URL) private authorizedRedirectUrl: string,
  ) {
  }

  public canActivate(): boolean | UrlTree {
    if (!this.authService.isLoggedIn) {
      return true;
    }

    return this.router.createUrlTree([this.authorizedRedirectUrl]);
  }

  public canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }

  public canLoad(): boolean | UrlTree {
    return this.canActivate();
  }
}

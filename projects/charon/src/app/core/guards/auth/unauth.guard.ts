import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, UrlTree } from '@angular/router';

import { AuthService } from '../../auth';

@Injectable()
export class UnauthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  public canActivate(): boolean | UrlTree {
    if (!this.authService.isLoggedIn) {
      return true;
    }

    return this.router.createUrlTree(['/']);
  }

  public canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }

  public canLoad(): boolean | UrlTree {
    return this.canActivate();
  }
}

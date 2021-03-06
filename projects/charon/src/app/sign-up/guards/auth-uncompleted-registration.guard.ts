import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, UrlTree } from '@angular/router';

import { AuthService } from '@core/auth';
import { AppRoute } from '../../app-route';

@Injectable()
export class AuthUncompletedRegistrationGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  public canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn) {
      const user = this.authService.getActiveUserInstant();
      if (!user.registrationCompleted) {
        return true;
      }

      return this.router.createUrlTree(['/']);
    }

    return this.router.createUrlTree(['/', AppRoute.Welcome]);
  }

  public canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }

  public canLoad(): boolean | UrlTree {
    return this.canActivate();
  }
}

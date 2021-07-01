import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

import { AuthService } from '@core/auth';
import { AppRoute } from '../../app-route';
import { SignUpRoute } from '../sign-up-route';

@Injectable()
export class AuthUnconfirmedGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  public canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn) {
      const user = this.authService.getActiveUserInstant();
      if (!user.emailConfirmed) {
        return true;
      }

      return this.router.createUrlTree(['/', AppRoute.SignUp, SignUpRoute.CompleteRegistration]);
    }

    return this.router.createUrlTree(['/', AppRoute.Welcome]);
  }

  public canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}

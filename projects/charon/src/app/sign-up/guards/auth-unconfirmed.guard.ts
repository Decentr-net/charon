import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

import { AuthService } from '@core/auth';
import { UserService } from '@core/services';
import { AppRoute } from '../../app-route';
import { SignUpRoute } from '../sign-up-route';

@Injectable()
export class AuthUnconfirmedGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {
  }

  public async canActivate(): Promise<boolean | UrlTree> {
    if (this.authService.isLoggedIn) {
      const wallet = this.authService.getActiveUserInstant().wallet;

      const account = await this.userService.getAccount(wallet.address).toPromise();

      if (!account) {
        return true;
      }

      return this.router.createUrlTree(['/', AppRoute.SignUp, SignUpRoute.CompleteRegistration]);
    }

    return this.router.createUrlTree(['/', AppRoute.Welcome]);
  }

  public canActivateChild(): Promise<boolean | UrlTree> {
    return this.canActivate();
  }
}

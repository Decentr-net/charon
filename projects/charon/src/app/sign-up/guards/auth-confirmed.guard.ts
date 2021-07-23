import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService } from '@core/auth';
import { AppRoute } from '../../app-route';
import { SignUpRoute } from '../sign-up-route';
import { UserService } from '../../core/services';

@Injectable()
export class AuthConfirmedGuard implements CanActivate, CanActivateChild {
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

      if (account) {
        return true;
      }

      return this.router.createUrlTree(['/', AppRoute.SignUp, SignUpRoute.EmailConfirmation]);
    }

    return this.router.createUrlTree(['/', AppRoute.Welcome]);
  }

  public canActivateChild(): Promise<boolean | UrlTree> {
    return this.canActivate();
  }
}

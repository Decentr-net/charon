import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, UrlTree } from '@angular/router';

import { AuthService } from '@core/auth';
import { UserService } from '@core/services';
import { AppRoute } from '../../../app-route';
import { SignUpRoute } from '../../../sign-up';

@Injectable()
export class AuthCompletedRegistrationGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {
  }

  public async canActivate(): Promise<boolean | UrlTree> {
    if (this.authService.isLoggedIn) {
      const wallet = this.authService.getActiveUserInstant().wallet;

      const profile = await this.userService.getProfile(wallet.address, wallet).toPromise();

      if (profile?.emails?.length) {
        return true;
      }

      return this.router.createUrlTree(['/', AppRoute.SignUp, SignUpRoute.CompleteRegistration]);
    }

    return this.router.createUrlTree(['/', AppRoute.Welcome]);
  }

  public canActivateChild(): Promise<boolean | UrlTree> {
    return this.canActivate();
  }

  public canLoad(): Promise<boolean | UrlTree> {
    return this.canActivate();
  }
}

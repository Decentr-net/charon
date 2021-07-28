import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, UrlTree } from '@angular/router';

import { AuthService } from '@core/auth';
import { UserService } from '@core/services';
import { AppRoute } from '../../../app-route';

@Injectable()
export class AuthCompletedRegistrationGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {
  }

  public static async isAuthFlowCompleted(authService: AuthService, userService: UserService): Promise<boolean> {
    if (!authService.isLoggedIn) {
      return false;
    }

    const wallet = authService.getActiveUserInstant().wallet;
    const profile = await userService.getProfile(wallet.address, wallet).toPromise();

    return !!profile?.emails?.length;
  }

  public async canActivate(): Promise<boolean | UrlTree> {
    if (this.authService.isLoggedIn) {
      const isAuthFlowCompleted
        = await AuthCompletedRegistrationGuard.isAuthFlowCompleted(this.authService, this.userService);

      return isAuthFlowCompleted || this.router.createUrlTree(['/', AppRoute.SignUp]);
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

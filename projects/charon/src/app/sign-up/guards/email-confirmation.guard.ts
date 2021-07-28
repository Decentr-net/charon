import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { getParentUrlFromSnapshots } from '@shared/utils/routing';
import { AuthService } from '@core/auth';
import { UserService } from '@core/services';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {
  }

  public static async canActivate(authService: AuthService, userService: UserService): Promise<boolean> {
    if (!authService.isLoggedIn) {
      return false;
    }

    const wallet = authService.getActiveUserInstant().wallet;
    const account = await userService.getAccount(wallet.address).toPromise();

    return !account;
  }

  public async canActivate(
    route: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    const canActivate = await EmailConfirmationGuard.canActivate(this.authService, this.userService);

    return canActivate || this.router.createUrlTree([getParentUrlFromSnapshots(route, routerState)]);
  }
}

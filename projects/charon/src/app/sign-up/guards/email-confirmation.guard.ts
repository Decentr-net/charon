import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { getParentUrlFromSnapshots } from '@shared/utils/routing';
import { AuthService } from '@core/auth';
import { SpinnerService, UserService } from '@core/services';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private userService: UserService,
    private router: Router,
  ) {
  }

  public static async canActivate(authService: AuthService, userService: UserService): Promise<boolean> {
    if (!authService.isLoggedIn) {
      return false;
    }

    const wallet = authService.getActiveUserInstant().wallet;
    const account = await firstValueFrom(userService.getAccount(wallet.address));

    return !account;
  }

  public async canActivate(
    route: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    this.spinnerService.showSpinner();

    const canActivate = await EmailConfirmationGuard.canActivate(this.authService, this.userService);

    this.spinnerService.hideSpinner();

    return canActivate || this.router.createUrlTree([getParentUrlFromSnapshots(route, routerState)]);
  }
}

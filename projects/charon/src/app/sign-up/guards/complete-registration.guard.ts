import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { getParentUrlFromSnapshots } from '@shared/utils/routing';
import { AuthService } from '@core/auth';
import { AuthCompletedRegistrationGuard } from '@core/guards';
import { SpinnerService, UserService } from '@core/services';
import { EmailConfirmationGuard } from './email-confirmation.guard';

@Injectable()
export class CompleteRegistrationGuard implements CanActivate {
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

    const emailUnconfirmed
      = await EmailConfirmationGuard.canActivate(authService, userService);

    if (emailUnconfirmed) {
      return false;
    }

    const isProfileFilledIn = await AuthCompletedRegistrationGuard.isProfileFilledIn(authService, userService);

    return !isProfileFilledIn;
  }

  public async canActivate(
    route: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    this.spinnerService.showSpinner();

    const canActivate = await CompleteRegistrationGuard.canActivate(this.authService, this.userService);

    this.spinnerService.hideSpinner();

    return canActivate || this.router.createUrlTree([getParentUrlFromSnapshots(route, routerState)]);
  }
}

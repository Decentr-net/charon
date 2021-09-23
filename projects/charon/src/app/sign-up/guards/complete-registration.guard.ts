import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { getParentUrlFromSnapshots } from '@shared/utils/routing';
import { SettingsService } from '@shared/services/settings';
import { AuthService } from '@core/auth';
import { AuthCompletedRegistrationGuard } from '@core/guards';
import { UserService } from '@core/services';

@Injectable()
export class CompleteRegistrationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private settingsService: SettingsService,
    private router: Router,
  ) {
  }

  public static async canActivate(
    authService: AuthService,
    userService: UserService,
    settingsService: SettingsService,
  ): Promise<boolean> {
    if (!authService.isLoggedIn) {
      return false;
    }

    const isPDVCollectionConfirmed = await AuthCompletedRegistrationGuard
      .isPDVCollectionConfirmed(authService, settingsService);

    if (!isPDVCollectionConfirmed) {
      return false;
    }

    return AuthCompletedRegistrationGuard.isProfileFilledIn(authService, userService)
      .then((isProfileFilledIn) => !isProfileFilledIn);
  }

  public async canActivate(
    route: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    const canActivate = await CompleteRegistrationGuard.canActivate(this.authService, this.userService, this.settingsService);

    return canActivate || this.router.createUrlTree([getParentUrlFromSnapshots(route, routerState)]);
  }
}

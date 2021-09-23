import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { SettingsService } from '@shared/services/settings';
import { getParentUrlFromSnapshots } from '@shared/utils/routing';
import { AuthService } from '@core/auth';
import { AuthCompletedRegistrationGuard } from '@core/guards';
import { UserService } from '@core/services';
import { EmailConfirmationGuard } from './email-confirmation.guard';

@Injectable()
export class PDVConsentGuard implements CanActivate {
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

    const emailUnconfirmed
      = await EmailConfirmationGuard.canActivate(authService, userService);

    if (emailUnconfirmed) {
      return false;
    }

    return AuthCompletedRegistrationGuard.isPDVCollectionConfirmed(authService, settingsService)
      .then((isPDVCollectionConfirmed) => !isPDVCollectionConfirmed);
  }

  public async canActivate(
    route: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    const canActivate = await PDVConsentGuard.canActivate(this.authService, this.userService, this.settingsService);

    return canActivate || this.router.createUrlTree([getParentUrlFromSnapshots(route, routerState)]);
  }
}

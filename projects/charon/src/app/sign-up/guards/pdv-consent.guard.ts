import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { SettingsService } from '@shared/services/settings';
import { getParentUrlFromSnapshots } from '@shared/utils/routing';
import { AuthService } from '@core/auth';
import { AuthCompletedRegistrationGuard } from '@core/guards';

@Injectable()
export class PDVConsentGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
    private router: Router,
  ) {
  }

  public static async canActivate(
    authService: AuthService,
    settingsService: SettingsService,
  ): Promise<boolean> {
    return AuthCompletedRegistrationGuard.isAuthFlowCompleted(authService, settingsService)
      .then((isFlowCompleted) => !isFlowCompleted);
  }

  public async canActivate(
    route: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    const canActivate = await PDVConsentGuard.canActivate(this.authService, this.settingsService);

    return canActivate || this.router.createUrlTree([getParentUrlFromSnapshots(route, routerState)]);
  }
}

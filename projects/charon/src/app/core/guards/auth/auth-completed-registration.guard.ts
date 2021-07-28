import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, UrlTree } from '@angular/router';
import { first } from 'rxjs/operators';

import { SettingsService } from '@shared/services/settings';
import { AuthService } from '@core/auth';
import { AppRoute } from '../../../app-route';

@Injectable()
export class AuthCompletedRegistrationGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
    private router: Router,
  ) {
  }

  public static async isAuthFlowCompleted(
    authService: AuthService,
    settingsService: SettingsService,
  ): Promise<boolean> {
    if (!authService.isLoggedIn) {
      return false;
    }

    const walletAddress = authService.getActiveUserInstant().wallet.address;

    return settingsService.getUserSettingsService(walletAddress)
      .pdv
      .getCollectionConfirmed()
      .pipe(
        first(),
      )
      .toPromise();
  }

  public async canActivate(): Promise<boolean | UrlTree> {
    if (this.authService.isLoggedIn) {
      const isAuthFlowCompleted
        = await AuthCompletedRegistrationGuard.isAuthFlowCompleted(this.authService, this.settingsService);

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

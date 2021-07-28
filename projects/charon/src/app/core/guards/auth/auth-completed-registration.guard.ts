import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, UrlTree } from '@angular/router';
import { first } from 'rxjs/operators';

import { SettingsService } from '@shared/services/settings';
import { AuthService } from '@core/auth';
import { UserService } from '@core/services';
import { AppRoute } from '../../../app-route';

@Injectable()
export class AuthCompletedRegistrationGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private settingsService: SettingsService,
    private router: Router,
  ) {
  }

  public static async isProfileFilledIn(
    authService: AuthService,
    userService: UserService,
  ): Promise<boolean> {
    const isUserCreated = authService.isLoggedIn;

    if (!isUserCreated) {
      return false;
    }

    const wallet = authService.getActiveUserInstant().wallet;
    const profile = await userService.getProfile(wallet.address, wallet).toPromise();

    return !!profile?.emails?.length;
  }

  public static async isPDVCollectionConfirmed(
    authService: AuthService,
    settingsService: SettingsService,
  ): Promise<boolean> {
    const isUserCreated = authService.isLoggedIn;

    if (!isUserCreated) {
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

  public static async isAuthFlowCompleted(
    authService: AuthService,
    userService: UserService,
    settingsService: SettingsService,
  ): Promise<boolean> {
    const isUserCreated = authService.isLoggedIn;

    if (!isUserCreated) {
      return false;
    }

    return Promise.all([
      AuthCompletedRegistrationGuard.isProfileFilledIn(authService, userService),
      AuthCompletedRegistrationGuard.isPDVCollectionConfirmed(authService, settingsService),
    ]).then((conditions) => conditions.every(Boolean));
  }

  public async canActivate(): Promise<boolean | UrlTree> {
    if (!this.authService.isLoggedIn) {
      return this.router.createUrlTree(['/', AppRoute.Welcome]);
    }

    const isAuthFlowCompleted = await AuthCompletedRegistrationGuard.isAuthFlowCompleted(
      this.authService,
      this.userService,
      this.settingsService,
    );

    return isAuthFlowCompleted || this.router.createUrlTree(['/', AppRoute.SignUp]);
  }

  public canActivateChild(): Promise<boolean | UrlTree> {
    return this.canActivate();
  }

  public canLoad(): Promise<boolean | UrlTree> {
    return this.canActivate();
  }
}

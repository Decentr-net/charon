import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, UrlTree } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { SettingsService } from '@shared/services/settings';
import { AuthService } from '@core/auth';
import { NetworkService, UserService } from '@core/services';
import { AppRoute } from '../../../app-route';
import { NetworkId } from '@shared/services/configuration';

@Injectable()
export class AuthCompletedRegistrationGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
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
    const profile = await firstValueFrom(userService.getProfile(wallet.address, wallet));

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

    return firstValueFrom(
      settingsService.getUserSettingsService(walletAddress)
        .pdv
        .getCollectionConfirmed(),
    );
  }

  public static async isAuthFlowCompleted(
    authService: AuthService,
    networkService: NetworkService,
    userService: UserService,
    settingsService: SettingsService,
  ): Promise<boolean> {
    const isUserCreated = authService.isLoggedIn;

    if (!isUserCreated) {
      return false;
    }

    const isTestnetNetwork = await firstValueFrom(networkService.getActiveNetworkId())
      .then((networkId) => networkId === NetworkId.Testnet);

    if (isTestnetNetwork) {
      await firstValueFrom(userService
        .createTestnetAccount(authService.getActiveUserInstant().wallet.address)
      );
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
      this.networkService,
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

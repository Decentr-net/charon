import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { SettingsService } from '@shared/services/settings';
import { AuthService } from '@core/auth';
import { SpinnerService, UserService } from '@core/services';
import { SignUpRoute } from '../sign-up-route';
import { EmailConfirmationGuard } from './email-confirmation.guard';
import { CompleteRegistrationGuard } from './complete-registration.guard';
import { PDVConsentGuard } from './pdv-consent.guard';

@Injectable()
export class SignUpGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
    private spinnerService: SpinnerService,
    private userService: UserService,
    private router: Router,
  ) {
  }

  public async canActivate({}: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Promise<boolean | UrlTree> {
    if (!this.authService.isLoggedIn) {
      return true;
    }

    this.spinnerService.showSpinner();

    const shouldRedirectToEmailConfirmation
      = await EmailConfirmationGuard.canActivate(this.authService, this.userService);

    if (shouldRedirectToEmailConfirmation) {
      return this.router.createUrlTree([routerState.url, SignUpRoute.EmailConfirmation]);
    }

    const shouldRedirectToCompleteRegistration
      = await CompleteRegistrationGuard.canActivate(this.authService, this.userService);

    if (shouldRedirectToCompleteRegistration) {
      return this.router.createUrlTree([routerState.url, SignUpRoute.CompleteRegistration]);
    }

    const shouldRedirectToPDVConsent
      = await PDVConsentGuard.canActivate(this.authService, this.userService, this.settingsService);

    if (shouldRedirectToPDVConsent) {
      return this.router.createUrlTree([routerState.url, SignUpRoute.PDVConsent]);
    }

    this.spinnerService.hideSpinner();

    return this.router.createUrlTree(['/']);
  }
}

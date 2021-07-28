import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthService } from '@core/auth';
import { UserService } from '@core/services';
import { SignUpRoute } from '../sign-up-route';
import { EmailConfirmationGuard } from './email-confirmation.guard';
import { CompleteRegistrationGuard } from './complete-registration.guard';

@Injectable()
export class SignUpGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {
  }

  public async canActivate({}: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Promise<boolean | UrlTree> {
    if (!this.authService.isLoggedIn) {
      return true;
    }

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

    return this.router.createUrlTree(['/']);
  }
}

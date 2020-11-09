import { Inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { AuthService } from '@auth/services';
import { COMPLETED_REGISTRATION_REDIRECT_URL, UNAUTHORIZED_REDIRECT_URL } from '@auth/auth.tokens';

@Injectable()
export class AuthUncompletedRegistrationGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(COMPLETED_REGISTRATION_REDIRECT_URL) private completedRegistrationRedirectUrl: string,
    @Inject(UNAUTHORIZED_REDIRECT_URL) private unauthorizedRedirectUrl: string,
  ) {
  }

  public canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn) {
      const user = this.authService.getActiveUserInstant();
      if (!user.registrationCompleted) {
        return true;
      }

      return this.router.createUrlTree([this.completedRegistrationRedirectUrl]);
    }

    return this.router.createUrlTree([this.unauthorizedRedirectUrl]);
  }

  public canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}

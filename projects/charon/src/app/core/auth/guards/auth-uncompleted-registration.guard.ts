import { Inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services';
import { COMPLETED_REGISTRATION_REDIRECT_URL, UNAUTHORIZED_REDIRECT_URL } from '../auth.tokens';

@Injectable()
export class AuthUncompletedRegistrationGuard implements CanActivate, CanActivateChild, CanLoad {

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

  public canLoad(): boolean | UrlTree {
    return this.canActivate();
  }
}

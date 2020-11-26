import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Inject, Injectable } from '@angular/core';

import { LockService } from '../services';
import { LOCK_REDIRECT_URL } from '../lock.tokens';

export const LOCK_RETURN_URL_PARAM_NAME = 'returnUrl';

@Injectable()
export class LockGuard implements CanActivate, CanActivateChild, CanDeactivate<void> {
  constructor(
    private lockService: LockService,
    private router: Router,
    @Inject(LOCK_REDIRECT_URL) private lockRedirectUrl: string,
  ) {
  }

  public canActivate(r, state: RouterStateSnapshot): boolean | UrlTree {
    if (!this.lockService.isLocked) {
      this.lockService.start();
      return true;
    }

    return this.router.createUrlTree([this.lockRedirectUrl], {
      queryParams: {
        [LOCK_RETURN_URL_PARAM_NAME]: state.url,
      },
    });
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.canActivate(route, state);
  }

  public canDeactivate(): boolean {
    this.lockService.stop();
    return true;
  }
}

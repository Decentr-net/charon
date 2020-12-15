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

@Injectable()
export class LockGuard implements CanActivate, CanActivateChild, CanDeactivate<void> {
  constructor(
    private lockService: LockService,
    private router: Router,
    @Inject(LOCK_REDIRECT_URL) private lockRedirectUrl: string,
  ) {
  }

  public canActivate({}, state: RouterStateSnapshot): boolean | UrlTree {
    if (!this.lockService.isLocked) {
      this.lockService.start();
      return true;
    }

    this.lockService.navigateToLockedUrl();
    return false;
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.canActivate(route, state);
  }

  public canDeactivate(): boolean {
    this.lockService.stop();
    return true;
  }
}

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
import { first } from 'rxjs/operators';

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

  public async canActivate({}, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const isLocked = await this.lockService.lockedState$
      .pipe(
        first(),
      ).toPromise();

    if (isLocked) {
      await this.lockService.navigateToLockedUrl();
      return false;
    }

    this.lockService.start();
    return true;
  }

  public async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    return this.canActivate(route, state);
  }

  public canDeactivate(): boolean {
    this.lockService.stop();
    return true;
  }
}

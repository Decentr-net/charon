import {
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  Router,
  UrlTree,
} from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

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

  public async canActivate(): Promise<boolean | UrlTree> {
    const isLocked = await this.lockService.lockedState$
      .pipe(
        take(1),
      ).toPromise();

    if (isLocked) {
      await this.lockService.navigateToLockedUrl();
      return false;
    }

    this.lockService.start();
    return true;
  }

  public async canActivateChild(): Promise<boolean | UrlTree> {
    return this.canActivate();
  }

  public canDeactivate(): boolean {
    this.lockService.stop();
    return true;
  }
}

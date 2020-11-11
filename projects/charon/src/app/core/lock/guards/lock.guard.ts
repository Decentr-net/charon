import { CanActivate, CanActivateChild, CanDeactivate, Router, UrlTree } from '@angular/router';
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

  public canActivate(): boolean | UrlTree {
    if (!this.lockService.isLocked) {
      this.lockService.start();
      return true;
    }

    return this.router.createUrlTree([this.lockRedirectUrl]);
  }

  public canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }

  public canDeactivate(): boolean {
    this.lockService.stop();
    return true;
  }
}

import { CanActivate, CanActivateChild, CanDeactivate, Router, UrlTree } from '@angular/router';
import { Inject, Injectable } from '@angular/core';

import { LockService } from '../services';
import { LOCKED_REDIRECT_URL } from '../auth.tokens';

@Injectable()
export class LockGuard implements CanActivate, CanActivateChild, CanDeactivate<void> {
  constructor(
    private lockService: LockService,
    private router: Router,
    @Inject(LOCKED_REDIRECT_URL) private lockedRedirectUrl: string,
  ) {
  }

  public canActivate(): boolean | UrlTree {
    if (!this.lockService.isLocked) {
      this.lockService.start();
      return true;
    }

    this.lockService.stop();
    return this.router.createUrlTree([this.lockedRedirectUrl]);
  }

  public canActivateChild(): boolean | UrlTree {
    return this.canActivate()
  }

  public canDeactivate(): boolean {
    this.lockService.stop();
    return true;
  }
}

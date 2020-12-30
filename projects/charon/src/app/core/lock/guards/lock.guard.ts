import {
  CanActivate,
  CanActivateChild,
  CanDeactivate,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { LockService } from '../services';

@Injectable()
export class LockGuard implements CanActivate, CanActivateChild, CanDeactivate<void> {
  constructor(
    private lockService: LockService,
  ) {
  }

  public async canActivate(): Promise<boolean> {
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

  public async canActivateChild(): Promise<boolean> {
    return this.canActivate();
  }

  public canDeactivate(): boolean {
    this.lockService.stop();
    return true;
  }
}

import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { take } from 'rxjs/operators';

import { LockService } from '@core/lock';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private lockService: LockService) {
  }

  public canActivate(): Promise<boolean> {
    return this.lockService.lockedState$
      .pipe(
        take(1),
      ).toPromise();
  }
}

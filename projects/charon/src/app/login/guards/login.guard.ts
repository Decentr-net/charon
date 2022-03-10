import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { LockService } from '@core/lock';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private lockService: LockService) {
  }

  public canActivate(): Promise<boolean> {
    return firstValueFrom(this.lockService.lockedState$);
  }
}

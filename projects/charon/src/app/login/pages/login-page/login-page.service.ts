import { Injectable } from '@angular/core';

import { AuthService } from '@core/auth';
import { LockService } from '@core/lock';

@Injectable()
export class LoginPageService {
  constructor(
    private authService: AuthService,
    private lockService: LockService,
  ) {
  }

  public tryUnlock(password: string): boolean {
    const isPasswordValid = this.authService.validateCurrentUserPassword(password);
    if (!isPasswordValid) {
      return false;
    }

    this.lockService.unlock();
    return true;
  }
}

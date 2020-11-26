import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@core/auth';
import { LockService } from '@core/lock';

@Injectable()
export class LoginPageService {
  constructor(
    private authService: AuthService,
    private lockService: LockService,
    private router: Router,
  ) {
  }

  public tryUnlock(password: string, returnUrl: string): boolean {
    const isPasswordValid = this.authService.validateCurrentUserPassword(password);
    if (!isPasswordValid) {
      return false;
    }

    this.lockService.unlock();
    this.router.navigate([returnUrl]);
  }
}

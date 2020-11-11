import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@core/auth';
import { LockService } from '@core/lock';
import { AppRoute } from '../../../app-route';

@Injectable()
export class LoginPageService {
  constructor(
    private authService: AuthService,
    private lockService: LockService,
    private router: Router,
  ) {
  }

  public tryUnlock(password: string): boolean {
    const isPasswordValid = this.authService.validateCurrentUserPassword(password);
    if (!isPasswordValid) {
      return false;
    }

    this.lockService.unlock();
    this.router.navigate(['/', AppRoute.User]);
  }
}

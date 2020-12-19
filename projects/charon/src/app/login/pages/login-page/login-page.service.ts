import { Injectable } from '@angular/core';

import { AuthService } from '@core/auth';
import { LockService } from '@core/lock';
import { take } from 'rxjs/operators';

@Injectable()
export class LoginPageService {
  constructor(
    private authService: AuthService,
    private lockService: LockService,
  ) {
  }

  public async tryUnlock(password: string): Promise<boolean> {
    const isPasswordValid = this.authService.validateCurrentUserPassword(password);
    if (!isPasswordValid) {
      return false;
    }

    await this.lockService.unlock();

    return true;
  }
}

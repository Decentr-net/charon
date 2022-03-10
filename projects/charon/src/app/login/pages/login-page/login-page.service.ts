import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { isOpenedInTab } from '@shared/utils/browser';
import { AuthService } from '@core/auth';
import { LockService } from '@core/lock';
import { NavigationService } from '@core/navigation';
import { AppRoute } from '../../../app-route';
import { LoginRoute } from '../../login-route';

@Injectable()
export class LoginPageService {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private lockService: LockService,
    private navigationService: NavigationService,
    private router: Router,
  ) {
  }

  public async tryUnlock(password: string): Promise<boolean> {
    const isPasswordValid = await this.authService.validateCurrentUserPassword(password);
    if (!isPasswordValid) {
      return false;
    }

    await this.lockService.unlock();

    return true;
  }

  public navigateToRestorePage(): void {
    if (!isOpenedInTab()) {
      this.navigationService.openInNewTab(`${AppRoute.Login}/${LoginRoute.Restore}`);
      return window.close();
    }

    this.router.navigate([LoginRoute.Restore], {
      relativeTo: this.activatedRoute,
    });
  }
}

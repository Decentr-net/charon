import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { NavigationService } from '../navigation';

@Injectable()
export class OfflineGuard implements CanActivate {
  constructor(
    private navigationService: NavigationService,
  ) {
  }

  public canActivate(): boolean {
    if (navigator.onLine) {
      this.navigationService.back(['/']);
      return false;
    }

    return true;
  }
}

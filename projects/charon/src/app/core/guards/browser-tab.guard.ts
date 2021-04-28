import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router';

import { isOpenedInTab } from '@shared/utils/browser';
import { NavigationService } from '@core/navigation';

@Injectable()
export class BrowserTabGuard implements CanActivate, CanActivateChild {
  constructor(private navigationService: NavigationService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (isOpenedInTab()) {
      return true;
    }

    this.navigationService.openInNewTab(state.url);
    window.close();

    return false;
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(childRoute, state);
  }
}

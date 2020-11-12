import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router';

import { NavigationService } from '@core/navigation';
import { isOpenedInTab } from '@core/browser';

@Injectable()
export class BrowserTabGuard implements CanActivate, CanActivateChild {
  constructor(private navigationService: NavigationService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (isOpenedInTab()) {
      return true;
    }

    this.navigationService.openInNewTab(state.url)
    return false;
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(childRoute, state);
  }
}

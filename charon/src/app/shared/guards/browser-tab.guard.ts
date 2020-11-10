import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router';

import { isOpenedInTab, openExtensionInNewTab } from '@shared/utils/browser';

@Injectable({
  providedIn: 'root',
})
export class BrowserTabGuard implements CanActivate, CanActivateChild {
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (isOpenedInTab()) {
      return true;
    }

    openExtensionInNewTab(state.url);
    return false;
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(childRoute, state);
  }
}

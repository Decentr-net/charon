import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';

import { BrowserApi } from '../utils/browser-api';

@Injectable({
  providedIn: 'root',
})
export class BrowserTabGuard implements CanActivate, CanActivateChild {
  private isOpenedInTab = BrowserApi.extension.getViews({ type: 'tab' })
    .some(extensionWindow => extensionWindow === window);

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isOpenedInTab) {
      return true;
    }

    BrowserApi.openExtensionInNewTab(state.url);
    return false;
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(childRoute, state);
  }
}

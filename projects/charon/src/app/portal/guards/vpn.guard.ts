import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, pluck } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ConfigService } from '@shared/services/configuration';
import { BrowserType, detectBrowser } from '@shared/utils/browser';
import { getParentUrlFromSnapshots } from '@shared/utils/routing';

const CURRENT_BROWSER_TYPE: BrowserType = detectBrowser();

@Injectable()
export class VpnGuard implements CanActivate {

  constructor(
    private configService: ConfigService,
    private router: Router,
  ) {
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    this.configService.forceUpdate();

    return this.configService.getVPNSettings().pipe(
      pluck('enabled'),
      map((isVpnEnabled) => isVpnEnabled && CURRENT_BROWSER_TYPE !== BrowserType.Decentr),
      catchError(() => of(false)),
      map(canActivate => canActivate || this.router.createUrlTree([getParentUrlFromSnapshots(route, routerState)])),
    );
  }
}

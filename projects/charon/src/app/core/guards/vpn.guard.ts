import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { catchError, map, pluck } from 'rxjs/operators';
import { of } from 'rxjs';

import { ConfigService } from '@shared/services/configuration';
import { AppRoute } from '../../app-route';
import { BrowserType, detectBrowser } from '@shared/utils/browser';

const CURRENT_BROWSER_TYPE: BrowserType = detectBrowser();

@Injectable()
export class VpnGuard implements CanActivate {

  constructor(
    private configService: ConfigService,
    private router: Router,
  ) {
  }

  canActivate() {
    this.configService.forceUpdate();

    return this.configService.getVPNSettings().pipe(
      pluck('enabled'),
      map((isVpnEnabled) => isVpnEnabled && CURRENT_BROWSER_TYPE !== BrowserType.Decentr),
      catchError(() => of(false)),
      map(canActivate => canActivate || this.router.createUrlTree(['/', AppRoute.Portal])),
    );
  }
}

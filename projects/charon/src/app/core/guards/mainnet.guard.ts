import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NetworkService } from '@core/services';
import { NetworkId } from '@shared/services/configuration';
import { getParentUrlFromSnapshots } from '@shared/utils/routing';

@Injectable()
export class MainnetGuard implements CanActivate {

  constructor(
    private networkService: NetworkService,
    private router: Router,
  ) {
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    return this.networkService.getActiveNetworkId().pipe(
      take(1),
      map((networkId) => networkId === NetworkId.Mainnet
        || this.router.createUrlTree([getParentUrlFromSnapshots(route, routerState)])),
    );
  }
}

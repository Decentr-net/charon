import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { getParentUrlFromSnapshots } from '@shared/utils/routing';
import { StakingService } from '@core/services';
import { StakingRoute } from '../staking-route';

@Injectable()
export class ExistingValidatorGuard implements CanActivate {
  constructor(
    private router: Router,
    private stakingService: StakingService,
  ) {
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const validatorAddress = route.paramMap.get(StakingRoute.ValidatorAddressParam);

    return this.stakingService.getValidator(validatorAddress).pipe(
      catchError(() => of(void 0)),
      map((validator) => {
        return !!validator || this.router.createUrlTree([getParentUrlFromSnapshots(route, routerState)]);
      }),
    );
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SupportedVersionGuard } from './supported-version.guard';


@Injectable()
export class UpdateGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private supportedVersionGuard: SupportedVersionGuard,
  ) {
  }

  public canActivate(): Observable<boolean | UrlTree> {
    return this.supportedVersionGuard.canActivate().pipe(
      map((isActualOrUrlTree) => {
        return typeof isActualOrUrlTree === 'object' || this.router.createUrlTree(['/']);
      }),
    );
  }

  public canLoad(): Observable<boolean | UrlTree> {
    return this.canActivate();
  }
}

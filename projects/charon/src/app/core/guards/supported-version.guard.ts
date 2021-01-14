import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { compareSemver } from '@shared/utils/number';
import { AppRoute } from '../../app-route';
import { ConfigService } from '../services/config';

const manifest =  require('../../../../../scripts/manifest.base.json');

@Injectable()
export class SupportedVersionGuard implements CanActivate, CanLoad {
  constructor(
    private configService: ConfigService,
    private router: Router,
  ) {
  }

  public canActivate(): Observable<boolean | UrlTree> {
    return this.configService.getAppMinVersionRequired().pipe(
      map((minVersion) => compareSemver(manifest.version, minVersion)),
      map((diff) => diff >= 0 || this.router.createUrlTree(['/', AppRoute.Update])),
    );
  }

  public canLoad(): Observable<boolean | UrlTree> {
    return this.canActivate();
  }
}

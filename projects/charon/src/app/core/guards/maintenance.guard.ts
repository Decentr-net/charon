import { CanActivate, Router, UrlTree } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ConfigService } from '@shared/services/configuration';

@Injectable()
export class MaintenanceGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private router: Router,
  ) {
  }

  public canActivate(): Observable<boolean | UrlTree> {
    return this.configService.getMaintenanceStatus().pipe(
      catchError(() => of(true)),
      map(canActivate => canActivate || this.router.createUrlTree(['/'])),
    );
  }
}

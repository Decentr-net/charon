import { CanActivate, Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { ConfigService } from '@shared/services/configuration';

@Injectable()
export class MaintenanceGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private router: Router,
  ) {
  }

  canActivate() {
    this.configService.forceUpdate();

    return this.configService.getMaintenanceStatus().pipe(
      map((isMaintenance) => isMaintenance),
      catchError(() => of(true)),
      map(canActivate => canActivate || this.router.createUrlTree(['/'])),
    );
  }
}

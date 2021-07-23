import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ConfigService } from '@shared/services/configuration';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { NavigationService } from '@core/navigation';

export const SKIP_MAINTENANCE_INTERCEPTOR_HEADER = 'skip_maintenance_interceptor';

@Injectable()
export class MaintenanceInterceptor implements HttpInterceptor {
  constructor(
    private configService: ConfigService,
    private navigationService: NavigationService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.has(SKIP_MAINTENANCE_INTERCEPTOR_HEADER)) {
      const newRequest = req.clone({ headers: req.headers.delete(SKIP_MAINTENANCE_INTERCEPTOR_HEADER) });
      return next.handle(newRequest);
    }

    return this.configService.getMaintenanceStatus().pipe(
      catchError((error: HttpErrorResponse) => {
        this.navigationService.redirectToMaintenancePage();

        return throwError(error);
      }),
      mergeMap((isMaintenance) => next.handle(req).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && isMaintenance) {
            this.navigationService.redirectToMaintenancePage();
          }

          return event;
        }),
      )),
    );
  }
}

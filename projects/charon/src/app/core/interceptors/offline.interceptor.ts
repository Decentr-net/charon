import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { NavigationService } from '../navigation';

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {
  constructor(
    private navigationService: NavigationService,
  ) {
  }

  public intercept(req: HttpRequest<void>, next: HttpHandler): Observable<HttpEvent<void>> {
    return of(navigator.onLine).pipe(
      mergeMap((isOnline) => next.handle(req).pipe(
        map((event: HttpEvent<void>) => {
          if (!isOnline) {
            this.navigationService.redirectToOfflinePage();
          }

          return event;
        }),
      )),
    );
  }
}

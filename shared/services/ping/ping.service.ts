import { Injectable } from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { catchError, mapTo } from 'rxjs/operators';

@Injectable()
export class PingService {
  constructor() {
  }

  public isServerAvailable(decentrServerUrl: string): Observable<boolean> {
    return defer(() => fetch(`${decentrServerUrl}/node_info`))
      .pipe(
        mapTo(true),
        catchError(() => of(false)),
      );
  }
}

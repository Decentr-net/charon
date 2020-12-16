import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, mapTo } from 'rxjs/operators';

@Injectable()
export class PingService {
  constructor(private httpClient: HttpClient) {
  }

  public isServerAvailable(decentrServerUrl: string): Observable<boolean> {
    return this.httpClient.get(`${decentrServerUrl}/node_info`)
      .pipe(
        mapTo(true),
        catchError(() => of(false)),
      );
  }
}

import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ConfigApiService } from '../api/config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(
    private configApiService: ConfigApiService,
  ) {
  }

  public getRestNodes(): Observable<string[]> {
    return this.configApiService.getConfig().pipe(
      map(({ network }) => {
        return network.rest;
      }),
    );
  }
}

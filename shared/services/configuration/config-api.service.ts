import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';

import { Environment } from '../../../environments/environment.definitions';
import {  MultiConfig } from './config.definitions';

@Injectable()
export class ConfigApiService {
  constructor(
    private environment: Environment,
  ) {
  }

  public getConfig(): Observable<MultiConfig> {
    const now = Date.now();
    const headers = {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    };

    return defer(() => {
      return fetch(`${this.environment.config}?${now}`, { headers })
        .then((response) => response.json());
    });
  }
}

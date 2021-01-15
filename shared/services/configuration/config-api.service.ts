import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';

import { Environment } from '../../../environments/environment.definitions';

export interface Config {
  network: {
    rest: string[];
  },
  minVersion: string;
}

@Injectable()
export class ConfigApiService {
  constructor(
    private environment: Environment,
  ) {
  }

  public getConfig(): Observable<Config> {
    const now = Date.now();
    const headers = {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    return defer(() => {
      return fetch(`${this.environment.awsStorage}/config.json?${now}`, { headers })
        .then((response) => response.json());
    });
  }
}

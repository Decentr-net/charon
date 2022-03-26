import { defer, Observable } from 'rxjs';

import { Environment } from '../../../environments/environment.definitions';
import { Config } from './config.definitions';

export class ConfigApiService {
  constructor(
    private environment: Environment,
  ) {
  }

  public getConfig(): Observable<Config> {
    const now = Date.now();
    const headers = {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
    };

    return defer(() => {
      return fetch(`${this.environment.config}?${now}`, { headers })
        .then((response) => response.json());
    });
  }
}

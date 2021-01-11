import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Environment } from '@environments/environment.definitions';

interface Config {
  network: {
    rest: string[];
  },
  minVersion: string;
}

@Injectable()
export class ConfigApiService {
  constructor(
    private environment: Environment,
    private httpClient: HttpClient,
  ) {
  }

  public getConfig(): Observable<Config> {
    return this.httpClient.get<Config>(`${this.environment.awsStorage}/config.json`);
  }
}

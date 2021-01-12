import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Environment } from '@environments/environment.definitions';

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
    private httpClient: HttpClient,
  ) {
  }

  public getConfig(): Observable<Config> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    return this.httpClient.get<Config>(`${this.environment.awsStorage}/config.json`, { headers });
  }
}

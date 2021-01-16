import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';

import { Config, ConfigApiService } from './config-api.service';
import { Environment } from '../../../environments/environment.definitions';

@Injectable()
export class ConfigService {
  private config$: ReplaySubject<Config> = new ReplaySubject(1);
  private pendingConfig: boolean;

  private readonly configApiService: ConfigApiService = new ConfigApiService(this.environment);

  constructor(
    private environment: Environment,
  ) {
  }

  private getConfig(): Observable<Config> {
    if (!this.pendingConfig) {
      this.pendingConfig = true;

      this.configApiService.getConfig().subscribe(this.config$)
    }

    return this.config$;
  }

  public getAppMinVersionRequired(): Observable<string> {
    return this.getConfig().pipe(
      map(({ minVersion }) => minVersion),
    );
  }

  public getRestNodes(): Observable<string[]> {
    return this.getConfig().pipe(
      map(({ network }) => network.rest),
    );
  }
}

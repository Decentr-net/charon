import { Injectable } from '@angular/core';
import { map, mergeMapTo, tap } from 'rxjs/operators';
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

      return this.configApiService.getConfig().pipe(
        tap((config) => this.config$.next(config)),
        mergeMapTo(this.config$),
      );
    }

    return this.config$;
  }

  public getRestNodes(): Observable<string[]> {
    return this.getConfig().pipe(
      map(({ network }) => network.rest),
    );
  }
}

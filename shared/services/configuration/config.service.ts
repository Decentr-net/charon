import { Injectable } from '@angular/core';
import { filter, map, take } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { PDVDataType } from 'decentr-js';

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

      this.configApiService.getConfig().subscribe(this.config$);
    }

    return this.config$.pipe(
      filter((config) => !!config),
      take(1),
    );
  }

  public forceUpdate(): void {
    this.config$.next(void 0);
    this.pendingConfig = false;
  }

  public getAppMinVersionRequired(): Observable<string> {
    return this.getConfig().pipe(
      map(({ minVersion }) => minVersion),
    );
  }

  public getCerberusUrl(): Observable<string> {
    return this.getConfig().pipe(
      map((config) => config.cerberus.url),
    );
  }

  public getChainId(): Observable<string> {
    return this.getConfig().pipe(
      map(({ chainId }) => chainId),
    );
  }

  public getRestNodes(): Observable<string[]> {
    return this.getConfig().pipe(
      map(({ network }) => network.rest),
    );
  }

  public getPDVCountToSend(): Observable<Pick<Config['cerberus'], 'minPDVCount' | 'maxPDVCount'>> {
    return this.getConfig().pipe(
      map((config) => config.cerberus),
    );
  }

  public getRewards(): Observable<Record<PDVDataType, number>> {
    return this.getConfig().pipe(
      map((config) => config.cerberus.rewards),
    );
  }
}

import { Injectable } from '@angular/core';
import { delay, filter, map, pluck, retryWhen, take } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { PDVType } from 'decentr-js';

import { Environment } from '../../../environments/environment.definitions';
import { ONE_SECOND } from '../../utils/date';
import { ConfigApiService } from './config-api.service';
import { Config } from './config.definitions';

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

      this.configApiService.getConfig().pipe(
        retryWhen(((errors) => errors.pipe(
          delay(ONE_SECOND / 2),
          take(5),
        ))),
      ).subscribe(
        (config) => this.config$.next(config),
        (error) => this.config$.error(error),
      );
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
      map(({ network }) => network.chainId),
    );
  }

  public getMaintenanceStatus(): Observable<boolean> {
    return this.getConfig().pipe(
      map(({maintenance}) => maintenance),
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

  public getRewards(): Observable<Record<PDVType, number>> {
    return this.getConfig().pipe(
      map((config) => config.cerberus.rewards),
    );
  }

  public getVulcanUrl(): Observable<string> {
    return this.getConfig().pipe(
      map(({ vulcan }) => vulcan.url),
    );
  }

  public getTheseusUrl(): Observable<string> {
    return this.getConfig().pipe(
      pluck('theseus', 'url'),
    );
  }

  public getVPNSettings(): Observable<Config['vpn']> {
    return this.getConfig().pipe(
      pluck('vpn'),
    );
  }
}

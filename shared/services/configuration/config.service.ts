import { Injectable } from '@angular/core';
import { delay, filter, map, pluck, retryWhen, take } from 'rxjs/operators';
import { combineLatest, Observable, ReplaySubject, Subscription } from 'rxjs';

import { Environment } from '../../../environments/environment.definitions';
import { ONE_SECOND } from '../../utils/date';
import { ConfigApiService } from './config-api.service';
import { Config, MultiConfig } from './config.definitions';
import { NetworkBrowserStorageService } from '../network-storage';

@Injectable()
export class ConfigService {
  private config$: ReplaySubject<Config> = new ReplaySubject(1);
  private pendingConfig: boolean;

  private readonly configApiService: ConfigApiService = new ConfigApiService(this.environment);

  private configSubscription: Subscription;

  constructor(
    private environment: Environment,
    private networkBrowserStorageService: NetworkBrowserStorageService,
  ) {
  }

  private getConfig(): Observable<Config> {
    if (!this.pendingConfig) {
      this.pendingConfig = true;
      this.configSubscription?.unsubscribe();

      this.configSubscription = combineLatest([
        this.getMultiConfig().pipe(
          retryWhen((errors) => errors.pipe(
            delay(ONE_SECOND),
          )),
        ),
        this.networkBrowserStorageService.getActiveId().pipe(
          filter((id) => !!id),
        ),
      ]).pipe(
        map(([multiConfig, id]) => multiConfig[id]),
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

  public getMultiConfig(): Observable<MultiConfig> {
    return this.configApiService.getConfig();
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

import { delay, filter, map, mapTo, retryWhen, take } from 'rxjs/operators';
import { combineLatest, Observable, ReplaySubject, Subscription } from 'rxjs';

import { Environment } from '../../../environments/environment.definitions';
import { ONE_SECOND } from '../../utils/date';
import { whileOnline } from '../../utils/online';
import { ConfigApiService } from './config-api.service';
import { Config, Network, NetworkId } from './config.definitions';
import { NetworkBrowserStorageService } from '../network-storage';

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

      this.configSubscription = this.configApiService.getConfig().pipe(
        whileOnline,
        retryWhen((errors) => errors.pipe(
          delay(ONE_SECOND),
        )),
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

  public getNetworkConfig(networkId?: NetworkId): Observable<Network> {
    if (networkId) {
      return this.getConfig().pipe(
        map((config) => config.networks[networkId]),
      );
    }

    return combineLatest([
      this.getConfig(),
      this.networkBrowserStorageService.getActiveId().pipe(
        filter((id) => !!id),
      ),
    ]).pipe(
      map(([config, networkId]) => config.networks[networkId]),
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
    return this.getNetworkConfig().pipe(
      map((config) => config.cerberus.url),
    );
  }

  public getMaintenanceStatus(): Observable<boolean> {
    return this.getNetworkConfig().pipe(
      map(({ maintenance}) => maintenance),
      mapTo(false),
    );
  }

  public getNetworkIds(): Observable<NetworkId[]> {
    return this.getConfig().pipe(
      map((config) => Object.keys(config.networks) as NetworkId[]),
    );
  }

  public getRestNodes(): Observable<string[]> {
    // TODO: switch to networkConfig rest
    return this.getConfig().pipe(
      map((config) => config.networks[NetworkId.Testnet].network.rest),
    );
  }

  public getPDVCountToSend(): Observable<Pick<Network['cerberus'], 'minPDVCount' | 'maxPDVCount'>> {
    return this.getNetworkConfig().pipe(
      map((config) => config.cerberus),
    );
  }

  public getVulcanUrl(): Observable<string> {
    return this.getNetworkConfig().pipe(
      map((config) => config.vulcan.url),
    );
  }

  public getTheseusUrl(): Observable<string> {
    return this.getNetworkConfig().pipe(
      map((config) => config.theseus.url),
    );
  }

  public getReferralUrl(): Observable<string> {
    return this.getConfig().pipe(
      map((config) => config.referral.url),
    );
  }

  public getShareUrl(): Observable<string> {
    return this.getConfig().pipe(
      map((config) => config.share.url),
    );
  }
}

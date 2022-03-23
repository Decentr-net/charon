import { combineLatest, Observable, ReplaySubject, Subject, switchMap, tap, timer } from 'rxjs';
import { filter, map, retry, startWith, take } from 'rxjs/operators';

import { Environment } from '../../../environments/environment.definitions';
import { ONE_SECOND } from '../../utils/date';
import { whileOnline } from '../../utils/online';
import { ConfigApiService } from './config-api.service';
import { Config, Network, NetworkId } from './config.definitions';
import { NetworkBrowserStorageService } from '../network-storage';

export class ConfigService {
  private config$: ReplaySubject<Config> = new ReplaySubject(1);

  private readonly configApiService: ConfigApiService = new ConfigApiService(this.environment);

  private readonly update$: Subject<void> = new Subject();

  constructor(
    private environment: Environment,
    private networkBrowserStorageService: NetworkBrowserStorageService,
  ) {
    this.update$.pipe(
      startWith(void 0),
      switchMap(() => timer(0, ONE_SECOND * 30)),
      tap(() => this.config$.next(void 0)),
      switchMap(() => this.configApiService.getConfig().pipe(
        retry({
          delay: ONE_SECOND,
        }),
      )),
      whileOnline,
    ).subscribe(this.config$);
  }

  private getConfig(): Observable<Config> {
    return this.config$.pipe(
      filter((config) => !!config),
    );
  }

  public getNetworkConfig(options: { listen?: boolean, networkId?: NetworkId } = {}): Observable<Network> {
    const configSource$ = options.networkId
      ? this.getConfig().pipe(
        map((config) => config.networks[options.networkId]),
      )
      : combineLatest([
          this.getConfig(),
          this.networkBrowserStorageService.getActiveId().pipe(
            filter((id) => !!id),
          ),
        ]).pipe(
          map(([config, networkId]) => config.networks[networkId]),
        );

    return configSource$.pipe(
      this.listenConfigOperator(!!options.listen),
    );
  }

  public forceUpdate(): void {
    this.update$.next();
  }

  public getAppMinVersionRequired(listen: boolean = false): Observable<string> {
    return this.getConfig().pipe(
      map(({ minVersion }) => minVersion),
      this.listenConfigOperator(listen),
    );
  }

  public getCerberusUrl(listen: boolean = false): Observable<string> {
    return this.getNetworkConfig({ listen }).pipe(
      map((config) => config.cerberus.url),
    );
  }

  public getMaintenanceStatus(listen: boolean = false): Observable<boolean> {
    return this.getNetworkConfig({ listen }).pipe(
      map(({ maintenance}) => maintenance),
    );
  }

  public getNetworkIds(listen: boolean = false): Observable<NetworkId[]> {
    return this.getConfig().pipe(
      map((config) => Object.keys(config.networks) as NetworkId[]),
      this.listenConfigOperator(listen),
    );
  }

  public getRestNodes(listen: boolean = false): Observable<string[]> {
    return this.getNetworkConfig({ listen }).pipe(
      map((config) => config.network.rest),
    );
  }

  public getPDVCountToSend(listen: boolean = false): Observable<Pick<Network['cerberus'], 'minPDVCount' | 'maxPDVCount'>> {
    return this.getNetworkConfig({ listen }).pipe(
      map((config) => config.cerberus),
    );
  }

  public getVulcanUrl(listen: boolean = false): Observable<string> {
    return this.getNetworkConfig({ listen }).pipe(
      map((config) => config.vulcan.url),
    );
  }

  public getTheseusUrl(listen: boolean = false): Observable<string> {
    return this.getNetworkConfig({ listen }).pipe(
      map((config) => config.theseus.url),
    );
  }

  public getReferralUrl(listen: boolean = false): Observable<string> {
    return this.getConfig().pipe(
      map((config) => config.referral.url),
      this.listenConfigOperator(listen),
    );
  }

  public getShareUrl(listen: boolean = false): Observable<string> {
    return this.getConfig().pipe(
      map((config) => config.share.url),
      this.listenConfigOperator(listen),
    );
  }

  public getSwapUrl(listen: boolean = false): Observable<string> {
    return this.getNetworkConfig({ listen }).pipe(
      map((config) => config.swap.url),
    );
  }

  private listenConfigOperator<T>(listen: boolean = true) {
    return (source$: Observable<T>) => listen
      ? source$
      : source$.pipe(
        take(1),
      );
  }
}

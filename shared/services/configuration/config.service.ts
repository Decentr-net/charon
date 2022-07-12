import { combineLatest, Observable, ReplaySubject, Subject, switchMap } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, take } from 'rxjs/operators';

import { Config, ConfigSource, Network, NetworkId } from './config.definitions';
import { NetworkBrowserStorageService } from '../network-storage';

export class ConfigService {
  private config$: ReplaySubject<Config> = new ReplaySubject(1);

  private readonly update$: Subject<void> = new Subject();

  constructor(
    private configSource: ConfigSource,
    private networkBrowserStorageService: NetworkBrowserStorageService,
  ) {
    this.update$.pipe(
      startWith(void 0),
      switchMap(() => this.configSource.getConfig()),
    ).subscribe(this.config$);
  }

  public getConfig(): Observable<Config> {
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
    this.config$.next(void 0);
    this.update$.next();
  }

  public getAppMinVersionRequired(listen = false): Observable<string> {
    return this.getConfig().pipe(
      map(({ minVersion }) => minVersion),
      this.listenConfigOperator(listen),
    );
  }

  public getCerberusUrl(listen = false): Observable<string> {
    return this.getNetworkConfig({ listen }).pipe(
      map((config) => config.cerberus.url),
    );
  }

  public getMaintenanceStatus(listen = false): Observable<boolean> {
    return this.getNetworkConfig({ listen }).pipe(
      map(({ maintenance }) => maintenance),
    );
  }

  public getNetworkIds(listen = false): Observable<NetworkId[]> {
    return this.getConfig().pipe(
      map((config) => Object.keys(config.networks) as NetworkId[]),
      this.listenConfigOperator(listen),
    );
  }

  public getRestNodes(listen = false): Observable<string[]> {
    return this.getNetworkConfig({ listen }).pipe(
      map((config) => config.network.rest),
    );
  }

  public getPDVCountToSend(listen = false): Observable<Pick<Network['cerberus'], 'minPDVCount' | 'maxPDVCount'>> {
    return this.getNetworkConfig({ listen }).pipe(
      map((config) => config.cerberus),
    );
  }

  public getVulcanUrl(listen = false): Observable<string> {
    return this.getNetworkConfig({ listen }).pipe(
      map((config) => config.vulcan.url),
    );
  }

  public getTheseusUrl(listen = false): Observable<string> {
    return this.getNetworkConfig({ listen }).pipe(
      map((config) => config.theseus.url),
    );
  }

  public getReferralUrl(listen = false): Observable<string> {
    return this.getConfig().pipe(
      map((config) => config.referral.url),
      this.listenConfigOperator(listen),
    );
  }

  public getShareUrl(listen = false): Observable<string> {
    return this.getConfig().pipe(
      map((config) => config.share.url),
      this.listenConfigOperator(listen),
    );
  }

  public getSwapUrl(listen = false): Observable<string> {
    return this.getNetworkConfig({ listen }).pipe(
      map((config) => config.swap.url),
    );
  }

  public getVpnUrl(listen = false): Observable<string> {
    return this.getConfig().pipe(
      map((config) => config.vpn.url),
      distinctUntilChanged(),
      this.listenConfigOperator(listen),
    );
  }

  public getVpnGasPrice(listen = false): Observable<string> {
    return this.getConfig().pipe(
      map((config) => config.vpn.gasPrice),
      distinctUntilChanged(),
      this.listenConfigOperator(listen),
    );
  }

  public getVpnMaintenance(listen = false): Observable<boolean> {
    return this.getConfig().pipe(
      map((config) => !config.vpn.enabled),
      this.listenConfigOperator(listen),
    );
  }

  public getVpnFilterLists(listen = false): Observable<Pick<Config['vpn'], 'blackList' | 'whiteList'>> {
    return this.getConfig().pipe(
      map((config) => ({
        blackList: config.vpn.blackList || [],
        whiteList: config.vpn.whiteList || [],
      })),
      this.listenConfigOperator(listen),
    );
  }

  private listenConfigOperator<T>(listen = true) {
    return (source$: Observable<T>) => listen
      ? source$
      : source$.pipe(
        take(1),
      );
  }
}

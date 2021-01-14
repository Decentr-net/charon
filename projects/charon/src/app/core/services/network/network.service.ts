import { Injectable } from '@angular/core';
import { combineLatest, from, Observable } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy } from '@ngneat/until-destroy';

import { Environment } from '@environments/environment.definitions';
import {
  Network as NetworkSelectorNetwork,
  NetworkSelectorService,
  NetworkSelectorTranslations,
} from '@shared/components/network-selector';
import { Network as NetworkWithApi, NetworkBrowserStorageService, } from '@shared/services/network-storage';
import { PingService } from '@shared/services/ping';

export type Network = NetworkWithApi & NetworkSelectorNetwork;

@UntilDestroy()
@Injectable()
export class NetworkService extends NetworkSelectorService {
  private readonly networkStorage = new NetworkBrowserStorageService<Network>();

  constructor(
    private environment: Environment,
    private pingService: PingService,
    private translocoService: TranslocoService,
  ) {
    super();
  }

  public async init(): Promise<void> {
    return this.getNetworks().pipe(
      mergeMap((networks) => this.getActiveNetwork().pipe(
        map((activeNetwork) => {
          return networks.find((network) => this.isNetworksEqual(network, activeNetwork));
        }),
      )),
      mergeMap((translatedActiveNetwork) => {
        return this.networkStorage.setActiveNetwork(translatedActiveNetwork)
      }),
      first(),
    ).toPromise();
  }

  public getActiveNetwork(): Observable<Network> {
    return this.networkStorage.getActiveNetwork();
  }

  public getActiveNetworkInstant(): NetworkWithApi {
    return this.networkStorage.getActiveNetworkInstant();
  }

  public setActiveNetwork(network: Network): Promise<void> {
    return this.networkStorage.setActiveNetwork(network);
  }

  public getNetworks(): Observable<Network[]> {
    return from(this.networkStorage.getDefaultNetwork()).pipe(
      first(),
      mergeMap(({ api: remoteApi }) => combineLatest(
        [
          { key: 'remote', api: remoteApi },
          { key: 'local', api: this.environment.rest['local'] },
        ].map(({ key, api }) => {
          return combineLatest([
            this.translocoService
              .selectTranslate(`network_selector.network.${key}`, null, 'core'),
            this.pingService.isServerAvailable(api),
          ]).pipe(
            map(([name, available]) => ({
              name,
              api,
              disabled: !available,
            })),
          );
        }),
      )),
    );
  }

  public isNetworksEqual(left: Network, right: Network): boolean {
    return left?.api === right?.api;
  }

  public getTranslations(): Observable<NetworkSelectorTranslations> {
    return combineLatest(
      ['title', 'default_network'].map((key) => {
        return this.translocoService
          .selectTranslate(`network_selector.${key}`, null, 'core');
      }),
    ).pipe(
      map(([title, defaultNetwork]) => ({
        title,
        defaultNetwork,
      })),
    );
  }
}

import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { first, map, mapTo, mergeMap, retry, switchMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy } from '@ngneat/until-destroy';

import { ConfigService } from '@core/services/config';
import { Environment } from '@environments/environment.definitions';
import {
  Network as NetworkSelectorNetwork,
  NetworkSelectorService,
  NetworkSelectorTranslations,
} from '@shared/components/network-selector';
import { Network as NetworkWithApi, NetworkBrowserStorageService, } from '@shared/services/network-storage';
import { PingService } from '../api';

export type Network = NetworkWithApi & NetworkSelectorNetwork;

@UntilDestroy()
@Injectable()
export class NetworkService extends NetworkSelectorService {
  private readonly networkStorage = new NetworkBrowserStorageService<Network>();

  constructor(
    private configService: ConfigService,
    private environment: Environment,
    private pingService: PingService,
    private translocoService: TranslocoService,
  ) {
    super();
  }

  public init(): Promise<void> {
    return this.getActiveNetwork().pipe(
      switchMap((activeNetwork) => of(activeNetwork).pipe(
        mergeMap(network => this.pingService.isServerAvailable(network.api)),
        mergeMap(isAvailable => isAvailable && activeNetwork.api === this.environment.rest.local
          ? of(activeNetwork)
          : this.getRandomNetwork().pipe(
            mergeMap(network => this.translocoService
              .selectTranslate(`network_selector.network.remote`, null, 'core').pipe(
                map(name => ({
                  api: network,
                  disabled: false,
                  name,
                })),
              ),
            ),
          )
        ),
        switchMap((network) => this.setActiveNetwork(network)),
      )),
      mapTo(void 0),
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
    return this.getRandomNetwork().pipe(
      mergeMap(node => combineLatest(
        ['remote', 'local'].map((networkName) => {
          const api = networkName === 'local'
            ? this.environment.rest[networkName]
            : node;

          return combineLatest([
            this.translocoService
              .selectTranslate(`network_selector.network.${networkName}`, null, 'core'),
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

  private getRandomNetwork(): Observable<string> {
    return this.configService.getRestNodes().pipe(
      mergeMap(nodes => {
        const random = Math.floor(Math.random() * nodes.length);
        const node = nodes[random];

        return this.pingService.isServerAvailable(node).pipe(
          mergeMap(isAvailable => !isAvailable ? throwError('error') : of(node)),
        );
      }),
      retry(),
    );
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

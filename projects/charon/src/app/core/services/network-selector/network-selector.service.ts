import { Injectable } from '@angular/core';
import { combineLatest, from, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, pluck, switchMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';

import { Environment } from '@environments/environment.definitions';
import {
  Network as NetworkSelectorNetwork,
  NetworkSelectorService as BaseNetworkSelectorService,
  NetworkSelectorTranslations,
} from '@shared/components/network-selector';
import { MessageBus } from '@shared/message-bus';
import { BlockchainNodeService, NodeAvailability } from '@shared/services/blockchain-node';
import { Network as NetworkWithApi, NetworkBrowserStorageService } from '@shared/services/network-storage';
import { MessageCode } from '@scripts/messages';

export type Network = NetworkWithApi & NetworkSelectorNetwork;

@Injectable()
export class NetworkSelectorService extends BaseNetworkSelectorService {
  constructor(
    private blockchainNodeService: BlockchainNodeService,
    private environment: Environment,
    private networkStorage: NetworkBrowserStorageService<Network>,
    private translocoService: TranslocoService,
  ) {
    super();
  }

  public getNetworks(checkAvailability = true): Observable<Network[]> {
    return from(new MessageBus().sendMessage(MessageCode.NetworkReady)).pipe(
      mergeMap(() => this.networkStorage.getDefaultNetwork()),
      pluck('api'),
      distinctUntilChanged(),
      filter((api) => !!api),
      switchMap((remoteApi) => combineLatest(
        [
          { key: 'remote', api: remoteApi },
          { key: 'local', api: this.environment.rest.local },
        ].map(({ key, api }) => {
          return combineLatest([
            this.translocoService
              .selectTranslate(`network_selector.network.${key}`, null, 'core'),
            checkAvailability
              ? this.blockchainNodeService.getNodeAvailability(api, true)
              : of(NodeAvailability.Available),
          ]).pipe(
            map(([name, available]) => ({
              name,
              api,
              disabled: available !== NodeAvailability.Available,
            })),
          );
        }),
      )),
    );
  }

  public getActiveNetwork(): Observable<Network> {
    return combineLatest([
      this.getNetworks(false),
      this.networkStorage.getActiveNetwork().pipe(
        filter((network) => !!network),
      ),
    ]).pipe(
      map(([networks, activeNetwork]) => {
        return networks.find((network) => network.api === activeNetwork.api);
      }),
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

  public setActiveNetwork(network: Network): Promise<void> {
    return this.networkStorage.setActiveNetwork(network);
  }
}

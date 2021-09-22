import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';

import { Environment } from '@environments/environment.definitions';
import {
  Network,
  NetworkSelectorService as BaseNetworkSelectorService,
  NetworkSelectorTranslations,
} from '@shared/components/network-selector';
import { BlockchainNodeService } from '@shared/services/blockchain-node';
import { NetworkBrowserStorageService } from '@shared/services/network-storage';
import { ConfigService } from '@shared/services/configuration';

@Injectable()
export class NetworkSelectorService extends BaseNetworkSelectorService {
  constructor(
    private blockchainNodeService: BlockchainNodeService,
    private environment: Environment,
    private configService: ConfigService,
    private networkStorage: NetworkBrowserStorageService,
    private translocoService: TranslocoService,
  ) {
    super();
  }

  public getNetworks(checkAvailability = true): Observable<Network[]> {
    return this.configService.getNetworkIds().pipe(
      switchMap((networkIds) => {
        return combineLatest(networkIds.map((networkId) => this.getOptionConfig(networkId)));
      }),
    );
  }

  public getActiveNetwork(): Observable<Network> {
    return combineLatest([
      this.getNetworks(),
      this.networkStorage.getActiveId(),
    ]).pipe(
      map(([networks, activeNetworkId]) => networks.find(({ id }) => id === activeNetworkId)),
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
    return this.networkStorage.setActiveId(network.id);
  }

  private getOptionConfig(networkId: string): Observable<Network> {
    return this.translocoService.selectTranslate(`network_selector.network.${networkId}`, null, 'core')
      .pipe(
        map((name) => ({
          id: networkId,
          name,
        })),
      );
  }
}

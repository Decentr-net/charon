import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, skip, switchMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Environment } from '@environments/environment.definitions';
import {
  Network,
  NetworkSelectorService as BaseNetworkSelectorService,
  NetworkSelectorTranslations,
} from '@shared/components/network-selector';
import { BlockchainNodeService } from '@shared/services/blockchain-node';
import { NetworkBrowserStorageService } from '@shared/services/network-storage';
import { ConfigService, NetworkId } from '@shared/services/configuration';

@UntilDestroy()
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

    this.networkStorage.getActiveId().pipe(
      skip(1),
      untilDestroyed(this),
    ).subscribe(() => location.reload());
  }

  public getNetworks(disableForceUpdate?: boolean): Observable<Network[]> {
    return new Observable((subscriber) => {
      const subscription = (() => {
        if (!disableForceUpdate) {
          this.configService.forceUpdate();
        }

        return this.configService.getNetworkIds().pipe(
          switchMap((networkIds) => {
            return combineLatest(networkIds.map((networkId) => this.getOptionConfig(networkId)));
          }),
        ).subscribe((networks) => subscriber.next(networks));
      })();

      return () => subscription.unsubscribe();
    });
  }

  public getActiveNetwork(disableForceUpdate?: boolean): Observable<Network> {
    return combineLatest([
      this.getNetworks(disableForceUpdate),
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

  private getOptionConfig(networkId: NetworkId): Observable<Network> {
    return this.translocoService.selectTranslate(`network_selector.network.${networkId}`, null, 'core')
      .pipe(
        map((name) => ({
          id: networkId,
          name,
        })),
      );
  }
}

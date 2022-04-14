import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, skip, switchMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import {
  Network,
  NetworkSelectorService as BaseNetworkSelectorService,
  NetworkSelectorTranslations,
} from '@shared/components/network-selector';
import { NetworkBrowserStorageService } from '@shared/services/network-storage';
import { ConfigService, NetworkId } from '@shared/services/configuration';

@UntilDestroy()
@Injectable()
export class NetworkSelectorService extends BaseNetworkSelectorService {
  constructor(
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

  public getNetworks(): Observable<Network[]> {
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

  public setActiveNetworkId(networkId: NetworkId): Promise<void> {
    return this.networkStorage.setActiveId(networkId);
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

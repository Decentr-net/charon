import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, skip, switchMap } from 'rxjs/operators';
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
import { ConfigService } from '@shared/services/configuration';
import { NETWORK_ID_QUERY_PARAM } from './network-selector.definitions';

@UntilDestroy()
@Injectable()
export class NetworkSelectorService extends BaseNetworkSelectorService {
  constructor(
    private activatedRoute: ActivatedRoute,
    private blockchainNodeService: BlockchainNodeService,
    private environment: Environment,
    private configService: ConfigService,
    private networkStorage: NetworkBrowserStorageService,
    private ngZone: NgZone,
    private router: Router,
    private translocoService: TranslocoService,
  ) {
    super();

    this.networkStorage.getActiveId().pipe(
      skip(1),
      untilDestroyed(this),
    ).subscribe(() => location.reload());

    this.handleNetworkIdQueryParam();
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

  public setActiveNetworkId(networkId: Network['id']): Promise<void> {
    return this.networkStorage.setActiveId(networkId);
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

  private handleNetworkIdQueryParam(): void {
    combineLatest([
      this.activatedRoute.queryParamMap.pipe(
        map((paramMap) => paramMap.get(NETWORK_ID_QUERY_PARAM)),
        distinctUntilChanged(),
        filter((networkId) => !!networkId),
      ),
      this.getNetworks().pipe(
        map((networks) => networks.map(({ id }) => id)),
      ),
      this.getActiveNetwork().pipe(
        map((network) => network.id)
      ),
    ]).pipe(
      mergeMap((args) => {
        let activatedRouteChild = this.activatedRoute;
        while (activatedRouteChild.firstChild) {
          activatedRouteChild = activatedRouteChild.firstChild;
        }

        return this.ngZone.run(() => this.router.navigate(['./'], {
          queryParams: {
            [NETWORK_ID_QUERY_PARAM]: void 0,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
          relativeTo: activatedRouteChild,
        }).then(() => args));
      }),
      filter(([specifiedNetworkId, networkIds, activeNetworkId]) => {
        return activeNetworkId !== specifiedNetworkId && networkIds.includes(specifiedNetworkId);
      }),
      untilDestroyed(this),
    ).subscribe(([specifiedNetworkId]) => {
      this.setActiveNetworkId(specifiedNetworkId);
    });
  }
}

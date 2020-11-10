import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { first, map, mapTo, switchMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy } from '@ngneat/until-destroy';

import { Environment } from '@environments/environment.definitions';
import {
  Network as NetworkWithApi,
  NetworkBrowserStorageService,
} from '@root-shared/services/network-storage';

export type Network = NetworkWithApi & {
  name: string;
}

@UntilDestroy()
@Injectable()
export class NetworkSelectorService {
  private readonly networkStorage = new NetworkBrowserStorageService<Network>();

  constructor(
    private environment: Environment,
    private translocoService: TranslocoService,
  ) {
  }

  public init(): Promise<void> {
    return this.getActiveNetwork().pipe(
      switchMap((activeNetwork) => activeNetwork
        ? of(activeNetwork)
        : this.getNetworks().pipe(
          map((networks) => networks[0]),
          switchMap((network) => this.setActiveNetwork(network)),
        )
      ),
      mapTo(void 0),
      first(),
    ).toPromise();
  }

  public getActiveNetwork(): Observable<Network> {
    return this.networkStorage.getActiveNetwork();
  }

  public getActiveNetworkInstant(): Network {
    return this.networkStorage.getActiveNetworkInstant();
  }

  public setActiveNetwork(network: Network): Promise<void> {
    return this.networkStorage.setActiveNetwork(network)
  }

  public getNetworks(): Observable<Network[]> {
    return combineLatest([
      this.translocoService.selectTranslate('network.remote').pipe(
        map((name) => ({
          name,
          api: this.environment.rest.remote,
        }))
      ),
      this.translocoService.selectTranslate('network.local').pipe(
        map((name) => ({
          name,
          api: this.environment.rest.local,
        }))
      ),
    ]);
  }
}

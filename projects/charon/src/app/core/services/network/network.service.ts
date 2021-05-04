import { Injectable } from '@angular/core';
import { filter, first, mapTo } from 'rxjs/operators';

import { Network, NetworkBrowserStorageService } from '@shared/services/network-storage';

@Injectable()
export class NetworkService {
  constructor(
    private networkStorage: NetworkBrowserStorageService<Network>,
  ) {
  }

  public init(): Promise<void> {
    return this.networkStorage.getActiveNetwork().pipe(
      filter(Boolean),
      mapTo(void 0),
      first(),
    ).toPromise();
  }

  public getActiveNetworkInstant(): Network {
    return this.networkStorage.getActiveNetworkInstant();
  }
}

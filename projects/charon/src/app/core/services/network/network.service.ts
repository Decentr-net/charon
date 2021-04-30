import { Injectable } from '@angular/core';

import { Network, NetworkBrowserStorageService } from '@shared/services/network-storage';

@Injectable()
export class NetworkService {
  constructor(
    private networkStorage: NetworkBrowserStorageService<Network>,
  ) {
  }

  public getActiveNetworkInstant(): Network {
    return this.networkStorage.getActiveNetworkInstant();
  }
}

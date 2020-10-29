import { Observable } from 'rxjs';

import { Network } from './network-selector.definitions';

export abstract class NetworkSelectorStoreService {
  public abstract getActiveNetwork(): Observable<Network>;
  public abstract setActiveNetwork(network: Network): Promise<void>;
  public abstract getNetworks(): Observable<Network[]>;
}

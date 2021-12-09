import { Observable } from 'rxjs';

import { Network, NetworkSelectorTranslations } from './network-selector.definitions';

export abstract class NetworkSelectorService {
  public abstract getNetworks(): Observable<Network[]>;

  public abstract getActiveNetwork(): Observable<Network>;

  public abstract setActiveNetwork(network: Network): void;

  public abstract getTranslations(): Observable<NetworkSelectorTranslations>;
}

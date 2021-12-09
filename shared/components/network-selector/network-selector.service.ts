import { Observable } from 'rxjs';

import { Network, NetworkSelectorTranslations } from './network-selector.definitions';

export abstract class NetworkSelectorService {
  public abstract getNetworks(): Observable<Network[]>;

  public abstract getActiveNetwork(): Observable<Network>;

  public abstract setActiveNetworkId(network: Network['id']): void;

  public abstract getTranslations(): Observable<NetworkSelectorTranslations>;
}

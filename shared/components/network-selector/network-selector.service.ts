import { Observable } from 'rxjs';

import { NetworkId } from '@shared/services/configuration';
import { Network, NetworkSelectorTranslations } from './network-selector.definitions';

export abstract class NetworkSelectorService {
  public abstract getNetworks(): Observable<Network[]>;

  public abstract getActiveNetwork(): Observable<Network>;

  public abstract setActiveNetworkId(networkId: NetworkId): void;

  public abstract getTranslations(): Observable<NetworkSelectorTranslations>;
}

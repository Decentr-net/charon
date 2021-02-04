import { defer, Observable } from 'rxjs';
import { KeyPair, PDV } from 'decentr-js';

import { environment } from '../../../../../environments/environment';
import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';
import { PDVService } from '../../../../../shared/services/pdv';

const pdvService = new PDVService(environment.chainId);
const networkStorage = new NetworkBrowserStorageService();

export const sendPDV = (keys: KeyPair, pDVs: PDV[]): Observable<string> => {
  return defer(() => pdvService.sendPDV(
    networkStorage.getActiveNetworkInstant().api,
    keys,
    pDVs
  ));
};

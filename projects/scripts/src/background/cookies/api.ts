import { defer, Observable } from 'rxjs';
import { PDV, Wallet } from 'decentr-js';

import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';
import { PDVService } from '../../../../../shared/services/pdv';
import QUEUE, { QueuePriority } from '../queue';

const pdvService = new PDVService();
const networkStorage = new NetworkBrowserStorageService();

export const sendPDV = (wallet: Wallet, pDVs: PDV[]): Observable<void> => {
  return defer(() => QUEUE.add(() => pdvService.sendPDV(
    networkStorage.getActiveNetworkInstant().api,
    wallet,
    pDVs
  ), { priority: QueuePriority.Cookies }));
};

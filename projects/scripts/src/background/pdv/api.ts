import { defer, firstValueFrom, Observable, of } from 'rxjs';
import { catchError, mapTo, mergeMap, shareReplay } from 'rxjs/operators';
import { CerberusClient, PDV, PDVBlacklist, Wallet } from 'decentr-js';

import QUEUE, { QueuePriority } from '../queue';
import CONFIG_SERVICE from '../config';

const configService = CONFIG_SERVICE;

export const blacklist$: Observable<PDVBlacklist> =
  configService.getCerberusUrl().pipe(
    mergeMap((cerberusUrl) => new CerberusClient(cerberusUrl).configuration.getPDVBlacklist()),
    catchError(() => of({
      cookieSource: [],
    })),
    shareReplay(1),
  );

export const sendPDV = (wallet: Wallet, pDVs: PDV[]): Observable<void> => {
  return defer(() => QUEUE.add(() => firstValueFrom(configService.getCerberusUrl().pipe(
    mergeMap((cerberusUrl) => new CerberusClient(cerberusUrl).pdv.sendPDV(pDVs, wallet)),
    mapTo(void 0),
  )), { priority: QueuePriority.PDV }));
};

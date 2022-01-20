import { defer, firstValueFrom, Observable, of } from 'rxjs';
import { catchError, mapTo, mergeMap, shareReplay } from 'rxjs/operators';
import { DecentrPDVClient, PDV, PDVBlacklist, Wallet } from 'decentr-js';

import QUEUE, { QueuePriority } from '../queue';
import CONFIG_SERVICE from '../config';

const configService = CONFIG_SERVICE;

export const blacklist$: Observable<PDVBlacklist> =
  configService.getCerberusUrl().pipe(
    mergeMap((cerberusUrl) => defer(() => new DecentrPDVClient(cerberusUrl).getPDVBlacklist()).pipe(
      catchError(() => of({
        cookieSource: [],
      })),
    )),
    shareReplay(1),
  );

export const sendPDV = (wallet: Wallet, pDVs: PDV[]): Observable<void> => {
  return defer(() => QUEUE.add(() => firstValueFrom(configService.getCerberusUrl().pipe(
    mergeMap((cerberusUrl) => new DecentrPDVClient(cerberusUrl).sendPDV(pDVs, wallet)),
    mapTo(void 0),
  )), { priority: QueuePriority.PDV }));
};

import { defer, Observable, of } from 'rxjs';
import { catchError, mapTo, mergeMap } from 'rxjs/operators';
import { getPDVBlacklist, PDV, PDVBlacklist, sendPDV as decentrSendPDV, Wallet } from 'decentr-js';

import QUEUE, { QueuePriority } from '../queue';
import CONFIG_SERVICE from '../config';

const configService = CONFIG_SERVICE;

export const getBlacklist = (): Observable<PDVBlacklist> => {
  return configService.getCerberusUrl().pipe(
    mergeMap((cerberusUrl) => defer(() => getPDVBlacklist(cerberusUrl)).pipe(
      catchError(() => of({
        cookieSource: [],
      })),
    )),
  );
};

export const sendPDV = (wallet: Wallet, pDVs: PDV[]): Observable<void> => {
  return defer(() => QUEUE.add(() => configService.getCerberusUrl().pipe(
    mergeMap((cerberusUrl) => decentrSendPDV(cerberusUrl, pDVs, wallet)),
    mapTo(void 0),
  ).toPromise(), { priority: QueuePriority.PDV }));
};

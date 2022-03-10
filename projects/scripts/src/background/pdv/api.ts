import { defer, firstValueFrom, Observable, of, ReplaySubject, switchMap, take } from 'rxjs';
import { catchError, mapTo, mergeMap } from 'rxjs/operators';
import { CerberusClient, PDV, PDVBlacklist, Wallet } from 'decentr-js';

import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';
import QUEUE, { QueuePriority } from '../queue';
import CONFIG_SERVICE from '../config';

const configService = CONFIG_SERVICE;

export const blacklist$: Observable<PDVBlacklist> = (() => {
  const blacklistSource$ = new ReplaySubject<PDVBlacklist>(1);

  new NetworkBrowserStorageService().getActiveId().pipe(
    switchMap(() => configService.getCerberusUrl()),
    switchMap((cerberusUrl) => new CerberusClient(cerberusUrl).configuration.getPDVBlacklist()),
    catchError(() => of({
      cookieSource: [],
    })),
  ).subscribe(blacklistSource$);

  return blacklistSource$.pipe(
    take(1),
  );
})();

export const sendPDV = (pDVs: PDV[], privateKey: Wallet['privateKey']): Observable<void> => {
  return defer(() => QUEUE.add(() => firstValueFrom(configService.getCerberusUrl().pipe(
    mergeMap((cerberusUrl) => new CerberusClient(cerberusUrl).pdv.sendPDV(pDVs, privateKey)),
    mapTo(void 0),
  )), { priority: QueuePriority.PDV }));
};

export const validatePDV = (pDVs: PDV[]): Observable<number[]> => {
  return configService.getCerberusUrl().pipe(
    mergeMap((cerberusUrl) => new CerberusClient(cerberusUrl).pdv.validate(pDVs)),
  );
};

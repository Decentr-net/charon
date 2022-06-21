import { combineLatest, firstValueFrom, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { DecentrClient } from 'decentr-js';

import { NetworkBrowserStorageService } from '../../../../shared/services/network-storage';
import { AuthBrowserStorageService } from '../../../../shared/services/auth';
import { ONE_SECOND } from '../../../../shared/utils/date';

const DECENTR_CLIENT$: Observable<DecentrClient> = (() => {
  const networkStorage = new NetworkBrowserStorageService();

  const clientSource$ = new ReplaySubject<DecentrClient>(1);

  combineLatest([
    networkStorage.getActiveAPI(),
    new AuthBrowserStorageService().getActiveUser(),
  ]).pipe(
    tap(() => clientSource$.next(undefined)),
    debounceTime(ONE_SECOND),
    switchMap(([api, user]) => DecentrClient.create(api, user?.wallet?.privateKey)),
  ).subscribe(clientSource$);

  return clientSource$.pipe(
    filter(Boolean),
    take(1),
  );
})();

export const getDecentrClient = () => firstValueFrom(DECENTR_CLIENT$);

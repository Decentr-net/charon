import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { debounceTime, mapTo, mergeMap, switchMap } from 'rxjs/operators';
import { Wallet } from 'decentr-js';

import { LockBrowserStorageService } from '../../../../shared/services/lock';
import { SettingsService } from '../../../../shared/services/settings';
import { whileUserActive } from './auth/while-user-active';

const lockStorage = new LockBrowserStorageService();
const settingsService = new SettingsService();

const getLockDelay = (walletAddress: Wallet['address']): Observable<number> => {
  return settingsService.getUserSettingsService(walletAddress).lock.getLockDelay();
};

const listenActivityEnd = (): Observable<void> => {
  return whileUserActive((user) => {
    return getLockDelay(user.wallet.address).pipe(
      switchMap((lockDelay) => lockDelay
        ? lockStorage.getLastActivityTimeChanges().pipe(
          debounceTime(lockDelay),
        )
        : EMPTY
      ),
      mapTo(void 0),
    );
  });
};

const lock = (): Promise<void> => {
  return lockStorage.setLocked(true);
};

export const initAutoLock = () => {
  whileUserActive((user) => {
    return getLockDelay(user.wallet.address).pipe(
      switchMap((lockDelay) => forkJoin([
        lockStorage.getLocked(),
        lockStorage.getLastActivityTime(),
      ]).pipe(
        mergeMap(([isLocked, lastActivityTime]) => {
          return !isLocked && lastActivityTime && ((Date.now() - lastActivityTime) > (lockDelay || Infinity))
            ? lock()
            : of(void 0);
        }),
        switchMap(() => listenActivityEnd()),
      )),
    );
  }).subscribe(() => lock());
};

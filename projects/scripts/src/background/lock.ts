import { forkJoin, Observable, of } from 'rxjs';
import { debounceTime, mapTo, mergeMap } from 'rxjs/operators';

import { LockBrowserStorageService } from '../../../../shared/services/lock';
import { ONE_HOUR } from '../../../../shared/utils/date';

const LOCK_DELAY = ONE_HOUR * 4;

const lockStorage = new LockBrowserStorageService();

const listenActivityEnd = (): Observable<void> => {
  return lockStorage.getLastActivityTimeChanges().pipe(
    debounceTime(LOCK_DELAY),
    mapTo(void 0),
  );
};

const lock = (): Promise<void> => {
  return lockStorage.setLocked(true);
};

export const initAutoLock = () => {
  forkJoin([
    lockStorage.getLocked(),
    lockStorage.getLastActivityTime(),
  ]).pipe(
    mergeMap(([isLocked, lastActivityTime]) => {
      return !isLocked && lastActivityTime && ((Date.now() - lastActivityTime) > LOCK_DELAY)
        ? lock()
        : of(void 0);
    }),
    mergeMap(() => listenActivityEnd()),
  ).subscribe(() => lock());
};

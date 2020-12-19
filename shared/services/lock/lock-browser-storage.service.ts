import { from, Observable } from 'rxjs';
import { mergeMap, startWith, tap } from 'rxjs/operators';

import { BrowserLocalStorage } from '../browser-storage';

interface LockStorage {
  lastActivityTime: number;
  locked: boolean;
}

export class LockBrowserStorageService {
  private readonly lockStorage = BrowserLocalStorage
    .getInstance()
    .useSection<LockStorage>('lock');

  public setLocked(value: boolean): Promise<void> {
    return this.lockStorage.set('locked', value);
  }

  public getLockedChanges(): Observable<boolean> {
    return this.getStorageValueChanges('locked');
  }

  public setLastActivityTime(value: number): Promise<void> {
    return this.lockStorage.set('lastActivityTime', value);
  }

  public getLastActivityTimeChanges(): Observable<number> {
    return this.getStorageValueChanges('lastActivityTime');
  }

  private getStorageValueChanges<K extends keyof LockStorage>(key: K): Observable<LockStorage[K]> {
    return from(this.lockStorage.get(key)).pipe(
      mergeMap((isLocked) => this.lockStorage.onChange(key).pipe(
        tap(console.log),
        startWith(isLocked),
      )),
    );
  }
}

import { from, Observable } from 'rxjs';
import { mergeMap, startWith } from 'rxjs/operators';

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

  public getLocked(): Promise<boolean> {
    return this.lockStorage.get('locked');
  }

  public getLockedChanges(): Observable<boolean> {
    return this.getStorageValueChanges('locked');
  }

  public setLastActivityTime(value: number): Promise<void> {
    return this.lockStorage.set('lastActivityTime', value);
  }

  public getLastActivityTime(): Promise<number> {
    return this.lockStorage.get('lastActivityTime');
  }

  public getLastActivityTimeChanges(): Observable<number> {
    return this.getStorageValueChanges('lastActivityTime');
  }

  private getStorageValueChanges<K extends keyof LockStorage>(key: K): Observable<LockStorage[K]> {
    return from(this.lockStorage.get(key)).pipe(
      mergeMap((isLocked) => this.lockStorage.onChange(key).pipe(
        startWith(isLocked),
      )),
    );
  }
}

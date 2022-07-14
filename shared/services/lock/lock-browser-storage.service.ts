import { Observable } from 'rxjs';

import { BrowserLocalStorage } from '../storage';

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
    return this.lockStorage.observe('locked');
  }

  public setLastActivityTime(value: number): Promise<void> {
    return this.lockStorage.set('lastActivityTime', value);
  }

  public getLastActivityTime(): Promise<number> {
    return this.lockStorage.get('lastActivityTime');
  }

  public getLastActivityTimeChanges(): Observable<number> {
    return this.lockStorage.observe('lastActivityTime');
  }

  public clear(): Promise<void> {
    return this.lockStorage.clear();
  }
}

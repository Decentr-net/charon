import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ONE_HOUR } from '../../../utils/date';
import { BrowserStorage } from '../../browser-storage';
import { LockSettings } from './lock-settings.definitions';

const DEFAULT_LOCK_DELAY = ONE_HOUR * 48;

export class LockSettingsService {
  constructor(
    private storage: BrowserStorage<LockSettings>,
  ) {
  }

  public getLockDelay(): Observable<LockSettings['delay']> {
    return this.storage.observe('delay').pipe(
      map((delay) => typeof delay === 'number' ? delay : DEFAULT_LOCK_DELAY),
    );
  }

  public setLockDelay(delay: LockSettings['delay']): Promise<void> {
    return this.storage.set('delay', delay);
  }
}

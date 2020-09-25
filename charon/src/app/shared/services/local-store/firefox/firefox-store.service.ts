import { Injectable } from '@angular/core';

import { LocalStoreService } from '../local-store.service';

@Injectable()
export class FirefoxStoreService extends LocalStoreService {
  private firefoxStorage = window['browser'].storage.local;

  public get<T>(key: string): Promise<T> {
    return this.firefoxStorage.get(key).then(obj => obj[key]);
  }

  public set<T>(key: string, value: T): Promise<void> {
    return this.firefoxStorage.set({ [key]: value });
  }

  public remove(key: string): Promise<void> {
    return this.firefoxStorage.remove(key);
  }
}

import { Injectable } from '@angular/core';

import { LocalStoreService } from '../local-store.service';

@Injectable()
export class ChromeStoreService extends LocalStoreService {
  private chromeStorage = chrome.storage.local;

  public get<T>(key: string): Promise<T> {
    return new Promise<T>(resolve => {
      this.chromeStorage.get(key, obj => resolve(obj[key]));
    });
  }

  public set<T>(key: string, value: T): Promise<void> {
    return new Promise<void>(resolve => {
      this.chromeStorage.set({ [key]: value }, () => resolve());
    });
  }

  public remove(key: string): Promise<void> {
    return new Promise<void>(resolve => {
      this.chromeStorage.remove(key, () => resolve());
    });
  }
}

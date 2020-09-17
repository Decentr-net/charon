import { Injectable } from '@angular/core';

import { LocalStoreService } from '../local-store.service';

@Injectable()
export class ChromeStoreService implements LocalStoreService {
  private chromeStorage = chrome.storage.local;

  public get(key: string): Promise<string> {
    return new Promise<string>(resolve => {
      this.chromeStorage.get(key, obj => resolve(obj[key]));
    });
  }

  public set(key: string, value: string): Promise<void> {
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

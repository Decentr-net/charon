import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import PQueue from 'p-queue';

import { LocalStoreService } from '../local-store.service';

@Injectable()
export class ChromeStoreService extends LocalStoreService {
  private readonly queue = new PQueue({ concurrency: 1 });
  private chromeStorage = chrome.storage.local;

  public static canUse = !!window.chrome && window.chrome.storage;

  public get<T>(key: string): Promise<T> {
    return this.queue.add(() => new Promise<T>(resolve => {
      this.chromeStorage.get(key, obj => resolve(obj[key]));
    }));
  }

  public async set<T>(key: string, value: T): Promise<void> {
    return this.queue.add(() => new Promise<void>(resolve => {
      this.chromeStorage.set({ [key]: value }, () => resolve());
    }));
  }

  public remove(key: string): Promise<void> {
    return this.queue.add(() =>  new Promise<void>(resolve => {
      this.chromeStorage.remove(key, () => resolve());
    }));
  }

  public onChange<T>(key: string): Observable<T> {
    return new Observable((subscriber) => {
      const callback = (changes: Record<string, chrome.storage.StorageChange>) => {
        if (changes[key]) {
          subscriber.next(changes[key].newValue)
        }
      };
      chrome.storage.onChanged.addListener(callback);

      return () => chrome.storage.onChanged.removeListener(callback);
    });
  }
}

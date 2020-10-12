import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import PQueue from 'p-queue';

import { LocalStoreService } from '../local-store.service';

@Injectable()
export class FirefoxStoreService extends LocalStoreService {
  private readonly queue = new PQueue({ concurrency: 1 });
  private firefoxStorage = window['browser'].storage.local;

  public static canUse = !!window['browser'] && window['browser'].storage;

  public get<T>(key: string): Promise<T> {
    return this.queue.add(() => this.firefoxStorage.get(key).then(obj => obj[key]));
  }

  public set<T>(key: string, value: T): Promise<void> {
    return this.queue.add(() => this.firefoxStorage.set({ [key]: value }));
  }

  public remove(key: string): Promise<void> {
    return this.queue.add(() => this.firefoxStorage.remove(key));
  }

  public onChange<T>(key: string): Observable<T> {
    return new Observable((subscriber) => {
      const callback = (changes: Record<string, chrome.storage.StorageChange>) => {
        if (changes[key]) {
          subscriber.next(changes[key].newValue)
        }
      };
      window['browser'].storage.onChanged.addListener(callback);

      return () => window['browser'].storage.onChanged.removeListener(callback);
    });
  }
}

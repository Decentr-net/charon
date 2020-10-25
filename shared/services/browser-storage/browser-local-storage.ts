import { Observable } from 'rxjs';
import { browser } from 'webextension-polyfill-ts';
import PQueue from 'p-queue';

import { BrowserStorage } from './browser-storage.definitons';
import { BrowserStorageSection } from './browser-storage-section';

export class BrowserLocalStorage<T extends {} = {}> implements BrowserStorage<T> {
  private static readonly queue = new PQueue({ concurrency: 1 });
  private static instance: BrowserLocalStorage;
  private readonly storage = browser.storage;
  private readonly localStorage = this.storage.local;

  public static getInstance<T extends {} = {}>(): BrowserStorage<T> {
    if (!BrowserLocalStorage.instance) {
      BrowserLocalStorage.instance = new BrowserLocalStorage();
    }

    return BrowserLocalStorage.instance as BrowserStorage<T>;
  }

  public get<K extends keyof T>(key: K): Promise<T[K]> {
    return BrowserLocalStorage.queue.add(() => this.localStorage.get(key.toString())
      .then(obj => obj[key.toString()]));
  }

  public set<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    return BrowserLocalStorage.queue.add(() => this.localStorage.set({ [key]: value }));
  }

  public remove(key: keyof T): Promise<void> {
    return BrowserLocalStorage.queue.add(() => this.localStorage.remove(key.toString()));
  }

  public clear(): Promise<void> {
    return this.localStorage.clear();
  }

  public onChange<K extends keyof T>(key: K): Observable<T[K]> {
    return new Observable((subscriber) => {
      const callback = (changes: Record<K, chrome.storage.StorageChange>) => {
        if (changes[key]) {
          subscriber.next(changes[key].newValue);
        }
      };
      this.storage.onChanged.addListener(callback);

      return () => this.storage.onChanged.removeListener(callback);
    });
  }

  public useSection<Child extends {} = {}>(section: string): BrowserStorage<Child> {
    return new BrowserStorageSection<Child>(this as BrowserStorage<Record<string, Child>>, section);
  }
}

import { Observable } from 'rxjs';
import * as Browser from 'webextension-polyfill';
import PQueue from 'p-queue';

import { BrowserStorage } from './browser-storage.definitons';
import { BrowserStorageSection } from './browser-storage-section';

export class BrowserLocalStorage<T> implements BrowserStorage<T> {
  private static readonly queue = new PQueue({ concurrency: 1 });

  private static instance: BrowserLocalStorage<unknown>;

  private readonly storage = Browser.storage;

  private readonly localStorage = this.storage.local;

  public static getInstance<T>(): BrowserStorage<T> {
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

  public async pop<K extends keyof T>(key: K): Promise<T[K]> {
    const value = await this.get(key);
    await this.remove(key);
    return value;
  }

  public clear(): Promise<void> {
    return this.localStorage.clear();
  }

  public onChange<K extends keyof T>(key: K): Observable<T[K]> {
    return new Observable((subscriber) => {
      const callback = (changes: Record<K, Browser.Storage.StorageChange>) => {
        if (changes[key]) {
          subscriber.next(changes[key].newValue);
        }
      };
      this.storage.onChanged.addListener(callback);

      return () => this.storage.onChanged.removeListener(callback);
    });
  }

  public useSection<Child>(section: string): BrowserStorage<Child> {
    return new BrowserStorageSection<Child>(this as unknown as BrowserStorage<Record<string, Child>>, section);
  }
}

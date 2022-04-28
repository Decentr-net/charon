import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import * as Browser from 'webextension-polyfill';
import PQueue from 'p-queue';

import { BrowserStorage } from './browser-storage.definitons';
import { BrowserStorageSection } from './browser-storage-section';

export class BrowserLocalStorage<T> extends BrowserStorage<T> {
  private static readonly queue = new PQueue({ concurrency: 1 });

  private static instance: BrowserLocalStorage<unknown>;

  private readonly storage = Browser.storage;

  private readonly localStorage = this.storage.local;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

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
    return new Observable<T[K]>((subscriber) => {
      const callback = (changes: Record<K, Browser.Storage.StorageChange>) => {
        if (changes[key]) {
          subscriber.next(changes[key].newValue);
        }
      };

      this.storage.onChanged.addListener(callback);

      return () => this.storage.onChanged.removeListener(callback);
    }).pipe(
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    );
  }

  public useSection<Child>(section: string): BrowserStorage<Child> {
    return new BrowserStorageSection<Child>(this as unknown as BrowserStorage<Record<string, Child>>, section);
  }
}

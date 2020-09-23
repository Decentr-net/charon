import { Injectable } from '@angular/core';

import { LocalStoreService } from '../local-store.service';

@Injectable()
export class LocalStorageService extends LocalStoreService {
  public get<T>(key: string): Promise<T> {
    const item = localStorage.getItem(key);
    return Promise.resolve(item && JSON.parse(item));
  }

  public set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  }

  public remove(key: string): Promise<void> {
    localStorage.removeItem(key);
    return Promise.resolve();
  }
}

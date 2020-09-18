import { Injectable } from '@angular/core';

import { LocalStoreService } from '../local-store.service';

@Injectable()
export class LocalStorageService implements LocalStoreService {
  public get(key: string): Promise<any> {
    const item = localStorage.getItem(key);
    return Promise.resolve(item && JSON.parse(item));
  }

  public set(key: string, value: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  }

  public remove(key: string): Promise<void> {
    localStorage.removeItem(key);
    return Promise.resolve();
  }
}

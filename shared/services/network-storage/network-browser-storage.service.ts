import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { filter, mergeMap, startWith } from 'rxjs/operators';

import { BrowserLocalStorage, BrowserStorage } from '../browser-storage';

export interface NetworkStorage {
  id: string;
  api: string;
}

@Injectable()
export class NetworkBrowserStorageService {
  private readonly browserStorage: BrowserStorage<NetworkStorage>
    = BrowserLocalStorage.getInstance().useSection('network');

  private readonly activeAPI$: BehaviorSubject<NetworkStorage['api']> = new BehaviorSubject(undefined);

  constructor() {
    this.getActiveAPI().subscribe(this.activeAPI$);
  }

  public getActiveAPI(): Observable<string> {
    return from(this.browserStorage.get('api')).pipe(
      mergeMap((api) => this.browserStorage.onChange('api').pipe(
        startWith(api),
      )),
      filter((api) => !!api),
    );
  }

  public getActiveAPIInstant(): NetworkStorage['api'] {
    return this.activeAPI$.value;
  }

  public setActiveAPI(api: string): Promise<void> {
    return this.browserStorage.set('api', api);
  }

  public getActiveId(): Observable<NetworkStorage['id']> {
    return from(this.browserStorage.get('id')).pipe(
      mergeMap((id) => this.browserStorage.onChange('id').pipe(
        startWith(id),
      )),
    );
  }

  public setActiveId(id: NetworkStorage['id']): Promise<void> {
    return this.browserStorage.set('id', id);
  }

  public clear(): Promise<void> {
    return this.browserStorage.clear();
  }
}

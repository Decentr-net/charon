import { BehaviorSubject, from, Observable } from 'rxjs';
import { mergeMap, startWith } from 'rxjs/operators';

import { BrowserLocalStorage, BrowserStorage } from '../browser-storage';

export interface Network {
  api: string;
}

export interface NetworkStorage<T> {
  active: T;
}

export class NetworkBrowserStorageService<T extends Network = Network> {
  private readonly browserStorage: BrowserStorage<NetworkStorage<T>>
    = BrowserLocalStorage.getInstance().useSection('network');

  private readonly activeNetwork$: BehaviorSubject<T> = new BehaviorSubject(undefined);

  constructor() {
    this.getActiveNetwork().subscribe(this.activeNetwork$);
  }

  public getActiveNetwork(): Observable<T | undefined> {
    return from(this.browserStorage.get('active')).pipe(
      mergeMap((activeNetwork) => this.browserStorage.onChange('active').pipe(
        startWith(activeNetwork),
      )),
    );
  }

  public getActiveNetworkInstant(): T {
    return this.activeNetwork$.value;
  }

  public setActiveNetwork(network: T): Promise<void> {
    return this.browserStorage.set('active', network);
  }
}

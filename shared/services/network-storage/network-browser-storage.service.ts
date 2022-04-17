import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { BrowserLocalStorage, BrowserStorage } from '../browser-storage';
import { NetworkId } from '../configuration';

export interface NetworkStorage {
  id: NetworkId;
  api: string;
}

export class NetworkBrowserStorageService {
  private readonly browserStorage: BrowserStorage<NetworkStorage>
    = BrowserLocalStorage.getInstance().useSection('network');

  private readonly activeAPI$: BehaviorSubject<NetworkStorage['api']> = new BehaviorSubject(undefined);

  private readonly activeId$: BehaviorSubject<NetworkStorage['id']> = new BehaviorSubject(undefined);

  constructor() {
    this.getActiveAPI().subscribe(this.activeAPI$);

    this.getActiveId().subscribe(this.activeId$);
  }

  public getActiveAPI(): Observable<string> {
    return this.browserStorage.observe('api').pipe(
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
    return this.browserStorage.observe('id');
  }

  public getActiveIdInstant(): NetworkStorage['id'] {
    return this.activeId$.value;
  }

  public setActiveId(id: NetworkStorage['id']): Promise<void> {
    return this.browserStorage.set('id', id);
  }

  public clear(): Promise<void> {
    return this.browserStorage.clear();
  }
}

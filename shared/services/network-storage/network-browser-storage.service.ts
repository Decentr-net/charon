import { BehaviorSubject, from, merge, Observable } from 'rxjs';
import { distinctUntilChanged, filter, mergeMap, startWith } from 'rxjs/operators';

import { BrowserLocalStorage, BrowserStorage } from '../browser-storage';

export interface NetworkStorage {
  id: string;
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
    return merge(
      this.browserStorage.onChange('api'),
      this.browserStorage.get('api'),
    ).pipe(
      filter((api) => !!api),
      distinctUntilChanged(),
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

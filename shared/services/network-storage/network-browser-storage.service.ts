import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { BrowserLocalStorage, BrowserStorage } from '../storage';
import { NetworkId } from '../configuration';

export interface NetworkStorage {
  id: NetworkId;
  api: string;
}

export class NetworkBrowserStorageService {
  private readonly browserStorage: BrowserStorage<NetworkStorage>
    = BrowserLocalStorage.getInstance().useSection('network');

  public getActiveAPI(): Observable<string> {
    return this.browserStorage.observe('api').pipe(
      filter((api) => !!api),
    );
  }

  public setActiveAPI(api: string): Promise<void> {
    return this.browserStorage.set('api', api);
  }

  public getActiveId(): Observable<NetworkStorage['id']> {
    return this.browserStorage.observe('id');
  }

  public setActiveId(id: NetworkStorage['id']): Promise<void> {
    return this.browserStorage.set('id', id);
  }

  public clear(): Promise<void> {
    return this.browserStorage.clear();
  }
}

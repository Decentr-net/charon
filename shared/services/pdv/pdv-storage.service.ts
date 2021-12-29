import { defer, Observable } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';
import { PDV, Wallet } from 'decentr-js';

import { BrowserLocalStorage, BrowserStorage } from '../browser-storage';

interface PDVStorageUserValue {
  accumulated: PDV[];
}

type PDVStorageValue = Record<Wallet['address'], PDVStorageUserValue>;

export class PDVStorageService {
  private readonly browserStorage
    = BrowserLocalStorage.getInstance().useSection<PDVStorageValue>('pdv');

  public setUserAccumulatedPDV(walletAddress: Wallet['address'], pdv: PDV[]): Promise<void> {
    return this.getUserPDVStorage(walletAddress).set('accumulated', pdv);
  }

  public getUserAccumulatedPDV(walletAddress: Wallet['address']): Promise<PDV[]> {
    return this.getUserPDVStorage(walletAddress).get('accumulated').then((pdvs) => pdvs || []);
  }

  public getUserAccumulatedPDVChanges(walletAddress: Wallet['address']): Observable<PDV[]> {
    const userPDVStorage = this.getUserPDVStorage(walletAddress);

    return defer(() => userPDVStorage.get('accumulated')).pipe(
      mergeMap((accumulated) => userPDVStorage.onChange('accumulated').pipe(
        startWith(accumulated),
      )),
      map((accumulated) => accumulated || []),
    );
  }

  private getUserPDVStorage(walletAddress: Wallet['address']): BrowserStorage<PDVStorageUserValue> {
    return this.browserStorage.useSection<PDVStorageUserValue>(walletAddress);
  }

  public clear(): Promise<void> {
    return this.browserStorage.clear();
  }

  public clearUserPDV(walletAddress: Wallet['address']): Promise<void> {
    return this.browserStorage.useSection(walletAddress).clear();
  }
}

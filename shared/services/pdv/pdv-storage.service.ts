import { defer, Observable } from 'rxjs';
import { mergeMap, startWith } from 'rxjs/operators';
import { PDVItem, PDVType, Wallet } from 'decentr-js';

import { BrowserLocalStorage, BrowserStorage } from '../browser-storage';

export type AccumulatedPDV = Record<PDVType, PDVItem[]>;

interface PDVStorageUserValue {
  accumulated: AccumulatedPDV;
  readyToSend: PDVItem[][];
}

type PDVStorageValue = Record<Wallet['address'], PDVStorageUserValue>;

export class PDVStorageService {
  private readonly browserStorage
    = BrowserLocalStorage.getInstance().useSection<PDVStorageValue>('pdv');

  public setUserPDV(walletAddress: Wallet['address'], pdv: AccumulatedPDV): Promise<void> {
    return this.getUserPDVStorage(walletAddress).set('accumulated', pdv);
  }

  public getUserPDV(walletAddress: Wallet['address']): Promise<AccumulatedPDV> {
    return this.getUserPDVStorage(walletAddress).get('accumulated');
  }

  public getUserPDVChanges(walletAddress: Wallet['address']): Observable<AccumulatedPDV> {
    const userPDVStorage = this.getUserPDVStorage(walletAddress);

    return defer(() => userPDVStorage.get('accumulated')).pipe(
      mergeMap((accumulated) => userPDVStorage.onChange('accumulated').pipe(
        startWith(accumulated),
      )),
    );
  }

  public setUserReadyToSend(walletAddress: Wallet['address'], blocks: PDVItem[][]): Promise<void> {
    return this.getUserPDVStorage(walletAddress).set('readyToSend', blocks);
  }

  public getUserReadyToSend(walletAddress: Wallet['address']): Promise<PDVItem[][]> {
    return this.getUserPDVStorage(walletAddress).get('readyToSend');
  }

  public getUserReadyToSendChanges(walletAddress: Wallet['address']): Observable<PDVItem[][]> {
    const userPDVStorage = this.getUserPDVStorage(walletAddress);

    return defer(() => userPDVStorage.get('readyToSend')).pipe(
      mergeMap((readyToSend) => userPDVStorage.onChange('readyToSend').pipe(
        startWith(readyToSend),
      )),
    );
  }

  private getUserPDVStorage(walletAddress: Wallet['address']): BrowserStorage<PDVStorageUserValue> {
    return this.browserStorage.useSection<PDVStorageUserValue>(walletAddress);
  }
}

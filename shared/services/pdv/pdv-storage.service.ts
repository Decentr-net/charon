import { defer, Observable } from 'rxjs';
import { mergeMap, startWith } from 'rxjs/operators';
import { PDV, Wallet } from 'decentr-js';

import { uuid } from '../../utils/uuid';
import { BrowserLocalStorage, BrowserStorage } from '../browser-storage';

interface PDVBlock {
  id: string;
  pDVs: PDV[];
}

interface PDVStorageUserValue {
  accumulated: PDV[];
  readyBlocks: PDVBlock[];
}

type PDVStorageValue = Record<Wallet['address'], PDVStorageUserValue>;

export class PDVStorageService {
  private readonly browserStorage
    = BrowserLocalStorage.getInstance().useSection<PDVStorageValue>('pdv');

  public setUserAccumulatedPDV(walletAddress: Wallet['address'], pdv: PDV[]): Promise<void> {
    return this.getUserPDVStorage(walletAddress).set('accumulated', pdv);
  }

  public getUserAccumulatedPDV(walletAddress: Wallet['address']): Promise<PDV[]> {
    return this.getUserPDVStorage(walletAddress).get('accumulated');
  }

  public getUserAccumulatedPDVChanges(walletAddress: Wallet['address']): Observable<PDV[]> {
    const userPDVStorage = this.getUserPDVStorage(walletAddress);

    return defer(() => userPDVStorage.get('accumulated')).pipe(
      mergeMap((accumulated) => userPDVStorage.onChange('accumulated').pipe(
        startWith(accumulated),
      )),
    );
  }

  public addUserReadyBlock(walletAddress: Wallet['address'], pDVs: PDVBlock['pDVs']): Promise<void> {
    return this.getUserReadyBlocks(walletAddress).then((blocks) => {
      return this.setUserReadyBlocks(walletAddress, [...blocks || [], { id: uuid(), pDVs }]);
    });
  }

  public getUserReadyBlocks(walletAddress: Wallet['address']): Promise<PDVBlock[]> {
    return this.getUserPDVStorage(walletAddress).get('readyBlocks');
  }

  public getUserReadyBlocksChanges(walletAddress: Wallet['address']): Observable<PDVBlock[]> {
    const userPDVStorage = this.getUserPDVStorage(walletAddress);

    return defer(() => userPDVStorage.get('readyBlocks')).pipe(
      mergeMap((readyToSend) => userPDVStorage.onChange('readyBlocks').pipe(
        startWith(readyToSend),
      )),
    );
  }

  public removeUserReadyBlock(walletAddress: Wallet['address'], id: string): Promise<void> {
    return this.getUserReadyBlocks(walletAddress).then((blocks) => {
      return this.setUserReadyBlocks(walletAddress, (blocks || []).filter((block) => block.id !== id));
    });
  }

  public setUserReadyBlocks(walletAddress: Wallet['address'], blocks: PDVBlock[]): Promise<void> {
    return this.getUserPDVStorage(walletAddress).set('readyBlocks', blocks);
  }

  private getUserPDVStorage(walletAddress: Wallet['address']): BrowserStorage<PDVStorageUserValue> {
    return this.browserStorage.useSection<PDVStorageUserValue>(walletAddress);
  }
}

import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';
import { PDV, PDVType, Wallet } from 'decentr-js';

import { uuid } from '../../utils/uuid';
import { BrowserLocalStorage, BrowserStorage } from '../browser-storage';

export interface PDVBlock {
  id: string;
  pDVs: PDV[];
}

export type PDVSettings = Record<Exclude<PDVType, PDVType.Profile>, boolean>;

interface PDVStorageUserValue {
  accumulated: PDV[];
  readyBlocks: PDVBlock[];
  settings: PDVSettings;
}

type PDVStorageValue = Record<Wallet['address'], PDVStorageUserValue>;

const DEFAULT_PDV_SETTINGS: PDVSettings = {
  [PDVType.AdvertiserId]: true,
  [PDVType.Cookie]: true,
  [PDVType.Location]: true,
  [PDVType.SearchHistory]: true,
};

@Injectable()
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

  public getUserReadyBlock(walletAddress: Wallet['address'], id: PDVBlock['id']): Promise<PDVBlock> {
    return this.getUserReadyBlocks(walletAddress).then((blocks) => {
      return blocks.find((block) => block.id === id);
    });
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

  public getUserSettingsChanges(walletAddress: Wallet['address']): Observable<PDVSettings> {
    const userPDVStorage = this.getUserPDVStorage(walletAddress);

    return defer(() => userPDVStorage.get('settings')).pipe(
      mergeMap((settings) => userPDVStorage.onChange('settings').pipe(
        startWith(settings),
      )),
      map((settings) => settings || DEFAULT_PDV_SETTINGS),
    );
  }

  public setUserSettings(walletAddress: Wallet['address'], settings: PDVSettings): Promise<void> {
    return this.getUserPDVStorage(walletAddress).set('settings', settings);
  }

  private getUserPDVStorage(walletAddress: Wallet['address']): BrowserStorage<PDVStorageUserValue> {
    return this.browserStorage.useSection<PDVStorageUserValue>(walletAddress);
  }

  public clear(): Promise<void> {
    return this.browserStorage.clear();
  }
}

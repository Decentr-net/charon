import { EMPTY, from, Observable, of, throwError, timer } from 'rxjs';
import {
  catchError,
  concatMap,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  mergeMap,
  reduce,
  repeat,
  retryWhen,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { PDV, PDVData, PDVDataType, Wallet } from 'decentr-js';

import CONFIG_SERVICE from '../config';
import { PDVBlock, PDVStorageService } from '../../../../../shared/services/pdv';
import { ONE_SECOND } from '../../../../../shared/utils/date';
import { whileUserActive } from '../auth/while-user-active';
import { sendPDV } from './api';
import { convertCookiesToPDVs } from './convert';
import { listenCookiesSet } from './events';
import { PDVDataUniqueStore } from './pdv-data-unique-store';

const configService = CONFIG_SERVICE;
const pdvStorageService = new PDVStorageService();

const mergePDVData = (left: PDVData[], right: PDVData[]): PDVData[] => {
  return [...left, ...right]
    .reduce((store, pdvData) => store.set(pdvData), new PDVDataUniqueStore())
    .getAll();
};

const isSamePDVs = (left: PDV, right: PDV): boolean => {
  return left.domain === right.domain && left.path === right.path;
}

const mergePDVs = (target: PDV[], source: PDV[]): PDV[] => {
  return source.reduce((acc, pdv) => {
    const existingPDV = acc.find((existing) => isSamePDVs(existing, pdv));

    if (existingPDV) {
      existingPDV.data = mergePDVData(existingPDV.data, pdv.data);
      return acc;
    }

    return [...acc, pdv];
  }, [...target]);
};

const mergePDVsIntoAccumulated = (walletAddress: Wallet['address'], pDVs: PDV[], revertOrder = false): Promise<void> => {
  return pdvStorageService.getUserAccumulatedPDV(walletAddress)
    .then((accumulated) => {
      return revertOrder
        ? mergePDVs(pDVs, accumulated || [])
        : mergePDVs(accumulated || [], pDVs);
    })
    .then((newAccumulated) => pdvStorageService.setUserAccumulatedPDV(walletAddress, newAccumulated));
};

const collectPDVIntoStorage = (): Observable<void> => {
  return whileUserActive((user) => listenCookiesSet({
    httpOnly: false,
    session: false,
  }).pipe(
    map((cookie) => ({ cookies: [cookie], pdvDataType: PDVDataType.Cookie })),
    takeUntil(timer(ONE_SECOND * 10)),
    reduce((acc, { cookies, pdvDataType }) => [
      ...acc,
      ...convertCookiesToPDVs(cookies, pdvDataType),
    ], []),
    concatMap((newPDVs) => mergePDVsIntoAccumulated(user.wallet.address, newPDVs)),
    repeat(),
  ));
};

const collectPDVItemsReadyBlocks = (): Observable<void> => {
  return whileUserActive((user) => {
    return pdvStorageService.getUserAccumulatedPDVChanges(user.wallet.address).pipe(
      filter(pDVs => pDVs?.length > 0),
      distinctUntilChanged((prev, curr) => prev.length === curr.length),
      debounceTime(ONE_SECOND),
      concatMap((pDVs) => configService.getPDVCountToSend().pipe(
        mergeMap(({ minPDVCount, maxPDVCount }) => {
          return pDVs.length >= minPDVCount
            ? of({
              readyBlockPDVs: pDVs.slice(0, maxPDVCount),
              restPDVs: pDVs.slice(maxPDVCount),
            })
            : EMPTY;
        }),
      )),
      concatMap(({ readyBlockPDVs, restPDVs }) => {
        return from(pdvStorageService.setUserAccumulatedPDV(user.wallet.address, restPDVs)).pipe(
          mergeMap(() => pdvStorageService.addUserReadyBlock(user.wallet.address, readyBlockPDVs)),
        );
      }),
    );
  });
};

const rollbackPDVBlock = (walletAddress: Wallet['address'], blockId: PDVBlock['id']): Promise<void> => {
  return pdvStorageService.getUserReadyBlock(walletAddress, blockId)
    .then((block) => pdvStorageService.removeUserReadyBlock(walletAddress, blockId).then(() => block.pDVs))
    .then((pDVs) => mergePDVsIntoAccumulated(walletAddress, pDVs, true));
};

const processedBlocks = new Set<string>();

const initSendPDVBlocks = (): Observable<void> => {
  return whileUserActive((user) => {
    return pdvStorageService.getUserReadyBlocksChanges(user.wallet.address).pipe(
      map((blocks) => (blocks || []).filter((block) => !processedBlocks.has(block.id))),
      filter((blocksToProcess) => blocksToProcess.length > 0),
      mergeMap((blocksToProcess) => from(blocksToProcess)),
      tap((block) => processedBlocks.add(block.id)),
      mergeMap((block) => sendPDV(user.wallet, block.pDVs).pipe(
        catchError((error) => {
          if (error?.response?.status === 400) {
            configService.forceUpdate();
            return from(rollbackPDVBlock(user.wallet.address, block.id)).pipe(
              mapTo(EMPTY),
            );
          }

          return throwError(error);
        }),
        retryWhen((errors) => errors.pipe(
          delay(ONE_SECOND * 20),
        )),
        mapTo(block.id),
      )),
      concatMap((blockId) => {
        processedBlocks.delete(blockId);
        return pdvStorageService.removeUserReadyBlock(user.wallet.address, blockId);
      }),
      mapTo(void 0),
    );
  });
};

export const initCookiesCollection = (): Observable<void> => {
  return new Observable<void>((subscriber) => {
    const subscriptions = [
      initSendPDVBlocks().subscribe(() => subscriber.next()),
      collectPDVItemsReadyBlocks().subscribe(),
      collectPDVIntoStorage().subscribe(),
    ];

    return () => subscriptions.map((sub) => sub.unsubscribe());
  });
}

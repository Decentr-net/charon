import { EMPTY, from, merge, Observable, of, throwError, timer } from 'rxjs';
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

import { ONE_SECOND } from '../../../../../shared/utils/date';
import CONFIG_SERVICE from '../config';
import { whileUserActive } from '../auth/while-user-active';
import { sendPDV } from './api';
import { listenCookiePDVs } from './cookies';
import { listenSearchHistoryPDVs } from './search-history';
import { mergePDVsIntoAccumulated, PDV_STORAGE_SERVICE, rollbackPDVBlock } from './storage';

const configService = CONFIG_SERVICE;

const pDVsSource = merge(
  listenCookiePDVs(),
  listenSearchHistoryPDVs(),
);

const collectPDVIntoStorage = (): Observable<void> => {
  return whileUserActive((user) => pDVsSource.pipe(
    takeUntil(timer(ONE_SECOND * 10)),
    reduce((acc, pdv) => [
      ...acc,
      pdv,
    ], []),
    filter((newPDVs) => newPDVs.length > 0),
    concatMap((newPDVs) => mergePDVsIntoAccumulated(user.wallet.address, newPDVs)),
    repeat(),
  ));
};

const collectPDVItemsReadyBlocks = (): Observable<void> => {
  return whileUserActive((user) => {
    return PDV_STORAGE_SERVICE.getUserAccumulatedPDVChanges(user.wallet.address).pipe(
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
        return from(PDV_STORAGE_SERVICE.setUserAccumulatedPDV(user.wallet.address, restPDVs)).pipe(
          mergeMap(() => PDV_STORAGE_SERVICE.addUserReadyBlock(user.wallet.address, readyBlockPDVs)),
        );
      }),
    );
  });
};

const processedBlocks = new Set<string>();

const initSendPDVBlocks = (): Observable<void> => {
  return whileUserActive((user) => {
    return PDV_STORAGE_SERVICE.getUserReadyBlocksChanges(user.wallet.address).pipe(
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
        return PDV_STORAGE_SERVICE.removeUserReadyBlock(user.wallet.address, blockId);
      }),
      mapTo(void 0),
    );
  });
};

export const initPDVCollection = (): Observable<void> => {
  return new Observable<void>((subscriber) => {
    const subscriptions = [
      initSendPDVBlocks().subscribe(() => subscriber.next()),
      collectPDVItemsReadyBlocks().subscribe(),
      collectPDVIntoStorage().subscribe(),
    ];

    return () => subscriptions.map((sub) => sub.unsubscribe());
  });
}

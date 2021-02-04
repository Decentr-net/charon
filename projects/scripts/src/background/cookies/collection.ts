import { EMPTY, from, merge, Observable, of, timer } from 'rxjs';
import {
  concatMap,
  delay,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  mergeMap,
  repeat,
  retryWhen,
  scan,
  takeLast,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { Cookies } from 'webextension-polyfill-ts';
import Cookie = Cookies.Cookie;
import { PDV, PDVData, PDVDataType } from 'decentr-js';

import { environment } from '../../../../../environments/environment';
import { ConfigService } from '../../../../../shared/services/configuration';
import { PDVStorageService } from '../../../../../shared/services/pdv';
import { ONE_SECOND } from '../../../../../shared/utils/date';
import { whileUserActive } from '../auth/while-user-active';
import { sendPDV } from './api';
import { convertCookiesToPDV } from './convert';
import { listenCookiesSet, listenLoginCookies } from './events';
import { groupCookiesByDomainAndPath } from './grouping';
import { PDVDataUniqueStore } from './pdv-data-unique-store';

const configService = new ConfigService(environment);
const pdvStorageService = new PDVStorageService();

const mergePDVData = (left: PDVData[], right: PDVData[]): PDVData[] => {
  return [...left, ...right]
    .reduce((store, pdvData) => store.set(pdvData), new PDVDataUniqueStore())
    .getAll();
};

const isSamePDV = (left: PDV, right: PDV): boolean => {
  return left.domain === right.domain
    && left.path === right.path
    && left.user_agent === right.user_agent;
}

const mergePDVs = (left: PDV[], right: PDV[]): PDV[] => {
  return right.reduce((acc, pdv) => {
    const existingPDV = acc.find((existing) => isSamePDV(existing, pdv));

    if (existingPDV) {
      existingPDV.data = mergePDVData(existingPDV.data, pdv.data);
      return acc;
    }

    return [...acc, pdv];
  }, [...left]);
};

const convertCookiesToPDVs = (cookies: Cookie[], pdvDataType: PDVDataType): PDV[] => {
  return groupCookiesByDomainAndPath(cookies).map((group) => {
    return convertCookiesToPDV(group.cookies, group.domain, group.path, pdvDataType);
  });
}

const collectPDVIntoStorage = (): Observable<void> => {
  return whileUserActive((user) => merge(
    listenLoginCookies([
      ...user.usernames,
      ...user.emails,
      user.primaryEmail,
    ]).pipe(
      map((cookies) => cookies.filter((cookie) => !cookie.httpOnly && !cookie.session)),
      filter((cookies) => cookies.length > 0),
      map((cookies) => ({ cookies, pdvDataType: PDVDataType.LoginCookie })),
    ),
    listenCookiesSet({
      httpOnly: false,
      session: false,
    }).pipe(
      map((cookie) => ({ cookies: [cookie], pdvDataType: PDVDataType.Cookie })),
    ),
  ).pipe(
    scan((acc, { cookies, pdvDataType }) => [
      ...acc,
      ...convertCookiesToPDVs(cookies, pdvDataType),
    ], []),
    takeUntil(timer(ONE_SECOND * 5)),
    takeLast(1),
    concatMap((newPDVs) => {
      return from(pdvStorageService.getUserAccumulatedPDV(user.wallet.address)).pipe(
        map((accumulated) => mergePDVs(accumulated || [], newPDVs)),
      );
    }),
    mergeMap((newAccumulated) => pdvStorageService.setUserAccumulatedPDV(user.wallet.address, newAccumulated)),
    repeat(),
  ));
};

const collectPDVItemsReadyBlocks = (): Observable<void> => {
  return whileUserActive((user) => {
    return pdvStorageService.getUserAccumulatedPDVChanges(user.wallet.address).pipe(
      filter(pDVs => pDVs?.length > 0),
      distinctUntilChanged((prev, curr) => prev.length === curr.length),
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

const processedBlocks = new Set<string>();

const initSendPDVBlocks = (): Observable<void> => {
  return whileUserActive((user) => {
    return pdvStorageService.getUserReadyBlocksChanges(user.wallet.address).pipe(
      map((blocks) => (blocks || []).filter((block) => !processedBlocks.has(block.id))),
      filter((blocksToProcess) => blocksToProcess.length > 0),
      tap((blocksToProcess) => blocksToProcess.forEach(({ id }) => processedBlocks.add(id))),
      mergeMap((blocksToProcess) => from(blocksToProcess)),
      mergeMap((block) => sendPDV(user.wallet, block.pDVs).pipe(
        retryWhen((errors) => errors.pipe(
          delay(ONE_SECOND * 10),
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
      collectPDVIntoStorage().subscribe(),
      collectPDVItemsReadyBlocks().subscribe(),
      initSendPDVBlocks().subscribe(() => subscriber.next()),
    ];

    return () => subscriptions.map((sub) => sub.unsubscribe());
  });
}

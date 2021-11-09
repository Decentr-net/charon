import { HttpStatusCode } from '@angular/common/http';
import { defer, EMPTY, merge, Observable, of, partition, pipe, throwError, timer } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  distinctUntilChanged,
  filter,
  mergeMap,
  pluck,
  reduce,
  repeat,
  repeatWhen,
  retryWhen,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { PDV, PDVType, Wallet } from 'decentr-js';

import { SettingsService } from '../../../../../shared/services/settings';
import { ONE_MINUTE, ONE_SECOND } from '../../../../../shared/utils/date';
import CONFIG_SERVICE from '../config';
import { whileUserActive } from '../auth/while-user-active';
import { sendPDV } from './api';
import { listenAdvertiserPDVs } from './advertiser-id';
import { listenCookiePDVs } from './cookies';
import { listenSearchHistoryPDVs } from './search-history';
import { mergePDVsIntoAccumulated, PDV_STORAGE_SERVICE } from './storage';
import { listenLocationPDVs } from './location';

const configService = CONFIG_SERVICE;
const settingsService = new SettingsService();

const whilePDVAllowed = (pdvType: PDVType, walletAddress: Wallet['address']) => {
  const pdvSettingsService = settingsService.getUserSettingsService(walletAddress).pdv;

  const settingStatus$ = pdvSettingsService.getCollectionConfirmed().pipe(
    switchMap((isCollectionConfirmed) => isCollectionConfirmed
      ? pdvSettingsService.getCollectedPDVTypes().pipe(
        pluck(pdvType),
        distinctUntilChanged(),
      )
      : of(false)
    ),
  );

  const [allowed$, forbidden$] = partition(settingStatus$, (value: boolean) => value);

  return pipe(
    takeUntil(forbidden$),
    repeatWhen(() => allowed$),
  );
};

const PDV_SOURCE_MAP: Record<Exclude<PDVType, PDVType.Profile>, () => Observable<PDV>> = {
  [PDVType.Cookie]: listenCookiePDVs,
  [PDVType.Location]: listenLocationPDVs,
  [PDVType.SearchHistory]: listenSearchHistoryPDVs,
  [PDVType.AdvertiserId]: listenAdvertiserPDVs,
};

const getAllPDVSource = (walletAddress: Wallet['address']) => merge(
  ...Object.entries(PDV_SOURCE_MAP).map(([pdvType, source]) => {
    return source().pipe(
      whilePDVAllowed(pdvType as PDVType, walletAddress),
    );
  }),
);

const collectPDVIntoStorage = (): Observable<void> => {
  return whileUserActive((user) => getAllPDVSource(user.wallet.address).pipe(
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

const sendPDVBlocks = (): Observable<void> => {
  return whileUserActive((user) => {
    return PDV_STORAGE_SERVICE.getUserAccumulatedPDVChanges(user.wallet.address).pipe(
      concatMap((accumulated) => configService.getPDVCountToSend().pipe(
        mergeMap(({ maxPDVCount }) => {
          return accumulated.length >= maxPDVCount
            ? of({
              toSend: accumulated.slice(0, maxPDVCount),
              rest: accumulated.slice(maxPDVCount),
            })
            : EMPTY;
        }),
      )),
      concatMap(({ toSend, rest }) => {
        return defer(() => PDV_STORAGE_SERVICE.setUserAccumulatedPDV(user.wallet.address, rest)).pipe(
          mergeMap(() => sendPDV(user.wallet, toSend)),
          catchError((error) => {
            const errorStatus = error?.response?.status;

            if (errorStatus !== HttpStatusCode.TooManyRequests) {
              configService.forceUpdate();
            }

            return defer(() => mergePDVsIntoAccumulated(user.wallet.address, toSend, true)).pipe(
              mergeMap(() => throwError(errorStatus)),
            );
          }),
        );
      }),
      retryWhen((errorStatus: Observable<number>) => errorStatus.pipe(
        delay(ONE_MINUTE * 5),
      )),
    );
  });
}

export const initPDVCollection = (): Observable<void> => {
  return new Observable<void>((subscriber) => {
    const subscriptions = [
      sendPDVBlocks().subscribe(() => subscriber.next()),
      collectPDVIntoStorage().subscribe(),
    ];

    return () => subscriptions.map((sub) => sub.unsubscribe());
  });
}

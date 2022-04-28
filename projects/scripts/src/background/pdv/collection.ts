import { HttpStatusCode } from '@angular/common/http';
import {
  bufferTime,
  defer,
  EMPTY,
  merge,
  Observable,
  of,
  partition,
  pipe,
  throwError,
} from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  pluck,
  repeat,
  retry,
  shareReplay,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { PDV, PDVType, Wallet } from 'decentr-js';

import { SettingsService } from '../../../../../shared/services/settings/settings.service';
import { ONE_MINUTE, ONE_SECOND } from '../../../../../shared/utils/date';
import CONFIG_SERVICE from '../config';
import { whileUserActive } from '../auth/while-user-active';
import { whileNoMaintenance } from '../technical';
import { blacklist$, sendPDV, validatePDV } from './api';
import { listenAdvertiserPDVs } from './advertiser-id';
import { listenCookiePDVs } from './cookies';
import { listenSearchHistoryPDVs } from './search-history';
import { mergePDVsIntoAccumulated, PDV_STORAGE_SERVICE } from './storage';
import { listenLocationPDVs } from './location';
import { isCookiePDV } from './is-pdv';

const configService = CONFIG_SERVICE;
const settingsService = new SettingsService();

const whilePDVAllowed = (pdvType: PDVType, walletAddress: Wallet['address']) => {
  const pdvSettingsService = settingsService.getUserSettingsService(walletAddress).pdv;

  const settingStatus$ = pdvSettingsService.getCollectionConfirmed().pipe(
    shareReplay(1),
    switchMap((isCollectionConfirmed) => isCollectionConfirmed
      ? pdvSettingsService.getCollectedPDVTypes().pipe(
        pluck(pdvType),
      )
      : of(false),
    ),
    distinctUntilChanged(),
  );

  const [allowed$, forbidden$] = partition(settingStatus$, (value: boolean) => value);

  return pipe(
    takeUntil(forbidden$),
    repeat({
      delay: () => allowed$,
    }),
  );
};

const isPDVBlacklisted = (pdv: PDV): Observable<boolean> => {
  return blacklist$.pipe(
    map((blacklist) => {
      if (isCookiePDV(pdv)) {
        return blacklist.cookieSource.some((bannedSource) => pdv.source.host.includes(bannedSource));
      }

      return false;
    }),
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
      mergeMap((pdv: PDV) => isPDVBlacklisted(pdv).pipe(
        map((isBlacklisted) => isBlacklisted ? void 0 : pdv),
      )),
      filter((pdv) => !!pdv),
    );
  }),
);

const collectPDVIntoStorage = (): Observable<void> => {
  return whileUserActive((user) => getAllPDVSource(user.wallet.address).pipe(
    bufferTime(ONE_SECOND * 10),
    filter((newPDVs) => newPDVs.length > 0),
    concatMap((newPDVs) => mergePDVsIntoAccumulated(user.wallet.address, newPDVs)),
  ));
};

const sendPDVBlocks = (): Observable<void> => {
  let isProcessing = false;

  return whileUserActive((user) => {
    return PDV_STORAGE_SERVICE.getUserAccumulatedPDVChanges(user.wallet.address).pipe(
      filter(() => !isProcessing),
      tap(() => isProcessing = true),
      concatMap((accumulated) => configService.getPDVCountToSend().pipe(
        mergeMap(({ maxPDVCount }) => {
          if (accumulated.length >= maxPDVCount) {
            return of({
              toSend: accumulated.slice(0, maxPDVCount),
              rest: accumulated.slice(maxPDVCount),
            });
          }

          isProcessing = false;
          return EMPTY;
        }),
      )),
      concatMap(({ toSend, rest }) => {
        return defer(() => PDV_STORAGE_SERVICE.setUserAccumulatedPDV(user.wallet.address, rest)).pipe(
          mergeMap(() => sendPDV(toSend, user.wallet.privateKey)),
          delay(ONE_MINUTE),
          tap(() => isProcessing = false),
          catchError((error) => {
            const errorStatus = error?.response?.status;

            if (errorStatus !== HttpStatusCode.TooManyRequests) {
              configService.forceUpdate();
            }

            const validPDV$ = errorStatus === HttpStatusCode.BadRequest
              ? validatePDV(toSend).pipe(
                map((invalidPDVIndexes) => toSend.filter(({}, i) => !invalidPDVIndexes.includes(i))),
                catchError(() => of([])),
              )
              : of(toSend);

            return validPDV$.pipe(
              mergeMap((validPDV) => mergePDVsIntoAccumulated(user.wallet.address, validPDV, true)),
              tap(() => isProcessing = false),
              mergeMap(() => throwError(() => error)),
            );
          }),
        );
      }),
      retry({
        delay: ONE_MINUTE * 5,
      }),
    );
  });
};

export const initPDVCollection = (): Observable<void> => merge(
  collectPDVIntoStorage(),
  sendPDVBlocks().pipe(
    whileNoMaintenance,
  ),
);

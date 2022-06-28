import { combineLatest, firstValueFrom, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { CerberusClient, DecentrClient, Decimal, Price, SentinelClient, TheseusClient } from 'decentr-js';

import { NetworkBrowserStorageService } from '../../../../shared/services/network-storage';
import { AuthBrowserStorageService } from '../../../../shared/services/auth';
import { ONE_SECOND } from '../../../../shared/utils/date';
import { DEFAULT_DENOM } from '../../../charon/src/app/core/services/sentinel/sentinel.definitions';
import CONFIG_SERVICE from './config';

const DECENTR_CLIENT$: Observable<DecentrClient> = (() => {
  const networkStorage = new NetworkBrowserStorageService();

  const clientSource$ = new ReplaySubject<DecentrClient>(1);

  combineLatest([
    networkStorage.getActiveAPI(),
    new AuthBrowserStorageService().getActiveUser(),
  ]).pipe(
    tap(() => clientSource$.next(undefined)),
    debounceTime(ONE_SECOND),
    switchMap(([api, user]) => DecentrClient.create(api, user?.wallet?.privateKey)),
  ).subscribe(clientSource$);

  return clientSource$.pipe(
    filter(Boolean),
    take(1),
  );
})();

const CERBERUS_CLIENT$: Observable<CerberusClient> = (() => {
  const clientSource$ = new ReplaySubject<CerberusClient>(1);

  CONFIG_SERVICE.getCerberusUrl().pipe(
    tap(() => clientSource$.next(undefined)),
    debounceTime(ONE_SECOND),
    map((api) => new CerberusClient(api)),
  ).subscribe(clientSource$);

  return clientSource$.pipe(
    filter(Boolean),
    take(1),
  );
})();

const THESEUS_CLIENT$: Observable<TheseusClient> = (() => {
  const clientSource$ = new ReplaySubject<TheseusClient>(1);

  CONFIG_SERVICE.getTheseusUrl().pipe(
    tap(() => clientSource$.next(undefined)),
    debounceTime(ONE_SECOND),
    map((api) => new TheseusClient(api)),
  ).subscribe(clientSource$);

  return clientSource$.pipe(
    filter(Boolean),
    take(1),
  );
})();

const SENTINEL_CLIENT$: Observable<SentinelClient> = (() => {
  const clientSource$ = new ReplaySubject<SentinelClient>(1);

  combineLatest([
    CONFIG_SERVICE.getVpnUrl(),
    new AuthBrowserStorageService().getActiveUser(),
  ]).pipe(
    debounceTime(ONE_SECOND),
    tap(() => clientSource$.next(undefined)),
    switchMap(([api, user]) => SentinelClient.create(api, {
      gasPrice: new Price(Decimal.fromUserInput('1.7', 6), DEFAULT_DENOM),
      privateKey: user?.wallet?.privateKey,
    })),
  ).subscribe(clientSource$);

  return clientSource$.pipe(
    filter(Boolean),
    take(1),
  );
})();

export const getDecentrClient = () => firstValueFrom(DECENTR_CLIENT$);
export const getCerberusClient = () => firstValueFrom(CERBERUS_CLIENT$);
export const getTheseusClient = () => firstValueFrom(THESEUS_CLIENT$);
export const getSentinelClient = () => firstValueFrom(SENTINEL_CLIENT$);

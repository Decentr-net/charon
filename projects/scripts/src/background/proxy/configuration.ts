import { combineLatest, EMPTY, merge, Observable, of, timer } from 'rxjs';
import { catchError, filter, map, mapTo, mergeMap, share, startWith, switchMap, tap } from 'rxjs/operators';

import { clearProxy, getActiveProxySettings, isSelfProxyEnabled } from '../../../../../shared/utils/browser';
import { ONE_SECOND } from '../../../../../shared/utils/date';
import CONFIG_SERVICE from '../config';
import { pingProxyServer } from './ping';

export const handleProxyStatus = (): Observable<void> => {
  const checkTimer$ = isSelfProxyEnabled().pipe(
    switchMap((enabled) => enabled ? timer(0, ONE_SECOND * 20) : EMPTY),
    tap(() => CONFIG_SERVICE.forceUpdate()),
    startWith(void 0),
    share(),
  );

  const createProxyAddress = (host: string, port: string | number): string => [host, port].join(':');

  const proxyConfigDisabled$ = checkTimer$.pipe(
    switchMap(() => CONFIG_SERVICE.getVPNSettings()),
    filter((settings) => !settings.enabled),
  );

  const proxyServerDisabled$ = checkTimer$.pipe(
    switchMap(() => combineLatest([
      getActiveProxySettings(),
      CONFIG_SERVICE.getVPNSettings().pipe(
        map((settings) => settings.servers || []),
      )]),
    ),
    filter(([settings, servers]) => servers.every((server) => {
      return createProxyAddress(settings.host, settings.port) !== createProxyAddress(server.address, server.port);
    })),
  );

  const proxyServerNotAvailable$ = checkTimer$.pipe(
    switchMap(() => getActiveProxySettings()),
    filter((settings) => !!settings.host),
    mergeMap((settings) => pingProxyServer(settings.host)),
    mapTo(false),
    catchError(() => of(true)),
    filter(Boolean),
  );

  return merge(
    proxyConfigDisabled$,
    proxyServerDisabled$,
    proxyServerNotAvailable$,
  ).pipe(
    mergeMap(() => clearProxy()),
  );
};

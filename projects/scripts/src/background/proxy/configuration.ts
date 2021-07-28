import { combineLatest, EMPTY, merge, Observable, of, timer } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  mergeMap,
  pluck,
  share, skip,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';

import { clearProxy, getActiveProxySettings, isSelfProxyEnabled } from '../../../../../shared/utils/browser';
import { ONE_SECOND } from '../../../../../shared/utils/date';
import { compareSemver } from '../../../../../shared/utils/number';
import * as packageSettings from '../../../../../package.json';
import CONFIG_SERVICE from '../config';
import { pingProxyServer } from './ping';
import { AuthBrowserStorageService } from '../../../../../shared/services/auth';

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

  const versionDeprecated$ = checkTimer$.pipe(
    switchMap(() => CONFIG_SERVICE.getAppMinVersionRequired()),
    filter((minVersion) => compareSemver(packageSettings.version, minVersion) < 0),
  );

  const userChanged$ = new AuthBrowserStorageService().getActiveUser().pipe(
    pluck('wallet', 'address'),
    distinctUntilChanged(),
    skip(1),
  );

  return merge(
    userChanged$,
    proxyConfigDisabled$,
    proxyServerDisabled$,
    proxyServerNotAvailable$,
    versionDeprecated$,
  ).pipe(
    mergeMap(() => clearProxy()),
  );
};

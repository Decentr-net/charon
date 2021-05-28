import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, mapTo, mergeMap, switchMap, take } from 'rxjs/operators';
import { browser } from 'webextension-polyfill-ts';

import {
  ExtensionProxySettings,
  getActiveProxySettings,
  isSelfProxyEnabled,
  listenProxyErrors,
  setExtensionIcon,
  setProxy,
} from '../../../../../shared/utils/browser';
import CONFIG_SERVICE from '../config';

const PROXY_AUTH_CREDENTIALS = {
  username: '',
  password: '',
};

const handleProxyErrors = (): Observable<void> => {
  return listenProxyErrors().pipe(
    mergeMap(() => getActiveProxySettings().pipe(
      take(1),
    )),
    mergeMap((settings: ExtensionProxySettings) => fetch(`http://${settings.host}`)),
    mapTo(void 0),
    catchError(() => setProxy(undefined)),
  );
};

const createAuthObservable = (): Observable<void> => {
  const event = browser.webRequest.onAuthRequired;

  const listener = () => ({ authCredentials: PROXY_AUTH_CREDENTIALS });

  return new Observable<void>(() => {
    event.addListener(
      listener,
      {
        urls: ['<all_urls>'],
      },
      ['blocking'],
    );

    return () => event.removeListener(listener);
  });
};

const handleProxyAuth = (): Observable<void> => {
  return getActiveProxySettings().pipe(
    switchMap((settings) => settings.levelOfControl === 'controlled_by_this_extension'
      ? createAuthObservable()
      : EMPTY
    ),
  );
};

export const initProxyHandlers = (): void => {
  handleProxyErrors().subscribe();
  handleProxyAuth().subscribe();

  CONFIG_SERVICE.getVPNSettings().pipe(
    filter((settings) => !settings.enabled),
  ).subscribe(() => {
    setProxy(undefined).then();
  });

  isSelfProxyEnabled().subscribe((isEnabled) => {
    const iconPaths = isEnabled
      ? {
        '16': 'assets/icons/16_active.png',
        '32': 'assets/icons/32_active.png',
      }
      : {
        '16': 'assets/icons/16.png',
        '32': 'assets/icons/32.png',
      };

    setExtensionIcon(iconPaths).then();
  });
};

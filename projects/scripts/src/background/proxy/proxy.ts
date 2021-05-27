import { EMPTY, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { browser } from 'webextension-polyfill-ts';

import { getActiveProxySettings, listenProxyErrors, setProxy } from '../../../../../shared/utils/browser';

const PROXY_AUTH_CREDENTIALS = {
  username: '',
  password: '',
};

const handleProxyErrors = (): Observable<void> => {
  return listenProxyErrors().pipe(
    tap(() => setProxy(undefined)),
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
};

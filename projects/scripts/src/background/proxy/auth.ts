import { Observable, partition } from 'rxjs';
import { repeatWhen, takeUntil } from 'rxjs/operators';
import { browser } from 'webextension-polyfill-ts';

import { isSelfProxyEnabled } from '../../../../../shared/utils/browser';

const PROXY_AUTH_CREDENTIALS = {
  username: '',
  password: '',
};

const createAuthRequestHandler = (): Observable<void> => {
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

export const handleProxyAuth = (): Observable<void> => {
  const [controlled$, uncontrolled$] = partition(
    isSelfProxyEnabled(),
    Boolean,
  );

  return createAuthRequestHandler().pipe(
    takeUntil(uncontrolled$),
    repeatWhen(() => controlled$),
  );
};

import { Observable, partition } from 'rxjs';
import { repeatWhen, takeUntil } from 'rxjs/operators';
import * as Browser from 'webextension-polyfill';

import { isSelfProxyEnabled } from '../../../../../shared/utils/browser';

const PROXY_AUTH_CREDENTIALS = {
  username: 'user-decentr',
  password: 'D>$en!rsdj343vs1p[db#',
};

const createAuthRequestHandler = (): Observable<void> => {
  const event = Browser.webRequest.onAuthRequired;

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

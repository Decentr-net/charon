import { merge, Observable, of } from 'rxjs';
import { catchError, filter, mergeMap, switchMap, take } from 'rxjs/operators';
import { browser, WebRequest } from 'webextension-polyfill-ts';
import OnErrorOccurredDetailsType = WebRequest.OnErrorOccurredDetailsType;

import {
  clearProxy,
  ExtensionProxySettings,
  getActiveProxySettings,
  listenProxyErrors,
} from '../../../../../shared/utils/browser';
import { pingProxyServer } from './ping';

const listenRequestsTimeout = (): Observable<void> => {
  return new Observable<void>((subscriber) => {
    const listener = (details: OnErrorOccurredDetailsType) => {
      if (details.error === 'net::ERR_TIMED_OUT') {
        subscriber.next();
      }
    };

    const onErrorOccurredEvent = browser.webRequest.onErrorOccurred;

    onErrorOccurredEvent.addListener(listener, { urls: ['<all_urls>'], });

    return () => onErrorOccurredEvent.removeListener(listener);
  });
};

export const handleProxyErrors = (): Observable<void> => {
  return merge(
    listenRequestsTimeout(),
    listenProxyErrors(),
  ).pipe(
    switchMap(() => getActiveProxySettings().pipe(
      take(1),
    )),
    filter((settings) => settings.levelOfControl === 'controlled_by_this_extension'),
    mergeMap((settings: ExtensionProxySettings) => pingProxyServer(settings.host)),
    filter((pingResponse: Response) => !pingResponse.ok),
    catchError(() => of(void 0)),
    mergeMap(() => clearProxy()),
  );
};

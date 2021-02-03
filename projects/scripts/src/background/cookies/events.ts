import { merge, Observable } from 'rxjs';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { browser, Cookies } from 'webextension-polyfill-ts';
import Cookie = Cookies.Cookie;
import OnChangedChangeInfoType = Cookies.OnChangedChangeInfoType;

import { ONE_SECOND } from '../../../../../shared/utils/date';
import { hasOwnProperty } from '../../../../../shared/utils/object';
import {
  listenRequestsBeforeRedirectWithBody,
  listenRequestsOnCompletedWithBody,
  requestBodyContains
} from '../requests';
import { getBrowserCookies } from './browser';

export const listenLoginCookies = (loginIdentifiers: string[]): Observable<Cookie[]> => {
  return merge(
    listenRequestsOnCompletedWithBody({}, 'POST'),
    listenRequestsBeforeRedirectWithBody({}, 'POST'),
  ).pipe(
    filter(request => requestBodyContains(request.requestBody, loginIdentifiers)),
    debounceTime(ONE_SECOND),
    switchMap(request => getBrowserCookies(new URL(request.url))),
  );
}

export const listenCookiesSet = (filter: Partial<Cookie> = {}): Observable<Cookie> => {
  return new Observable((subscriber) => {
    const listener = (changeInfo: OnChangedChangeInfoType) => {
      if (changeInfo.cause !== 'explicit' || changeInfo.removed) {
        return;
      }

      const cookie = changeInfo.cookie;

      if (Object.keys(filter).some(([key]) => {
        return hasOwnProperty(cookie, key as keyof Cookie) && cookie[key] !== filter[key];
      })) {
        return;
      }

      subscriber.next(cookie);
    };

    browser.cookies.onChanged.addListener(listener);

    return () => browser.cookies.onChanged.removeListener(listener);
  });
}

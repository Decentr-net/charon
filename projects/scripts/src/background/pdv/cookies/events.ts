import { Observable } from 'rxjs';
import { browser, Cookies } from 'webextension-polyfill-ts';
import Cookie = Cookies.Cookie;
import OnChangedChangeInfoType = Cookies.OnChangedChangeInfoType;

import { hasOwnProperty } from '../../../../../../shared/utils/object';

export const listenCookiesSet = (filter: Partial<Cookie> = {}): Observable<Cookie> => {
  return new Observable((subscriber) => {
    const listener = (changeInfo: OnChangedChangeInfoType) => {
      if (changeInfo.cause !== 'explicit' || changeInfo.removed) {
        return;
      }

      const cookie = changeInfo.cookie;

      if (!cookie.value || !cookie.name) {
        return;
      }

      if (Object.keys(filter).some((key) => {
        return hasOwnProperty(cookie, key as keyof Cookie) && cookie[key] !== filter[key];
      })) {
        return;
      }

      subscriber.next(cookie);
    };

    browser.cookies.onChanged.addListener(listener);

    return () => browser.cookies.onChanged.removeListener(listener);
  });
};

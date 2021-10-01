import { Observable } from 'rxjs';
import { browser, Cookies } from 'webextension-polyfill-ts';
import Cookie = Cookies.Cookie;
import OnChangedChangeInfoType = Cookies.OnChangedChangeInfoType;

export const listenCookiesSet = (): Observable<Cookie> => {
  return new Observable((subscriber) => {
    const listener = (changeInfo: OnChangedChangeInfoType) => {
      if (changeInfo.cause !== 'explicit' || changeInfo.removed) {
        return;
      }

      const cookie = changeInfo.cookie;

      if (
        !cookie.value
        || !cookie.name
        || cookie.httpOnly
        || cookie.session
        || cookie.name.includes('test')
      ) {
        return;
      }

      subscriber.next(cookie);
    };

    browser.cookies.onChanged.addListener(listener);

    return () => browser.cookies.onChanged.removeListener(listener);
  });
};

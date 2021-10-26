import { Observable } from 'rxjs';
import * as Browser from 'webextension-polyfill';

export const listenCookiesSet = (): Observable<Browser.Cookies.Cookie> => {
  return new Observable((subscriber) => {
    const listener = (changeInfo: Browser.Cookies.OnChangedChangeInfoType) => {
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

    Browser.cookies.onChanged.addListener(listener);

    return () => Browser.cookies.onChanged.removeListener(listener);
  });
};

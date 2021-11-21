import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Cookies } from 'webextension-polyfill';
import { CookiePDV, PDVType } from 'decentr-js';

import { listenCookiesSet } from './events';

export const parseExpirationDate = (expirationDate: number | undefined): number | undefined => {
  if (!expirationDate) {
    return undefined;
  }

  const expirationDateInt = Math.round(expirationDate);
  const isExpirationDateTooBig = expirationDateInt > Number.MAX_SAFE_INTEGER;
  return isExpirationDateTooBig ? undefined : expirationDateInt;
}

export const parseDomain = (domain: string): string | undefined => {
  const domainMatch = domain.match(/((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/);
  return domainMatch && domainMatch[0];
}

export const listenCookiePDVs = (): Observable<CookiePDV> => {
  return listenCookiesSet().pipe(
    filter((cookie) => !!parseDomain(cookie.domain)),
    map((cookie: Cookies.Cookie) => {
      const domain = parseDomain(cookie.domain);

      const expirationDate = parseExpirationDate(cookie.expirationDate);

      return {
        type: PDVType.Cookie,
        domain,
        expirationDate,
        hostOnly: cookie.hostOnly,
        name: cookie.name,
        path: cookie.path,
        sameSite: cookie.sameSite,
        secure: cookie.secure,
        source: {
          host: domain,
          path: cookie.path,
        },
        timestamp: new Date().toISOString(),
        value: cookie.value,
      };
    }),
  );
};

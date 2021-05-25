import { Observable } from 'rxjs';
import { CookiePDV, PDVType } from 'decentr-js';
import { map } from 'rxjs/operators';

import { listenCookiesSet } from './events';

export const listenCookiePDVs = (): Observable<CookiePDV> => {
  return listenCookiesSet({
    httpOnly: false,
    session: false,
  }).pipe(
    map((cookie) => {
      const domainMatch = cookie.domain.match(/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*$/);
      const domain = domainMatch && domainMatch[0] || cookie.domain;

      return {
        type: PDVType.Cookie,
        domain,
        expirationDate: Math.round(cookie.expirationDate),
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
  })
  );
}

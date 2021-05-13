import { Observable } from 'rxjs';
import { CookiePDV, PDVType } from 'decentr-js';
import { map } from 'rxjs/operators';

import { ONE_SECOND } from '../../../../../../shared/utils/date';
import { listenCookiesSet } from './events';

export const listenCookiePDVs = (): Observable<CookiePDV> => {
  return listenCookiesSet({
    httpOnly: false,
    session: false,
  }).pipe(
    map((cookie) => ({
      ...cookie,
      type: PDVType.Cookie,
      source: {
        host: cookie.domain,
        path: cookie.path,
      },
      timestamp: Math.round((Date.now() / ONE_SECOND)).toString(),
    })),
  );
}

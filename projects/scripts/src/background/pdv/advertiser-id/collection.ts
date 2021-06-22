import { Observable } from 'rxjs';
import { AdvertiserPDV, PDVType } from 'decentr-js';
import { filter, map } from 'rxjs/operators';

import { listenCookiesSet } from '../cookies/events';

export const listenAdvertiserPDVs = (): Observable<AdvertiserPDV> => {
  return listenCookiesSet({
    httpOnly: false,
    session: false,
  }).pipe(
    filter((cookie) => {
      return !!cookie.name.toLowerCase().match(/(^idfa_lower_md5)$/)
        || !!cookie.name.toLowerCase().match(/(^idfa_lower_sha1)$/)
        || !!cookie.name.toLowerCase().match(/(^idfa_upper_md5)$/)
        || !!cookie.name.toLowerCase().match(/(^idfa_upper_md5)$/)
        || !!cookie.name.toLowerCase().match(/(^idfa_upper_sha1)$/)
        || !!cookie.name.toLowerCase().match(/(^gaid([0-9a-zA-Z_]+)?)+$/)
        || !!cookie.name.toLowerCase().match(/(^aaid([0-9a-zA-Z_]+)?)+$/)
        || !!cookie.name.toLowerCase().match(/(^adid([0-9a-zA-Z_]+)?)+$/)
        || !!cookie.name.toLowerCase().match(/(^idfa([0-9a-zA-Z_]+)?)+$/)
        || !!cookie.name.toLowerCase().match(/(^ppid([0-9a-zA-Z_]+)?)+$/);
    }),
    map((cookie) => {
      console.log(cookie);

      return {
        type: PDVType.AdvertiserId,
        advertiser: cookie.name,
        id: cookie.value,
      };
    }),
  );
};

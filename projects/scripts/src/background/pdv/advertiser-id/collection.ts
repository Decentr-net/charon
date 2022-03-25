import { Observable } from 'rxjs';
import { AdvertiserPDV, PDVType } from 'decentr-js';
import { filter, map } from 'rxjs/operators';

import { ADVERTISERS } from './advertisers';
import { listenCookiesSet } from '../cookies/events';

export const listenAdvertiserPDVs = (): Observable<AdvertiserPDV> => {
  return listenCookiesSet().pipe(
    map((cookie) => {
      const advertiser = ADVERTISERS.find((advertiserConfig) => advertiserConfig.domainRegex.test(cookie.domain));

      if (!advertiser) {
        return undefined;
      }

      const isAdvertiserCookie = advertiser.cookieRegex.some((cookieRegex) => cookieRegex.test(cookie.name.toLowerCase()));

      if (!isAdvertiserCookie) {
        return undefined;
      }

      return {
        type: PDVType.AdvertiserId,
        advertiser: advertiser.advertiser,
        name: cookie.name,
        value: cookie.value,
      } as AdvertiserPDV;
    }),
    filter((PDV) => !!PDV),
  );
};

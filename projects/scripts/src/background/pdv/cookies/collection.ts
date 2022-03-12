import { EMPTY, from, mergeMap, Observable, ReplaySubject, tap } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CookiePDV, PDVType } from 'decentr-js';

import { trackDomains } from './domain-track';
import { listenCookiesSet } from './events';
import { UnapprovedStorage } from './unapproved-storage';

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

const listenAllCookiePDVs = (): Observable<CookiePDV> => listenCookiesSet().pipe(
  filter((cookie) => !!parseDomain(cookie.domain)),
  map((cookie) => {
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

const trackedDomains$ = new ReplaySubject<string[]>(1);
trackDomains().subscribe(trackedDomains$);

const unapprovedStorage = new UnapprovedStorage();
listenAllCookiePDVs().subscribe((pdv) => unapprovedStorage.add(pdv));

export const listenCookiePDVs = (): Observable<CookiePDV> => {
  return trackedDomains$.pipe(
    tap((domains) => unapprovedStorage.removeOldDomains(domains)),
    map((domains) => unapprovedStorage.ejectByDomains(domains)),
    mergeMap((pdvs) => pdvs.length ? from(pdvs) : EMPTY),
  );
};

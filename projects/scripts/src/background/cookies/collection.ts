import { from, merge, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Cookies } from 'webextension-polyfill-ts';
import Cookie = Cookies.Cookie;
import { PDVData, PDVItem, PDVType } from 'decentr-js';

// import { environment } from '../../../../../environments/environment';
// import { ConfigService } from '../../../../../shared/services/configuration';
import { AccumulatedPDV, PDVStorageService } from '../../../../../shared/services/pdv';
import { whileUserActive } from '../auth/while-user-active';
import { convertCookiesToPDVItem } from './convert';
import { listenCookiesSet, listenLoginCookies } from './events';
import { groupCookiesByDomainAndPath } from './grouping';
import { PDVDataUniqueStore } from './pdv-data-unique-store';

// const configService = new ConfigService(environment);

const mergePDVData = (left: PDVData[], right: PDVData[]): PDVData[] => {
  return [...left, ...right]
    .reduce((store, pdvData) => store.set(pdvData), new PDVDataUniqueStore())
    .getAll();
};

const isSamePDVItem = (left: PDVItem, right: PDVItem): boolean => {
  return left.domain === right.domain
    && left.path === right.path
    && left.user_agent === right.user_agent;
}

const mergePDVItems = (left: PDVItem[], right: PDVItem[]): PDVItem[] => {
  return right.reduce((acc, pdv) => {
    const existingPDV = acc.find((existing) => isSamePDVItem(existing, pdv));

    if (existingPDV) {
      console.log(existingPDV);
      // TODO: make decentr.js interfaces writable
      (existingPDV.data as any) = mergePDVData(existingPDV.data, pdv.data);
      return acc;
    }

    return [...acc, pdv];
  }, [...left]);
};

const mergeAccumulatedPDV = (left: Partial<AccumulatedPDV>, right: Partial<AccumulatedPDV>): AccumulatedPDV => {
  return Object.keys(right).reduce((acc, key) => ({
    ...acc,
    [key]: mergePDVItems(acc[key] || [], right[key]),
  }), { ...left }) as AccumulatedPDV;
};

const mergeCookiesWithAccumulatedPDV = (
  accumulatedPDV: AccumulatedPDV,
  cookiesWithPDVType: { cookies: Cookie[], pdvType: PDVType },
) => {
  const cookieGroups = groupCookiesByDomainAndPath(cookiesWithPDVType.cookies);
  const newPDVs = cookieGroups.map((group) => convertCookiesToPDVItem(group.cookies, group.domain, group.path));

  return mergeAccumulatedPDV(accumulatedPDV, { [cookiesWithPDVType.pdvType]: newPDVs });
};

const pdvStorageService = new PDVStorageService();

const collectPDVIntoStorage = (): Observable<void> => {
  return whileUserActive((user) => merge(
    listenLoginCookies([
      ...user.usernames,
      ...user.emails,
      user.primaryEmail,
    ]).pipe(
      map((cookies) => cookies.filter((cookie) => !cookie.httpOnly && !cookie.session)),
      filter((cookies) => cookies.length > 0),
      map((cookies) => ({ cookies, pdvType: PDVType.LoginCookie })),
    ),
    listenCookiesSet({
      httpOnly: false,
      session: false,
    }).pipe(
      map((cookie) => ({ cookies: [cookie], pdvType: PDVType.Cookie })),
    ),
  ).pipe(
    mergeMap((cookiesWithPDVType) => {
      return from(pdvStorageService.getUserPDV(user.wallet.address)).pipe(
        map((accumulated) => mergeCookiesWithAccumulatedPDV(accumulated, cookiesWithPDVType)),
      );
    }),
    mergeMap((newAccumulated) => pdvStorageService.setUserPDV(user.wallet.address, newAccumulated)),
  ));
};

export const initCookiesCollection = (): Observable<void> => {
  return new Observable<void>((subscriber) => {
    const storageSubscription = collectPDVIntoStorage().subscribe();

    const apiSubscription = whileUserActive((user) => {
      return pdvStorageService.getUserPDVChanges(user.wallet.address).pipe(
        map((accumulated) => {
          return Object.keys(accumulated).reduce((acc, pdvType) => ([
            ...acc,
            ...accumulated[pdvType].map((pdvItem) => ({ pdvItem, pdvType })),
          ]), []);
        }),
      );
    }).subscribe((allPDVs) => console.log(allPDVs.length))

    return () => {
      storageSubscription.unsubscribe();
      apiSubscription.unsubscribe();
    };
  });
}

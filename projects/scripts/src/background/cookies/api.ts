import { defer, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { Cookies } from 'webextension-polyfill-ts';
import { PDV, PDVType, Wallet } from 'decentr-js';
import Cookie = Cookies.Cookie;

import { environment } from '../../../../../environments/environment';
import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';
import { PDVService } from '../../../../../shared/services/pdv';
import QUEUE, { QueuePriority } from '../queue';

const pdvService = new PDVService(environment.chainId);
const networkStorage = new NetworkBrowserStorageService();

interface CookieGroup {
  domain: string;
  path: string;
  cookies: Cookie[];
}

export const groupCookiesByDomainAndPath = (cookies: Cookie[]): CookieGroup[] => {
  return cookies.reduce((acc, cookie) => {
    const group = acc.find((g) => g.domain === cookie.domain && g.path === cookie.path);
    if (group) {
      group.cookies.push(cookie);
      return acc;
    }
    return [...acc, { domain: cookie.domain, path: cookie.path, cookies: [cookie] }];
  }, []);
};

export const convertCookiesToPdv = (cookies: Cookie[], domain: string, path: string): PDV => {
  const pdvDomainMatch = domain.match(/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*$/);
  const pdvDomain = pdvDomainMatch && pdvDomainMatch[0] || domain;

  return {
    version: 'v1',
    pdv: {
      path,
      domain: pdvDomain,
      user_agent: window.navigator.userAgent,
      data: cookies.map((cookie) => ({
        domain: pdvDomain,
        path: path,
        version: 'v1',
        type: 'cookie',
        name: cookie.name,
        value: cookie.value,
        host_only: cookie.hostOnly,
        secure: cookie.secure,
        same_site: cookie.sameSite,
        expiration_date: cookie.expirationDate && Math.round(cookie.expirationDate),
      })),
    },
  };
};

export const sendCookies = (
  wallet: Wallet,
  pdvType: PDVType,
  cookies: Cookie[],
): Observable<void> => {
  const groupedCookies = groupCookiesByDomainAndPath(cookies);

  return defer(() => {
    return Promise.all(groupedCookies.map((group) => {
      return QUEUE.add(() => pdvService.sendPDV(
        networkStorage.getActiveNetworkInstant().api,
        wallet,
        pdvType,
        convertCookiesToPdv(group.cookies, group.domain, group.path),
      ), {
        priority: QueuePriority.Cookies,
      });
    }));
  }).pipe(
    mapTo(void 0),
  );
}

import { Observable } from 'rxjs';
import { browser, Cookies } from 'webextension-polyfill-ts';
import Cookie = Cookies.Cookie;
import { Wallet } from 'decentr-js';

import { NetworkBrowserStorageService } from '../../../shared/services/network-storage';
import { PDVService } from '../../../shared/services/pdv';
import { environment } from '../../../environments/environment';

const pdvService = new PDVService(environment.chainId);
const networkStorage = new NetworkBrowserStorageService();

export const getCookies = (
  url: URL,
): Promise<Cookie[]> => {
  return Promise.all([
    browser.cookies.getAll({
      url: `http://${url.hostname}`,
      session: false,
    }),
    browser.cookies.getAll({
      url: `https://${url.hostname}`,
      session: false,
    })
  ]).then(([http, https]) => [...http, ...https].filter(cookie => !cookie.httpOnly));
};

export const sendCookies = (
  wallet: Wallet,
  cookies: Cookie[],
): Observable<void> => {
  return pdvService.sendCookies(networkStorage.getActiveNetworkInstant().api, wallet, cookies);
}

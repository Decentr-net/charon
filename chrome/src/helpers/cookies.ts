import { browser, Cookies } from 'webextension-polyfill-ts';
import Cookie = Cookies.Cookie;

import { PDVService } from '../../../shared/services/pdv';
import { Wallet } from '../../../shared/models/wallet';
import { environment } from '../environments/environment';

const pdvService = new PDVService(environment.restApi);

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
  chainId: string,
  wallet: Wallet,
  cookies: Cookie[],
): Promise<void[]> => {
  return pdvService.sendCookies(chainId, wallet, cookies);
}

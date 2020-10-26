import { browser, Cookies } from 'webextension-polyfill-ts';
import Cookie = Cookies.Cookie;
import { User } from '../../../shared/models/user';

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
  walletAddress: User['walletAddress'],
  privateKey: User['privateKey'],
  cookies: Cookie[],
): void => {
}

import { Cookies } from 'webextension-polyfill-ts';
import Cookie = Cookies.Cookie;

export interface CookieGroup {
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

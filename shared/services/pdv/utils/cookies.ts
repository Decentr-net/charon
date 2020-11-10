import { Cookies } from 'webextension-polyfill-ts';
import Cookie = Cookies.Cookie;
import { PDV } from 'decentr-js';

export const groupCookiesByDomainAndPath = (cookies: Cookie[]): {
  domain: string;
  path: string;
  cookies: Cookie[];
}[] => {
  return cookies.reduce((acc, cookie) => {
    const group = acc.find((g) => g.domain === cookie.domain && g.path === cookie.path);
    if (group) {
      group.cookies.push(cookie);
      return acc;
    }
    return [...acc, { domain: cookie.domain, path: cookie.path, cookies: [cookie] }];
  }, [])
}

export const convertCookiesToPdv = (cookies: Cookie[], domain: string, path: string): PDV => {
  const pdvDomainMatch = domain.match(/\w+.\w+.\w+/);
  const pdvDomain = pdvDomainMatch && pdvDomainMatch[0] || domain;

  return {
    version: 'v1',
    pdv: {
      path,
      domain: pdvDomain,
      user_agent: window.navigator.userAgent,
      data: cookies.map((cookie) => ({
        domain: '*',
        path: '*',
        version: 'v1',
        type: 'cookie',
        name: cookie.name,
        value: cookie.value,
        host_only: cookie.hostOnly,
        secure: cookie.secure,
        same_site: cookie.sameSite,
        expiration_date: Math.round(cookie.expirationDate),
      })),
    },
  };
}

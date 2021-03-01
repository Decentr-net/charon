import { PDV, PDVDataType } from 'decentr-js';
import { Cookies } from 'webextension-polyfill-ts';
import Cookie = Cookies.Cookie;

import { groupCookiesByDomainAndPath } from './grouping';

const convertCookiesToPDV = (cookies: Cookie[], domain: string, path: string, pdvDataType: PDVDataType): PDV => {
  const pdvDomainMatch = domain.match(/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*$/);
  const pdvDomain = pdvDomainMatch && pdvDomainMatch[0] || domain;

  return {
    path,
    domain: pdvDomain,
    data: cookies.map((cookie) => ({
      domain: pdvDomain,
      path: path,
      type: pdvDataType,
      name: cookie.name,
      value: cookie.value,
      host_only: cookie.hostOnly,
      secure: cookie.secure,
      same_site: cookie.sameSite,
      expiration_date: cookie.expirationDate && Math.round(cookie.expirationDate),
    })),
  };
};

export const convertCookiesToPDVs = (cookies: Cookie[], pdvDataType: PDVDataType): PDV[] => {
  return groupCookiesByDomainAndPath(cookies).map((group) => {
    return convertCookiesToPDV(group.cookies, group.domain, group.path, pdvDataType);
  });
}

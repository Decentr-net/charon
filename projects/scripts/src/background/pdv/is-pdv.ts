import { CookiePDV, PDV } from 'decentr-js';

export const isCookiePDV = (pdv: PDV): pdv is CookiePDV => {
  return !!(pdv as CookiePDV).expirationDate;
};

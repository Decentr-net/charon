import { Cookies } from 'webextension-polyfill-ts';
import Cookie = Cookies.Cookie;

export class CookieUniqueStore {
  private store = new Map<string, Cookie>();

  public set(cookie: Cookie): this {
    this.store.set(CookieUniqueStore.getCookieHash(cookie), cookie);

    return this;
  }

  public getAll(): Cookie[] {
    return [...this.store.values()];
  }

  private static getCookieHash(cookie: Cookie): string {
    return `${cookie.domain}-${cookie.name}-${cookie.secure}-${cookie.hostOnly}-${cookie.sameSite}`;
  }
}

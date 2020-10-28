import { Decentr, signMessage } from 'decentr-js';
import { Cookies } from 'webextension-polyfill-ts';
import PQueue from 'p-queue';
import Cookie = Cookies.Cookie;

import { Wallet } from '../../models/wallet';
import { PDV } from './pdv.definitions';

export class PDVService {
  private static queue = new PQueue({ concurrency: 1 });

  constructor(private api: string) {
  }

  public sendCookies(chainId: string, wallet: Wallet, cookies: Cookie[]): Promise<void[]> {
    const decentr = this.createDecentrConnector(chainId);
    const groupedCookies = this.groupCookiesByDomainAndPath(cookies);

    return Promise.all(
      groupedCookies.map((group) => PDVService.queue.add(() => {
        return decentr.sendPDV(PDVService.convertToPDV(group.cookies, group.domain, group.path), wallet)
          .then((message) => this.broadcast(decentr, message, wallet.privateKey));
      })),
    );
  }

  public getBalance(chainId: string, walletAddress: string): Promise<number> {
    const decentr = this.createDecentrConnector(chainId);
    return decentr.get.tokenBalance(walletAddress)
  }
  
  public getPDVList(chainId: string, walletAddress: string): Promise<any> {
    const decentr = this.createDecentrConnector(chainId);
    return decentr.get.pdvList(walletAddress);
  }

  private static convertToPDV(cookies: Cookie[], domain: string, path: string): PDV {
    const pdvDomainMatch = domain.match(/\w+.\w+.\w+/);
    const pdvDomain = pdvDomainMatch && pdvDomainMatch[0] || domain;

    return {
      version: 'v1',
      pdv: {
        path,
        domain: pdvDomain,
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

  private broadcast(decentr: any, message: unknown, privateKey: string): Promise<void> {
    const signedMsg = signMessage(message, privateKey);
    return decentr.broadcastTx(signedMsg);
  }

  private createDecentrConnector(chainId: string): any {
    return new Decentr(this.api, chainId);
  }

  private groupCookiesByDomainAndPath(cookies: Cookie[]): {
    domain: string;
    path: string;
    cookies: Cookie[];
  }[] {
    return cookies.reduce((acc, cookie) => {
      const group = acc.find((g) => g.domain === cookie.domain && g.path === cookie.path);
      if (group) {
        group.cookies.push(cookie);
        return acc;
      }
      return [...acc, { domain: cookie.domain, path: cookie.path, cookies: [cookie] }];
    }, [])
  }
}

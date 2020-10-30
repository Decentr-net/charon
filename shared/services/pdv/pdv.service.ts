import { defer, forkJoin, Observable } from 'rxjs';
import { Decentr, signMessage } from 'decentr-js';
import { Cookies } from 'webextension-polyfill-ts';
import PQueue from 'p-queue';
import Cookie = Cookies.Cookie;

import { Wallet } from '../../models/wallet';
import { PDV, PDVDetails, PDVListItem, PDVStatItem } from './pdv.definitions';

export class PDVService {
  private static queue = new PQueue({ concurrency: 1 });

  constructor(private chainId: string) {
  }

  public sendCookies(api: string, wallet: Wallet, cookies: Cookie[]): Observable<void[]> {
    const decentr = this.createDecentrConnector(api);
    const groupedCookies = this.groupCookiesByDomainAndPath(cookies);

    return forkJoin(
      groupedCookies.map((group) => defer(() => PDVService.queue.add(() => {
        return decentr.sendPDV(PDVService.convertToPDV(group.cookies, group.domain, group.path), wallet)
          .then((message) => this.broadcast(decentr, message, wallet.privateKey));
      }))),
    );
  }

  public getBalance(api: string, walletAddress: Wallet['address']): Promise<number> {
    const decentr = this.createDecentrConnector(api);
    return decentr.get.tokenBalance(walletAddress).then(({ balance }) => balance);
  }
  
  public getPDVList(api: string, walletAddress: Wallet['address']): Promise<PDVListItem[]> {
    const decentr = this.createDecentrConnector(api);
    return decentr.get.pdvList(walletAddress);
  }

  public getPDVDetails(
    api: string,
    address: PDVListItem['address'],
    wallet: Wallet,
  ): Promise<PDVDetails> {
    const decentr = this.createDecentrConnector(api);
    return decentr.getPdvByAddress(address, wallet);
  }

  public getPDVStats(api: string, walletAddress: Wallet['address']): Promise<PDVStatItem[]> {
    const decentr = this.createDecentrConnector(api);
    return decentr.get.pdvStats(walletAddress);
  }

  private static convertToPDV(cookies: Cookie[], domain: string, path: string): PDV {
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

  private broadcast(decentr: any, message: unknown, privateKey: string): Promise<void> {
    const signedMsg = signMessage(message, privateKey);
    return decentr.broadcastTx(signedMsg);
  }

  private createDecentrConnector(api: string): any {
    return new Decentr(api, this.chainId);
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

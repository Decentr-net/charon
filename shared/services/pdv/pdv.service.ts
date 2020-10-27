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
    return Promise.all(cookies.map((cookie) => this.sendCookie(chainId, wallet, cookie)));
  }

  public sendCookie(chainId: string, wallet: Wallet, cookie: Cookie): Promise<void> {
    const decentr = this.createDecentrConnector(chainId);
    const pdv = PDVService.convertToPDV(cookie);

    return PDVService.queue.add(() => {
      return decentr.sendPdv(pdv, wallet)
        .then((message) => this.broadcast(decentr, message, wallet.privateKey));
    });
  }

  private static convertToPDV(cookie: Cookie): PDV {
    return {
      version: 'v1',
      pdv: {
        domain: cookie.domain,
        path: cookie.path,
        data: {
          version: 'v1',
          type: 'cookie',
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          host_only: cookie.hostOnly,
          path: cookie.path,
          secure: cookie.secure,
          same_site: cookie.sameSite,
          expiration_date: cookie.expirationDate,
        },
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
}

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
    return PDVService.queue.add(() => {
      return decentr.sendPDV(PDVService.convertToPDV(cookies), wallet)
        .then((message) => this.broadcast(decentr, message, wallet.privateKey));
    });
  }

  public getBalance(chainId: string, walletAddress: string): Promise<number> {
    const decentr = this.createDecentrConnector(chainId);
    return decentr.get.tokenBalance(walletAddress)
  }
  
  public getPDVList(chainId: string, walletAddress: string): Promise<any> {
    const decentr = this.createDecentrConnector(chainId);
    return decentr.get.pdvList(walletAddress);
  }

  private static convertToPDV(cookies: Cookie[]): PDV {
    return {
      version: 'v1',
      pdv: {
        domain: 'decentr.net',
        path: '/',
        data: cookies.map((cookie) => ({
          version: 'v1',
          type: 'cookie',
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          host_only: cookie.hostOnly,
          path: cookie.path,
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
}

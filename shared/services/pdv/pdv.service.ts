import { defer, forkJoin, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { Cookies } from 'webextension-polyfill-ts';
import PQueue from 'p-queue';
import Cookie = Cookies.Cookie;
import { Decentr, KeyPair, PDVDetails, PDVListItem, PDVStatItem, Wallet } from 'decentr-js';

import { convertCookiesToPdv, groupCookiesByDomainAndPath } from './utils';

export class PDVService {
  private static queue = new PQueue({ concurrency: 1 });

  constructor(private chainId: string) {
  }

  public sendCookies(api: string, wallet: Wallet, cookies: Cookie[]): Observable<void> {
    const decentr = this.createDecentrConnector(api);
    const groupedCookies = groupCookiesByDomainAndPath(cookies);

    return forkJoin(
      groupedCookies.map((group) => defer(() => PDVService.queue.add(() => {
        return decentr.sendPDV(
          convertCookiesToPdv(group.cookies, group.domain, group.path),
          wallet,
          { broadcast: true },
        );
      }))),
    ).pipe(
      mapTo(void 0),
    );
  }

  public getBalance(api: string, walletAddress: Wallet['address']): Promise<number> {
    const decentr = this.createDecentrConnector(api);

    return decentr.getTokenBalance(walletAddress);
  }

  public getPDVList(api: string, walletAddress: Wallet['address']): Promise<PDVListItem[]> {
    const decentr = this.createDecentrConnector(api);

    return decentr.getPDVList(walletAddress);
  }

  public getPDVDetails(
    api: string,
    address: PDVListItem['address'],
    keyPair: KeyPair,
  ): Promise<PDVDetails> {
    const decentr = this.createDecentrConnector(api);

    return decentr.getPDVDetails(address, keyPair);
  }

  public getPDVStats(api: string, walletAddress: Wallet['address']): Promise<PDVStatItem[]> {
    const decentr = this.createDecentrConnector(api);

    return decentr.getPDVStats(walletAddress);
  }

  private createDecentrConnector(api: string): Decentr {
    return new Decentr(api, this.chainId);
  }
}

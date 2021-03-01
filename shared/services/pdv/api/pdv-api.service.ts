import { Decentr, PDV, PDVDetails, PDVListItem, PDVListPaginationOptions, PDVStatItem, Wallet } from 'decentr-js';
import { map, mergeMap } from 'rxjs/operators';
import { ConfigService } from '../../configuration';
import { Observable } from 'rxjs';

export class PDVApiService {
  constructor(
    private configService: ConfigService,
  ) {
  }

  public sendPDV(api: string, wallet: Wallet, pdv: PDV[]): Promise<void> {
    return this.configService.getCerberusUrl().pipe(
      mergeMap((cerberusUrl) => this.createDecentrConnector(api).pipe(
        mergeMap((decentr) => decentr.sendPDV(cerberusUrl, pdv, wallet)),
      )),
    ).toPromise().then(() => void 0);
  }

  public getBalance(api: string, walletAddress: Wallet['address']): Promise<number> {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.getTokenBalance(walletAddress)),
    ).toPromise();
  }

  public getPDVList(
    api: string,
    walletAddress: Wallet['address'],
    paginationOptions?: PDVListPaginationOptions,
  ): Promise<PDVListItem[]> {
    return this.configService.getCerberusUrl().pipe(
      mergeMap((cerberusUrl) => this.createDecentrConnector(api).pipe(
        mergeMap((decentr) => decentr.getPDVList(cerberusUrl, walletAddress, paginationOptions)),
      )),
    ).toPromise();
  }

  public getPDVDetails(
    api: string,
    address: PDVListItem,
    wallet: Wallet,
  ): Promise<PDVDetails> {
    return this.configService.getCerberusUrl().pipe(
      mergeMap((cerberusUrl) => this.createDecentrConnector(api).pipe(
        mergeMap((decentr) => decentr.getPDVDetails(cerberusUrl, address, wallet)),
      )),
    ).toPromise();
  }

  public getPDVStats(api: string, walletAddress: Wallet['address']): Promise<PDVStatItem[]> {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.getPDVStats(walletAddress)),
    ).toPromise();
  }

  private createDecentrConnector(api: string): Observable<Decentr> {
    return this.configService.getChainId().pipe(
      map((chainId) => new Decentr(api, chainId)),
    );
  }
}

import { Injectable } from '@angular/core';
import {
  getPDVDetails,
  getPDVList,
  getTokenBalance,
  PDVDetails,
  PDVListItem,
  PDVListPaginationOptions,
  PDVStatItem,
  Wallet,
} from 'decentr-js';
import { defer, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ConfigService } from '../configuration';
import { AdvDdvStatistics } from './pdv.definitions';

@Injectable()
export class PDVApiService {
  constructor(
    private configService: ConfigService,
  ) {
  }

  public getAdvDdvStats(): Observable<AdvDdvStatistics> {
    return this.configService.getTheseusUrl().pipe(
      mergeMap((theseusUrl) => fetch(`${theseusUrl}/v1/profiles/stats`)),
      mergeMap((response) => response.json()),
    );
  }

  public getBalance(api: string, walletAddress: Wallet['address']): Observable<number> {
    return defer(() => getTokenBalance(api, walletAddress));
  }

  public getPDVList(
    walletAddress: Wallet['address'],
    paginationOptions?: PDVListPaginationOptions,
  ): Observable<PDVListItem[]> {
    return this.configService.getCerberusUrl().pipe(
      mergeMap((cerberusUrl) => getPDVList(cerberusUrl, walletAddress, paginationOptions)),
    );
  }

  public getPDVDetails(
    address: PDVListItem,
    wallet: Wallet,
  ): Observable<PDVDetails> {
    return this.configService.getCerberusUrl().pipe(
      mergeMap((cerberusUrl) => getPDVDetails(cerberusUrl, address, wallet)),
    );
  }

  public getPDVStats(walletAddress: Wallet['address']): Observable<PDVStatItem[]> {
    return this.configService.getTheseusUrl().pipe(
      mergeMap((theseusUrl) => fetch(`${theseusUrl}/v1/profiles/${walletAddress}/stats`)),
      mergeMap((response) => response.json()),
    );
  }
}

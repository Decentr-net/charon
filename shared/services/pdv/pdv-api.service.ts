import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defer, Observable } from 'rxjs';
import { mergeMap, pluck } from 'rxjs/operators';
import {
  getPDVDetails,
  getPDVList,
  getRewards,
  getTokenBalance,
  PDVDetails,
  PDVListItem,
  PDVListPaginationOptions,
  PDVType,
  Wallet,
} from 'decentr-js';

import { ConfigService } from '../configuration';
import { AdvDdvStatistics, PDVStats, ProfileStats } from './pdv.definitions';

@Injectable()
export class PDVApiService {
  constructor(
    private configService: ConfigService,
    private httpClient: HttpClient,
  ) {
  }

  public getAdvDdvStats(): Observable<AdvDdvStatistics> {
    return this.configService.getTheseusUrl().pipe(
      mergeMap((theseusUrl) => {
        return this.httpClient.get<AdvDdvStatistics>(`${theseusUrl}/v1/profiles/stats`);
      }),
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

  public getPDVStats(walletAddress: Wallet['address']): Observable<PDVStats[]> {
    return this.configService.getTheseusUrl().pipe(
      mergeMap((theseusUrl) => {
        return this.httpClient.get<ProfileStats>(`${theseusUrl}/v1/profiles/${walletAddress}/stats`);
      }),
      pluck('stats'),
    );
  }

  public getRewards(): Observable<Record<PDVType, number>> {
    return this.configService.getCerberusUrl().pipe(
      mergeMap((cerberusUrl) => getRewards(cerberusUrl)),
    );
  }
}

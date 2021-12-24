import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defer, Observable, of } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import {
  DecentrPDVClient,
  DecentrTokenClient,
  PDVDetails,
  PDVListItem,
  PDVListPaginationOptions,
  PDVType,
  TokenBalance,
  TokenBalanceHistory,
  TokenPool,
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

  // TODO
  public getTokenBalance(api: string, walletAddress: Wallet['address']): Observable<TokenBalance> {
    return defer(() => DecentrTokenClient.create(api)).pipe(
      mergeMap((client) => client.getTokenBalance(walletAddress)),
      map((balance) => ({ balance })),
    );
  }

  // TODO
  public getTokenBalanceHistory(api: string, walletAddress: Wallet['address']): Observable<TokenBalanceHistory[]> {
    return of([]);
    // return defer(() => getTokenBalanceHistory(api, walletAddress));
  }

  // TODO
  public getTokenPool(api: string): Observable<TokenPool> {
    return of({
      nextDistributionHeight: '1234567890',
      size: [],
      totalDelta: '1',
    })
    // return defer(() => new DecentrTokenClient(api).getTokenPool());
  }

  public getPDVList(
    walletAddress: Wallet['address'],
    paginationOptions?: PDVListPaginationOptions,
  ): Observable<PDVListItem[]> {
    return this.configService.getCerberusUrl().pipe(
      mergeMap((cerberusUrl) => new DecentrPDVClient(cerberusUrl).getPDVList(walletAddress, paginationOptions)),
    );
  }

  public getPDVDetails(
    address: PDVListItem,
    wallet: Wallet,
  ): Observable<PDVDetails> {
    return this.configService.getCerberusUrl().pipe(
      mergeMap((cerberusUrl) => new DecentrPDVClient(cerberusUrl).getPDVDetails(address, wallet)),
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
      mergeMap((cerberusUrl) => new DecentrPDVClient(cerberusUrl).getRewards()),
    );
  }
}

import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, mergeMap, startWith, switchMap } from 'rxjs/operators';
import {
  AdvDdvStatistics,
  DecentrClient,
  PDVDetails,
  PDVListItem,
  PDVListPaginationOptions,
  PDVRewards,
  ProfilePDVStatisticsItem,
  TokenDelta,
  TokenPool,
} from 'decentr-js';

import { ConfigService } from '@shared/services/configuration';
import { PDVStorageService } from '@shared/services/pdv';
import { getPDVDayChange, mapPDVStatsToChartPoints } from '@shared/utils/pdv';
import { AuthService } from '../../auth';
import { NetworkService } from '../network';
import { BalanceValueDynamic, PDVStatChartPoint } from './pdv.definitions';

@Injectable()
export class PDVService {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private decimalPipe: DecimalPipe,
    private networkService: NetworkService,
    private pdvStorageService: PDVStorageService,
  ) {
  }

  public getAdvDdvStats(): Observable<AdvDdvStatistics> {
    return this.createClient().pipe(
      switchMap((client) => client.token()),
      mergeMap((tokenClient) => tokenClient.getAdvDdvStats()),
    );
  }

  public getBalance(): Observable<string> {
    return combineLatest([
      this.createClient().pipe(
        switchMap((client) => client.token()),
      ),
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([tokenClient, walletAddress]) => tokenClient.getBalance(walletAddress)),
    );
  }

  public getBalanceWithMargin(): Observable<BalanceValueDynamic> {
    return combineLatest([
      this.getBalance(),
      this.getPDVStatChartPoints(),
    ]).pipe(
      map(([pdvRate, pdvRateHistory]) => ({
        dayMargin: getPDVDayChange(pdvRateHistory, +pdvRate),
        value: pdvRate,
      })),
    );
  }

  public getEstimatedBalance(): Observable<string> {
    return combineLatest([
      this.authService.getActiveUserAddress().pipe(
        switchMap((walletAddress) => this.pdvStorageService.getUserAccumulatedPDVChanges(walletAddress))
      ),
      this.getRewards(),
    ]).pipe(
      map(([pDVs, rewards]) => pDVs.reduce((acc, pdv) => acc + +rewards[pdv.type] || 0, 0)),
      startWith('0'),
      map((balance) => this.decimalPipe.transform(balance, '1.6')),
      distinctUntilChanged(),
    );
  }

  public getPDVDelta(): Observable<TokenDelta> {
    return combineLatest([
      this.createClient().pipe(
        switchMap((client) => client.token()),
      ),
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([tokenClient, walletAddress]) => tokenClient.getDelta(walletAddress)),
    );
  }

  public getPool(): Observable<TokenPool> {
    return this.createClient().pipe(
      switchMap((client) => client.token()),
      mergeMap((tokenClient) => tokenClient.getPool()),
    );
  }

  public getPDVList(
    paginationOptions?: PDVListPaginationOptions,
  ): Observable<PDVListItem[]> {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    return this.createClient().pipe(
      switchMap((client) => client.pdv.getPDVList(walletAddress, paginationOptions)),
    );
  }

  public getPDVDetails(
    address: PDVListItem,
  ): Observable<PDVDetails> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return this.createClient().pipe(
      switchMap((client) => client.pdv.getPDVDetails(address, wallet)),
    );
  }

  public getPDVStats(): Observable<ProfilePDVStatisticsItem[]> {
    return combineLatest([
      this.createClient(),
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([client, walletAddress]) => client.profile().getStats(walletAddress)),
      map((profileStatistics) => profileStatistics.stats),
      catchError(() => of([])),
    );
  }

  public getPDVStatChartPoints(): Observable<PDVStatChartPoint[]> {
    return this.getPDVStats().pipe(
      map(mapPDVStatsToChartPoints),
    );
  }

  public getRewards(): Observable<PDVRewards> {
    return this.createClient().pipe(
      switchMap((client) => client.pdv.getRewards()),
    );
  }

  private createClient(): Observable<DecentrClient> {
    return combineLatest([
      this.configService.getCerberusUrl(),
      this.configService.getTheseusUrl(),
      of(this.networkService.getActiveNetworkAPIInstant()),
    ]).pipe(
      map(([cerberusUrl, theseusUrl, nodeUrl]) =>
        new DecentrClient(nodeUrl, { cerberus: cerberusUrl, theseus: theseusUrl }),
      ),
    );
  }
}

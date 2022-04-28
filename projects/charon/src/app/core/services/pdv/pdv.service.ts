import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, mergeMap, startWith, switchMap } from 'rxjs/operators';
import {
  AdvDdvStatistics,
  PDVDetails,
  PDVListItem,
  PDVListPaginationOptions,
  PDVRewards,
  ProfilePDVStatisticsItem,
  TokenDelta,
  TokenPool,
} from 'decentr-js';

import { PDVStorageService } from '@shared/services/pdv';
import { getPDVDayChange, mapPDVStatsToChartPoints } from '@shared/utils/pdv';
import { AuthService } from '../../auth';
import { DecentrService } from '../decentr';
import { BalanceValueDynamic, PDVStatChartPoint } from './pdv.definitions';

@Injectable()
export class PDVService {
  constructor(
    private authService: AuthService,
    private decentrService: DecentrService,
    private decimalPipe: DecimalPipe,
    private pdvStorageService: PDVStorageService,
  ) {
  }

  public getAdvDdvStats(): Observable<AdvDdvStatistics> {
    return this.decentrService.theseusClient.pipe(
      mergeMap((theseusClient) => theseusClient.profile.getAdvDdvStats()),
    );
  }

  public getBalance(): Observable<string> {
    return combineLatest([
      this.decentrService.decentrClient,
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([decentrClient, walletAddress]) => decentrClient.token.getBalance(walletAddress)),
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
        switchMap((walletAddress) => this.pdvStorageService.getUserAccumulatedPDVChanges(walletAddress)),
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
      this.decentrService.cerberusClient,
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([cerberusClient, walletAddress]) => cerberusClient.rewards.getDelta(walletAddress)),
    );
  }

  public getPool(): Observable<TokenPool> {
    return this.decentrService.cerberusClient.pipe(
      switchMap((cerberusClient) => cerberusClient.rewards.getPool()),
    );
  }

  public getPDVList(
    paginationOptions?: PDVListPaginationOptions,
  ): Observable<PDVListItem[]> {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    return this.decentrService.cerberusClient.pipe(
      switchMap((cerberusClient) => cerberusClient.pdv.getPDVList(walletAddress, paginationOptions)),
    );
  }

  public getPDVDetails(
    address: PDVListItem,
  ): Observable<PDVDetails> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return this.decentrService.cerberusClient.pipe(
      switchMap((cerberusClient) => cerberusClient.pdv.getPDVDetails(address, wallet)),
    );
  }

  public getPDVStats(): Observable<ProfilePDVStatisticsItem[]> {
    return combineLatest([
      this.decentrService.theseusClient,
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([theseusClient, walletAddress]) => theseusClient.profile.getProfileStats(walletAddress)),
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
    return this.decentrService.cerberusClient.pipe(
      switchMap((cerberusClient) => cerberusClient.configuration.getPDVRewards()),
    );
  }
}

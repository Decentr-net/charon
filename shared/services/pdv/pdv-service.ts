import { Injectable } from '@angular/core';
import { combineLatest, EMPTY, Observable, ReplaySubject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  mapTo,
  mergeMap,
  pluck,
  share,
  startWith,
  switchMap,
  take,
} from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PDVDetails, PDVListItem, PDVListPaginationOptions, Wallet } from 'decentr-js';

import { MicroValuePipe } from '../../pipes/micro-value';
import { whileDocumentVisible } from '../../utils/document';
import { calculateDifferencePercentage, exponentialToFixed } from '../../utils/number';
import { AuthBrowserStorageService } from '../auth';
import { ConfigService } from '../configuration';
import { Network, NetworkBrowserStorageService } from '../network-storage';
import { AdvDdvStatistics, BalanceValueDynamic, PDVStatChartPoint } from './pdv.definitions';
import { PDVApiService } from './pdv-api.service';
import { PDVStorageService } from './pdv-storage.service';
import { PDVUpdateNotifier } from './pdv-update-notifier';

@UntilDestroy()
@Injectable()
export class PDVService {
  public balance$: Observable<string>;
  public pdvStatsChartPoints$: Observable<PDVStatChartPoint[]>;

  public wallet$: ReplaySubject<Wallet> = new ReplaySubject(1);

  constructor(
    private authBrowserStorageService: AuthBrowserStorageService,
    private configService: ConfigService,
    private microValuePipe: MicroValuePipe,
    private networkBrowserStorageService: NetworkBrowserStorageService,
    private pdvApiService: PDVApiService,
    private pdvStorageService: PDVStorageService,
  ) {
    this.getActiveUserWallet().pipe(
      untilDestroyed(this),
    ).subscribe(this.wallet$);
  }

  public getAdvDdvStats(): Observable<AdvDdvStatistics> {
    return this.pdvApiService.getAdvDdvStats();
  }

  public getBalanceLive(): Observable<string> {
    if (!this.balance$) {
      this.balance$ = this.createBalanceLiveObservable().pipe(
        share(),
      );
    }

    return this.balance$;
  }

  public getEstimatedBalance(): Observable<string> {
    return combineLatest([
      this.wallet$.pipe(
        pluck('address'),
        switchMap((walletAddress) => this.pdvStorageService.getUserAccumulatedPDVChanges(walletAddress)),
        map((pDVs) => (pDVs || []).reduce((acc, pdv) => [...acc, ...pdv.data], [])),
      ),
      this.configService.getRewards(),
    ]).pipe(
      map(([pdvData, rewards]) => pdvData.reduce((acc, item) => acc + rewards[item.type] || 0, 0)),
      map((estimatedBalance) => this.microValuePipe.transform(estimatedBalance)),
      map((balance) => balance || '0'),
      startWith('0'),
      distinctUntilChanged(),
    );
  }

  public getPDVDetails(pdvAddress: PDVListItem): Observable<PDVDetails> {
    return this.getActiveUserWallet().pipe(
      take(1),
      mergeMap((wallet) => this.pdvApiService.getPDVDetails(pdvAddress, wallet)),
    );
  }

  public getPDVList(paginationOptions?: PDVListPaginationOptions): Observable<PDVListItem[]> {
    return this.getActiveUserWallet().pipe(
      take(1),
      pluck('address'),
      mergeMap((walletAddress) => this.pdvApiService.getPDVList(walletAddress, paginationOptions))
    );
  }

  public getPDVStatChartPointsLive(): Observable<PDVStatChartPoint[]> {
    if (!this.pdvStatsChartPoints$) {
      this.pdvStatsChartPoints$ = this.createPDVStatChartPointsLiveObservable().pipe(
        share(),
      );
    }

    return this.pdvStatsChartPoints$;
  }

  public getBalanceWithMarginLive(): Observable<BalanceValueDynamic> {
    return combineLatest([
      this.getBalanceLive(),
      this.getPDVStatChartPointsLive(),
    ])
      .pipe(
        map(([pdvRate, pdvRateHistory]) => {
          const now = new Date;
          const historyDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          const historyPdvRate = pdvRateHistory.find(el => el.date === historyDate)?.value;
          const dayMargin = calculateDifferencePercentage(Number(pdvRate), historyPdvRate);

          return {
            dayMargin,
            value: pdvRate,
          };
        }),
      )
  }

  private getActiveUserWallet(): Observable<Wallet> {
    return this.authBrowserStorageService.getActiveUser().pipe(
      pluck('wallet'),
      distinctUntilChanged((prev, curr) => prev?.address === curr?.address),
    );
  }

  private getActiveNetworkApi(): Observable<Network['api']> {
    return this.networkBrowserStorageService.getActiveNetwork().pipe(
      pluck('api'),
    );
  }

  private createBalanceLiveObservable(): Observable<string> {
    return combineLatest([
      this.wallet$.pipe(
        pluck('address'),
      ),
      this.getActiveNetworkApi(),
      PDVUpdateNotifier.listen().pipe(
        whileDocumentVisible(),
        startWith(void 0),
      ),
    ]).pipe(
      switchMap(([walletAddress, networkApi]) => this.pdvApiService.getBalance(networkApi, walletAddress)),
      map(exponentialToFixed),
      distinctUntilChanged(),
      catchError(() => EMPTY),
    );
  }

  private createPDVStatChartPointsLiveObservable(): Observable<PDVStatChartPoint[]> {
    return this.wallet$.pipe(
      pluck('address'),
      switchMap((walletAddress) => this.getBalanceLive().pipe(
        mapTo(walletAddress),
      )),
      switchMap((walletAddress) => this.pdvApiService.getPDVStats(walletAddress)),
      map((stats) => stats
        .map(({ date, value }) => ({
          date: new Date(date).valueOf(),
          value,
        }))
        .sort((a, b) => a.date - b.date)
      ),
    );
  }
}

import { Injectable } from '@angular/core';
import { combineLatest, EMPTY, Observable, of, ReplaySubject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
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
import { exponentialToFixed } from '../../utils/number';
import { AuthBrowserStorageService } from '../auth';
import { ConfigService } from '../configuration';
import { Network, NetworkBrowserStorageService } from '../network-storage';
import { AdvDdvStatistics, BalanceValueDynamic, PDVStatChartPoint } from './pdv.definitions';
import { PDVApiService } from './pdv-api.service';
import { PDVSettings, PDVStorageService } from './pdv-storage.service';
import { PDVUpdateNotifier } from './pdv-update-notifier';
import { getPDVDayChange, mapPDVStatsToChartPoints } from '../../utils/pdv';

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

  public getBalanceLive(isShare: boolean = true): Observable<string> {
    if (isShare) {
      if (!this.balance$) {
        this.balance$ = this.createBalanceLiveObservable().pipe(
          share(),
        );
      }

      return this.balance$;
    } else {
      return this.createBalanceLiveObservable();
    }
  }

  public getEstimatedBalance(): Observable<string> {
    return combineLatest([
      this.wallet$.pipe(
        pluck('address'),
        switchMap((walletAddress) => this.pdvStorageService.getUserAccumulatedPDVChanges(walletAddress)),
      ),
      this.pdvApiService.getRewards(),
    ]).pipe(
      map(([pDVs, rewards]) => (pDVs || []).reduce((acc, pdv) => acc + rewards[pdv.type] || 0, 0)),
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

  public getBalanceWithMarginLive(isBalanceShare: boolean = true): Observable<BalanceValueDynamic> {
    return combineLatest([
      this.getBalanceLive(isBalanceShare),
      this.getPDVStatChartPointsLive(),
    ])
      .pipe(
        map(([pdvRate, pdvRateHistory]) => ({
          dayMargin: getPDVDayChange(pdvRateHistory, +pdvRate),
          value: pdvRate,
        })),
      )
  }

  public getUserSettings(walletAddress: Wallet['address']): Observable<PDVSettings> {
    return this.pdvStorageService.getUserSettingsChanges(walletAddress);
  }

  public setUserSettings(walletAddress: Wallet['address'], settings: PDVSettings): Promise<void> {
    return this.pdvStorageService.setUserSettings(walletAddress, settings);
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
        filter((address) => !!address),
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
      filter((address) => !!address),
      switchMap((walletAddress) => this.pdvApiService.getPDVStats(walletAddress)),
      catchError(() => of([])),
      map(mapPDVStatsToChartPoints),
    );
  }
}

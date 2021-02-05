import { Injectable } from '@angular/core';
import { combineLatest, EMPTY, from, Observable } from 'rxjs';
import { catchError, map, share, startWith, switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PDVDetails, PDVListItem, PDVListPaginationOptions, Wallet } from 'decentr-js';

import { Environment } from '@environments/environment.definitions';
import {
  BalanceValueDynamic,
  PDVService as NativePDVService,
  PDVStatChartPoint,
  PDVStorageService,
  PDVUpdateNotifier,
} from '@shared/services/pdv';
import { whileDocumentVisible } from '@shared/utils/document';
import { StateChangesService } from '../state';
import { Network } from '@core/services';
import { ConfigService } from '@shared/services/configuration';
import { MicroValuePipe } from '@shared/pipes/micro-value';

@UntilDestroy()
@Injectable()
export class PDVService {
  private wallet: Wallet;
  private networkApi: Network['api'];

  private balance$: Observable<string>;
  private balanceWithMargin$: Observable<BalanceValueDynamic>;
  private pDVStatChartPoints$: Observable<PDVStatChartPoint[]>;
  private nativePdvService: NativePDVService = new NativePDVService(this.environment.chainId);
  private pdvStorageService: PDVStorageService = new PDVStorageService();

  constructor(
    private environment: Environment,
    private configService: ConfigService,
    private stateChangesService: StateChangesService,
    private microValuePipe: MicroValuePipe,
  ) {
    this.stateChangesService.getWalletAndNetworkApiChanges().pipe(
      untilDestroyed(this),
    ).subscribe(({ wallet, networkApi }) => {
      this.wallet = wallet;
      this.networkApi = networkApi;
    });
  }

  public getBalance(): Observable<string> {
    if (!this.balance$) {
      this.balance$ = this.createBalanceObservable().pipe(
        share(),
      );
    }

    return this.balance$;
  }

  public getEstimatedBalance(): Observable<string> {
    return this.stateChangesService.getWalletAndNetworkApiChanges().pipe(
      switchMap(({ wallet }) => combineLatest([
        this.configService.getRewards(),
        from(this.pdvStorageService.getUserAccumulatedPDVChanges(wallet.address)).pipe(
          map((pDVs) => pDVs.reduce((acc, pdv) => [...acc, ...pdv.data], [])),
        ),
      ])),
      map(([rewards, pdvData]) => pdvData.reduce((acc, item) => acc + rewards[item.type] || 0, 0)),
      map((estimatedBalance) => this.microValuePipe.transform(estimatedBalance)),
      map((balance) => balance || '0'),
    );
  }

  public getPDVList(
    api: string,
    walletAddress: Wallet['address'],
    paginationOptions?: PDVListPaginationOptions,
  ): Observable<PDVListItem[]> {
    return this.nativePdvService.getPDVList(api, walletAddress, paginationOptions);
  }

  public getPDVDetails(address: PDVListItem,): Observable<PDVDetails> {
    return this.nativePdvService.getPDVDetails(this.networkApi, address, this.wallet);
  }

  public getPDVStatChartPoints(): Observable<PDVStatChartPoint[]> {
    if (!this.pDVStatChartPoints$) {
      this.pDVStatChartPoints$ = this.createPDVStatChartPointsObservable().pipe(
        share(),
      );
    }

    return this.pDVStatChartPoints$;
  }

  public getBalanceWithMargin(): Observable<BalanceValueDynamic> {
    if (!this.balanceWithMargin$) {
      this.balanceWithMargin$ = this.createBalanceWithMarginObservable().pipe(
        share(),
      );
    }

    return this.balanceWithMargin$;
  }

  private createBalanceObservable(): Observable<string> {
    return whileDocumentVisible(
      combineLatest([
        this.stateChangesService.getWalletAndNetworkApiChanges(),
        PDVUpdateNotifier.listen().pipe(
          startWith(void 0),
        ),
      ]).pipe(
        switchMap(([{ wallet, networkApi }]) => {
          return this.nativePdvService.getBalance(networkApi, wallet.address);
        }),
        catchError(() => EMPTY),
      ),
    );
  }

  private createBalanceWithMarginObservable(): Observable<BalanceValueDynamic> {
    return whileDocumentVisible(
      combineLatest([
        this.stateChangesService.getWalletAndNetworkApiChanges(),
        PDVUpdateNotifier.listen().pipe(
          startWith(void 0),
        ),
      ]).pipe(
        switchMap(([{ wallet, networkApi }]) => {
          return this.nativePdvService.getBalanceWithMargin(networkApi, wallet.address);
        }),
        catchError(() => EMPTY),
      ),
    );
  }

  private createPDVStatChartPointsObservable(): Observable<PDVStatChartPoint[]> {
    return whileDocumentVisible(
      combineLatest([
        this.stateChangesService.getWalletAndNetworkApiChanges(),
        PDVUpdateNotifier.listen().pipe(
          startWith(void 0),
        ),
      ]).pipe(
        switchMap(([{ wallet, networkApi }]) => {
          return this.nativePdvService.getPDVStatChartPoints(networkApi, wallet.address);
        }),
        catchError(() => EMPTY),
      ),
    );
  }
}

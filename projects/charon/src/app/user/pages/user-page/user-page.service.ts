import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { combineLatest, from, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import { PDVDetails, PDVListItem } from 'decentr-js';

import { Environment } from '@environments/environment.definitions';
import { coerceTimestamp } from '@shared/utils/date';
import { CurrencyService } from '@shared/services/currency';
import { PDVService } from '@shared/services/pdv';
import { BalanceValueDynamic } from './user-page.component';
import { calculateDifferencePercentage, exponentialToFixed } from '@shared/utils/number';
import { AuthService, AuthUser } from '@core/auth';
import { MediaService, Network, NetworkService } from '@core/services';
import { ChartPoint, PDVActivityListItem, PdvDetailsDialogComponent, PDVDetailsDialogData } from '../../components';

@Injectable()
export class UserPageService {
  private readonly pdvService: PDVService;

  constructor(
    private authService: AuthService,
    private currencyService: CurrencyService,
    private matDialog: MatDialog,
    private mediaService: MediaService,
    private networkService: NetworkService,
    environment: Environment,
  ) {
    this.pdvService = new PDVService(environment.chainId);
  }

  public getBalance(): Observable<string> {
    return this.getWalletAddressAndNetworkApiStream().pipe(
      switchMap(({ walletAddress, networkApi }) => {
        return this.pdvService.getBalance(networkApi, walletAddress);
      }),
      map(exponentialToFixed),
    );
  }

  public getBalanceWithMargin(): Observable<BalanceValueDynamic> {
    return combineLatest([
      this.getBalance(),
      this.getPDVChartPoints(),
    ])
      .pipe(
        map(([pdvRate, pdvRateHistory]) => {
          const now = new Date;
          const historyDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          const historyPdvRate = pdvRateHistory.find(el => el.date === historyDate)?.value;

          return {
            dayMargin: calculateDifferencePercentage(Number(pdvRate), historyPdvRate),
            value: pdvRate,
          }
        })
      )
  }

  public getCoinRate(): Observable<number> {
    return this.currencyService.getDecentrCoinRateForUsd();
  }

  public getPDVActivityList(): Observable<PDVActivityListItem[]> {
    return this.getWalletAddressAndNetworkApiStream().pipe(
      switchMap(({ walletAddress, networkApi }) => {
        return this.pdvService.getPDVList(networkApi, walletAddress);
      }),
      map((list) => list.map(({ address, timestamp }) => (
        {
          address,
          date: new Date(coerceTimestamp(timestamp)),
        }))
      )
    );
  }

  public getPDVDetails(address: PDVListItem['address']): Observable<PDVDetails> {
    return from(this.pdvService.getPDVDetails(
      this.networkService.getActiveNetworkInstant().api,
      address,
      this.authService.getActiveUserInstant().wallet,
    ));
  }

  public getPDVChartPoints(): Observable<ChartPoint[]> {
    return this.getWalletAddressAndNetworkApiStream().pipe(
      switchMap(({ walletAddress, networkApi }) => {
        return this.pdvService.getPDVStats(networkApi, walletAddress);
      }),
      map((stats) => stats
        .map(({ date, value }) => ({
          date: new Date(date).valueOf(),
          value,
        }))
        .sort((a, b) => a.date - b.date)
      ),
    );
  }

  public openPDVDetailsDialog(details: PDVDetails, date: Date): MatDialogRef<PdvDetailsDialogComponent> {
    const config: MatDialogConfig<PDVDetailsDialogData> = {
      width: '940px',
      maxWidth: '100%',
      height: this.mediaService.isSmall() ? '100%' : '500px',
      maxHeight: this.mediaService.isSmall() ? '100vh' : '100%',
      panelClass: 'popup-no-padding',
      data: {
        date,
        domain: details.user_data.pdv.domain,
        ip: details.calculated_data.ip,
        pdvData: details.user_data.pdv.data,
        userAgent: details.user_data.pdv.user_agent,
      },
    };

    return this.matDialog.open(PdvDetailsDialogComponent, config);
  }

  private getWalletAddressAndNetworkApiStream(): Observable<{
    walletAddress: AuthUser['wallet']['address'];
    networkApi: Network['api'];
  }> {
    return combineLatest([
      this.authService.getActiveUser().pipe(
        pluck('wallet', 'address'),
      ),
      this.networkService.getActiveNetwork().pipe(
        pluck('api')
      ),
    ]).pipe(
      map(([walletAddress, networkApi]) => ({ walletAddress, networkApi })),
    );
  }
}

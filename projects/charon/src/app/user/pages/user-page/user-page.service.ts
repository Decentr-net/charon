import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PDVDetails, PDVListItem } from 'decentr-js';

import { coerceTimestamp } from '@shared/utils/date';
import { CurrencyService } from '@shared/services/currency';
import { BalanceValueDynamic } from '@shared/services/pdv';
import { MediaService, PDVService, StateChangesService } from '@core/services';
import { ChartPoint, PDVActivityListItem, PdvDetailsDialogComponent, PDVDetailsDialogData } from '../../components';

@Injectable()
export class UserPageService {
  constructor(
    private pdvService: PDVService,
    private currencyService: CurrencyService,
    private matDialog: MatDialog,
    private mediaService: MediaService,
    private stateChangesService: StateChangesService,
  ) {
  }

  public getBalanceWithMargin(): Observable<BalanceValueDynamic> {
    return this.pdvService.getBalanceWithMargin();
  }

  public getCoinRate(): Observable<number> {
    return this.currencyService.getDecentrCoinRateForUsd();
  }

  public getPDVActivityList(): Observable<PDVActivityListItem[]> {
    return this.stateChangesService.getWalletAndNetworkApiChanges().pipe(
      switchMap(({ wallet, networkApi }) => {
        return this.pdvService.getPDVList(networkApi, wallet.address);
      }),
      map((list) => list.map(({ address, timestamp, type }) => (
        {
          address,
          date: new Date(coerceTimestamp(timestamp)),
          type: Number(type)
        }))
      )
    );
  }

  public getPDVDetails(address: PDVListItem['address']): Observable<PDVDetails> {
    return this.pdvService.getPDVDetails(address);
  }

  public getPDVChartPoints(): Observable<ChartPoint[]> {
    return this.pdvService.getPDVStatChartPoints();
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
}

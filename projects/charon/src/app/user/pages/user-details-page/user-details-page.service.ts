import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PDVDetails, PDVListItem } from 'decentr-js';

import { CurrencyService } from '@shared/services/currency';
import { NotificationService } from '@shared/services/notification';
import { BalanceValueDynamic } from '@shared/services/pdv';
import { MediaService, PDVService, SpinnerService } from '@core/services';
import { ChartPoint, PDVActivityListItem, PdvDetailsDialogComponent, PDVDetailsDialogData } from '../../components';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

@UntilDestroy()
@Injectable()
export class UserDetailsPageService {
  constructor(
    private pdvService: PDVService,
    private currencyService: CurrencyService,
    private matDialog: MatDialog,
    private mediaService: MediaService,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService,
  ) {
  }

  public getBalanceWithMargin(): Observable<BalanceValueDynamic> {
    return this.pdvService.getBalanceWithMargin();
  }

  public getCoinRate(): Observable<number> {
    return this.currencyService.getDecentrCoinRateForUsd();
  }

  public getPDVDetails(address: PDVListItem['address']): Observable<PDVDetails> {
    return this.pdvService.getPDVDetails(address);
  }

  public getPDVChartPoints(): Observable<ChartPoint[]> {
    return this.pdvService.getPDVStatChartPoints();
  }

  public openPDVDetails(pdvItem: PDVActivityListItem): void {
    this.spinnerService.showSpinner();

    this.getPDVDetails(pdvItem.address).pipe(
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(details => {
      this.openPDVDetailsDialog(details, pdvItem.date);
    }, (error) => {
      this.notificationService.error(error);
    });
  }

  private openPDVDetailsDialog(details: PDVDetails, date: Date): MatDialogRef<PdvDetailsDialogComponent> {
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

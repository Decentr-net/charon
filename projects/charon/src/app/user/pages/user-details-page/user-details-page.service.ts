import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { BankCoin, PDVDetails, PDVListItem } from 'decentr-js';

import { AuthService } from '@core/auth/services';
import { MessageBus } from '@shared/message-bus';
import { ChartPoint } from '@shared/components/line-chart';
import { CurrencyService } from '@shared/services/currency';
import { NotificationService } from '@shared/services/notification';
import { BalanceValueDynamic } from '@shared/services/pdv';
import { MessageCode } from '@scripts/messages';
import { BankService, MediaService, PDVService, SpinnerService } from '@core/services';
import { PDVActivityListItem, PdvDetailsDialogComponent, PDVDetailsDialogData } from '../../components';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, startWith, switchMap } from 'rxjs/operators';

@UntilDestroy()
@Injectable()
export class UserDetailsPageService {
  private messageBus = new MessageBus();

  constructor(
    private authService: AuthService,
    private bankService: BankService,
    private pdvService: PDVService,
    private currencyService: CurrencyService,
    private matDialog: MatDialog,
    private mediaService: MediaService,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService,
  ) {
  }

  public getBankBalance(): Observable<BankCoin['amount']> {
    return this.messageBus.onMessage(MessageCode.CoinTransferred).pipe(
      startWith(void 0),
      switchMap(() => this.bankService.getDECBalance(this.authService.getActiveUserInstant().wallet.address)),
    );
  }

  public getBalanceWithMargin(): Observable<BalanceValueDynamic> {
    return this.pdvService.getBalanceWithMargin();
  }

  public getCoinRate(): Observable<number> {
    return this.currencyService.getDecentrCoinRateForUsd();
  }

  public getPDVDetails(address: PDVListItem): Observable<PDVDetails> {
    return this.pdvService.getPDVDetails(address);
  }

  public getPDVChartPoints(): Observable<ChartPoint[]> {
    return this.pdvService.getPDVStatChartPoints();
  }

  public openPDVDetails(pdvItem: PDVActivityListItem): void {
    this.spinnerService.showSpinner();

    this.getPDVDetails(pdvItem.id).pipe(
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
        pdv: details.pdv,
      },
    };

    return this.matDialog.open(PdvDetailsDialogComponent, config);
  }
}

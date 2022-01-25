import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { AdvDdvStatistics } from 'decentr-js';

import { AuthService } from '@core/auth';
import { coerceTimestamp } from '@shared/utils/date';
import { BalanceValueDynamic, CoinRateFor24Hours, CurrencyService, PDVService, UserService } from '@core/services';
import { HubCurrencyStatistics } from '../hub-currency-statistics';
import { HubPDVStatistics } from '../hub-pdv-statistics';

interface CoinRateHistory {
  date: number;
  value: number;
}

@Injectable()
export class HubHeaderStatsMetaService {
  constructor(
    private authService: AuthService,
    private currencyService: CurrencyService,
    private overlay: Overlay,
    private pdvService: PDVService,
    private userService: UserService,
  ) {
  }

  public getAdvDdvStats(): Observable<AdvDdvStatistics> {
    return this.pdvService.getAdvDdvStats();
  }

  public getBalance(): Observable<BalanceValueDynamic> {
    return this.pdvService.getBalanceWithMargin();
  }

  public getCoinRate(): Observable<CoinRateFor24Hours> {
    return this.currencyService.getDecentrCoinRateForUsd24hours();
  }

  public getEstimatedBalance(): Observable<string> {
    return this.pdvService.getEstimatedBalance();
  }

  private getUserRegisteredAt(): Observable<string> {
    const user = this.authService.getActiveUserInstant();

    return this.userService.getProfile(user.wallet.address).pipe(
      pluck('createdAt'),
    );
  }

  public getPdvStatistics(): Observable<HubPDVStatistics> {
    return combineLatest([
      this.pdvService.getBalanceWithMargin(),
      this.pdvService.getPDVStatChartPoints(),
      this.getUserRegisteredAt(),
    ]).pipe(
      map(([pdvWithMargin, pdvStatistic, userRegisteredAt]) => ({
        fromDate: coerceTimestamp(userRegisteredAt),
        pdv: pdvWithMargin.value,
        pdvChangedIn24HoursPercent: pdvWithMargin.dayMargin,
        points: pdvStatistic,
      })),
    );
  }

  private getDecentCoinRateHistory(days: number): Observable<CoinRateHistory[]> {
    return this.currencyService.getDecentrCoinRateHistory(days).pipe(
      map((historyElements) => historyElements.map((historyElement) => ({
        date: historyElement[0],
        value: historyElement[1],
      }))),
    );
  }

  public getCoinRateStatistics(): Observable<HubCurrencyStatistics> {
    return combineLatest([
      this.currencyService.getDecentrCoinRateForUsd24hours(),
      this.getDecentCoinRateHistory(365),
    ]).pipe(
      map(([rateWithMargin, rateStatistic]) => ({
        points: rateStatistic,
        rate: rateWithMargin.value,
        rateChangedIn24HoursPercent: rateWithMargin.dayMargin,
      })),
    );
  }

  public openDetailsOverlay(
    template: TemplateRef<void>,
    viewContainerRef: ViewContainerRef,
    anchorElement: HTMLElement,
  ): OverlayRef {
    const overlayRef = this.createOverlay(anchorElement);

    const templatePortal = new TemplatePortal(template, viewContainerRef);

    overlayRef.attach(templatePortal);

    return overlayRef;
  }

  private createOverlay(anchorElement: HTMLElement): OverlayRef {
    const strategy = this.overlay.position()
      .flexibleConnectedTo(anchorElement)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
      ]);

    const config = new OverlayConfig({
      positionStrategy: strategy,
      width: '100%',
      disposeOnNavigation: true,
    });

    return this.overlay.create(config);
  }
}

import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';

import { CoinRateFor24Hours, CurrencyService } from '@shared/services/currency';
import { PDVService } from '@core/services';
import { BalanceValueDynamic } from '@shared/services/pdv';
import { TemplatePortal } from '@angular/cdk/portal';

@Injectable()
export class HubHeaderStatsMetaService {
  constructor(
    private currencyService: CurrencyService,
    private overlay: Overlay,
    private pdvService: PDVService,
  ) {
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

  public openDetailsOverlay(
    template: TemplateRef<{}>,
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

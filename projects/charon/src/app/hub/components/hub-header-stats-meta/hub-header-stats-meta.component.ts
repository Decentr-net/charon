import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AdvDdvStatistics } from 'decentr-js';

import { svgExpandMore } from '@shared/svg-icons/expand-more';
import { CoinRateFor24Hours } from '@shared/services/currency';
import { BalanceValueDynamic } from '@core/services';
import { HubCurrencyStatistics } from '../hub-currency-statistics';
import { HubHeaderStatsMetaService } from './hub-header-stats-meta.service';
import { HubPDVStatistics } from '../hub-pdv-statistics';

@UntilDestroy()
@Component({
  selector: 'app-hub-header-stats-meta',
  templateUrl: './hub-header-stats-meta.component.html',
  styleUrls: ['./hub-header-stats-meta.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    HubHeaderStatsMetaService,
  ],
})
export class HubHeaderStatsMetaComponent implements OnInit {
  @Input() public detailsAnchorElement: HTMLElement;

  @ViewChild('detailsTemplate', { static: true }) public detailsTemplate: TemplateRef<void>;

  public balance: BalanceValueDynamic;

  public coinRate$: Observable<CoinRateFor24Hours>;

  public estimatedBalance$: Observable<string>;

  public advDdvStatistics: AdvDdvStatistics;

  public pdvStatistics: HubPDVStatistics;

  public rateStatistics: HubCurrencyStatistics;

  private overlayRef: OverlayRef;

  constructor(
    private hubHeaderStatsMetaService: HubHeaderStatsMetaService,
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private overlay: Overlay,
    private router: Router,
    svgIconRegistry: SvgIconRegistry,
    private viewContainerRef: ViewContainerRef,
  ) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart && this.isDetailsOpened),
      untilDestroyed(this),
    ).subscribe(() => this.hideDetails());

    svgIconRegistry.register([
      svgExpandMore,
    ]);
  }

  public ngOnInit(): void {
    this.coinRate$ = this.hubHeaderStatsMetaService.getCoinRate();
    this.estimatedBalance$ = this.hubHeaderStatsMetaService.getEstimatedBalance();

    this.hubHeaderStatsMetaService.getBalance().pipe(
      untilDestroyed(this),
    ).subscribe((balance) => {
      this.balance = balance;
      this.changeDetectorRef.detectChanges();
    });

    this.hubHeaderStatsMetaService.getPdvStatistics().pipe(
      untilDestroyed(this),
    ).subscribe((statistics) => {
      this.pdvStatistics = statistics;
      this.changeDetectorRef.detectChanges();
    });

    this.hubHeaderStatsMetaService.getCoinRateStatistics().pipe(
      untilDestroyed(this),
    ).subscribe((statistics) => {
      this.rateStatistics = statistics;
      this.changeDetectorRef.markForCheck();
    });

    this.hubHeaderStatsMetaService.getAdvDdvStats().pipe(
      untilDestroyed(this),
    ).subscribe((statistics) => {
      this.advDdvStatistics = statistics;
      this.changeDetectorRef.markForCheck();
    });
  }

  public get isDetailsOpened(): boolean {
    return !!this.overlayRef;
  }

  @HostListener('click')
  public switchDetailsView(): void {
    if (this.isDetailsOpened) {
      this.hideDetails();
    } else {
      this.showDetails();
    }
  }

  public showDetails(): void {
    this.overlayRef = this.hubHeaderStatsMetaService.openDetailsOverlay(
      this.detailsTemplate,
      this.viewContainerRef,
      this.detailsAnchorElement || this.elementRef.nativeElement,
    );

    this.overlayRef.detachments().pipe(
      take(1),
      untilDestroyed(this),
    ).subscribe(() => {
      this.overlayRef = undefined;
      this.changeDetectorRef.markForCheck();
    });
  }

  public hideDetails(): void {
    if (!this.overlayRef) {
      return;
    }

    this.overlayRef.dispose();
    this.overlayRef = undefined;
  }
}

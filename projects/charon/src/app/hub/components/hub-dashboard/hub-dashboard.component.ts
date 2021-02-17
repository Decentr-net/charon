import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { HubCurrencyStatistics } from '../hub-currency-statistics';
import { HubDashboardService } from '../../services/hub-dashboard.service';
import { HubPDVStatistics } from '../hub-pdv-statistics';

@UntilDestroy()
@Component({
  selector: 'app-hub-dashboard',
  templateUrl: './hub-dashboard.component.html',
  styleUrls: ['./hub-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubDashboardComponent implements OnInit {
  public estimatedBalance$: Observable<string>;
  public pdvStatistics: HubPDVStatistics;
  public rateStatistics$: Observable<HubCurrencyStatistics>;

  public additionalStatistics: string[] = [
    'My PDV',
    'ADV',
    'DDV',
    'DEC',
  ];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dashboardService: HubDashboardService,
  ) {
  }

  public ngOnInit(): void {
    this.dashboardService.getPdvStatistics().pipe(
      untilDestroyed(this),
    ).subscribe((statistics) => {
      this.pdvStatistics = statistics;
      this.changeDetectorRef.detectChanges();
    });

    this.estimatedBalance$ = this.dashboardService.getEstimatedBalance();
    this.rateStatistics$ = this.dashboardService.getCoinRateStatistics();
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CirclePDVStatistics } from '../../components/circle-pdv-statistics';
import { CircleCurrencyStatistics } from '../../components/circle-currency-statistics';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewPageComponent {
  public pdvStatistics: CirclePDVStatistics = {
    fromDate: Date.now(),
    pdv: 1.5,
    pdvChangedIn24HoursPercent: 13,
  };

  public rateStatistics: CircleCurrencyStatistics = {
    fromDate: Date.now(),
    rate: 1.5,
    rateChangedIn24HoursPercent: 13,
  };
}

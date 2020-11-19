import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CirclePDVStatistics } from '../../components/circle-pdv-statistics';

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
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AdvDdvStatistics } from 'decentr-js';


@Component({
  selector: 'app-hub-additional-statistics',
  templateUrl: './hub-additional-statistics.component.html',
  styleUrls: ['./hub-additional-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubAdditionalStatisticsComponent {
  @Input() public advDdvStatistics: AdvDdvStatistics;
}

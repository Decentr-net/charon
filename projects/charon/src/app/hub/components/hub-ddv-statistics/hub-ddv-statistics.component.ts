import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-hub-ddv-statistics',
  templateUrl: './hub-ddv-statistics.component.html',
  styleUrls: ['./hub-ddv-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubDdvStatisticsComponent {
  @Input() public statistics: number = 450322.294;
}

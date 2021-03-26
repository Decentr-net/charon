import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-hub-adv-statistics',
  templateUrl: './hub-adv-statistics.component.html',
  styleUrls: ['./hub-adv-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubAdvStatisticsComponent {
  @Input() public statistics: number = 1.450322;
}

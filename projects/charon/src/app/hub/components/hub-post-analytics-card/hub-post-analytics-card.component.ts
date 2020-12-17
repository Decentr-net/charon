import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Post } from 'decentr-js';

export interface HubPostAnalytics extends Post {
  pdvIncreasePercent: number;
}

@Component({
  selector: 'app-hub-post-analytics-card',
  templateUrl: './hub-post-analytics-card.component.html',
  styleUrls: ['./hub-post-analytics-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostAnalyticsCardComponent {
  @Input() public postAnalytics: HubPostAnalytics;
  @Input() public maxContentLines: number;
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HubPostPreview } from '../hub-post-preview-card';

export interface HubPostAnalytics extends HubPostPreview {
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

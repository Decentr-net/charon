import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CirclePostPreview } from '../circle-post-preview-card';

export interface CirclePostAnalytics extends CirclePostPreview {
  pdvIncreasePercent: number;
}

@Component({
  selector: 'app-circle-post-analytics-card',
  templateUrl: './circle-post-analytics-card.component.html',
  styleUrls: ['./circle-post-analytics-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePostAnalyticsCardComponent {
  @Input() public postAnalytics: CirclePostAnalytics;
  @Input() public maxContentLines: number;
}

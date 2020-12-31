import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Post } from 'decentr-js';

@Component({
  selector: 'app-hub-post-analytics-card',
  templateUrl: './hub-post-analytics-card.component.html',
  styleUrls: ['./hub-post-analytics-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostAnalyticsCardComponent {
  @Input() public post: Post;
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PostWithAuthor } from '../../models/post';

@Component({
  selector: 'app-hub-post-analytics-card',
  templateUrl: './hub-post-analytics-card.component.html',
  styleUrls: ['./hub-post-analytics-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostAnalyticsCardComponent {
  @Input() public post: PostWithAuthor;
}

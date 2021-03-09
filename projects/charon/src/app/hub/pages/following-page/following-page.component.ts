import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PostsListItem } from '@core/services';
import { HubFeedRoute, HubRoute } from '../../hub-route';
import { FollowingPageService } from './following-page.service';
import { HubPostsService } from '../../services';

@Component({
  selector: 'app-following-page',
  templateUrl: './following-page.component.html',
  styleUrls: ['./following-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: HubPostsService,
      useClass: FollowingPageService,
    },
  ],
})
export class FollowingPageComponent {
  public postLinkFn: (post: PostsListItem) => unknown[] = (post) => {
    return ['../', { outlets: { primary: [HubFeedRoute.Following], post: [HubRoute.Post, post.owner, post.uuid] } }];
  }
}

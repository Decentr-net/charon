import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PostsListItem } from '@core/services';
import { HubFeedRoute, HubRoute } from '../../hub-route';
import { MyPostsPageService } from './my-posts-page.service';
import { HubPostsService } from '../../services';

@Component({
  selector: 'app-my-posts-page',
  templateUrl: './my-posts-page.component.html',
  styleUrls: ['./my-posts-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: HubPostsService,
      useClass: MyPostsPageService,
    },
  ],
})
export class MyPostsPageComponent {
  public postLinkFn: (post: PostsListItem) => unknown[] = (post) => {
    return ['../', { outlets: { primary: [HubFeedRoute.MyPosts], post: [HubRoute.Post, post.owner, post.uuid] } }];
  }
}

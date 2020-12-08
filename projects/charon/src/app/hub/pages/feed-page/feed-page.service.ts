import { Injectable, OnDestroy } from '@angular/core';
import { Post } from 'decentr-js';
import { Observable } from 'rxjs';

import { NetworkSelectorService } from '@core/network-selector';
import { PostsApiService } from '@core/services/api';
import { UserService } from '@core/services';
import { HubPostsService } from '../../services';

@Injectable()
export class FeedPageService extends HubPostsService implements OnDestroy {
  constructor(
    private networkService: NetworkSelectorService,
    private postsApiService: PostsApiService,
    userService: UserService,
  ) {
    super(userService);
  }

  public ngOnDestroy() {
    this.dispose();
  }

  protected loadPosts(fromPost: Post | undefined, count: number): Observable<Post[]> {
    return this.postsApiService.getPopularPosts(
      this.networkService.getActiveNetworkInstant().api,
      'day',
      {
        fromOwner: fromPost && fromPost.owner,
        fromUUID: fromPost && fromPost.uuid,
        limit: count,
      }
    );
  }
}

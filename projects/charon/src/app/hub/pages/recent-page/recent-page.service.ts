import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'decentr-js';

import { NetworkService } from '@core/services';
import { PostsApiService } from '@core/services/api';
import { UserService } from '@core/services';
import { HubPostsService } from '../../services';

@Injectable()
export class RecentPageService extends HubPostsService implements OnDestroy {
  constructor(
    private networkService: NetworkService,
    private postsApiService: PostsApiService,
    userService: UserService,
  ) {
    super(userService);
  }

  public ngOnDestroy() {
    this.dispose();
  }

  protected loadPosts(fromPost: Post | undefined, count: number): Observable<Post[]> {
    const api = this.networkService.getActiveNetworkInstant().api;

    return this.postsApiService.getLatestPosts(api,{
      limit: count,
      fromOwner: fromPost && fromPost.owner,
      fromUUID: fromPost && fromPost.uuid,
    });
  }
}

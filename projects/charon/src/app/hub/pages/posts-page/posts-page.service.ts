import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'decentr-js';
import { Observable } from 'rxjs';

import { PostsApiService } from '@core/services/api';
import { NetworkSelectorService } from '@core/network-selector';
import { UserService } from '@core/services';
import { HubPostsService } from '../../services';
import { HubCategoryRouteParam } from '../../hub-route';

@Injectable()
export class PostsPageService extends HubPostsService implements OnDestroy {
  constructor(
    private activatedRoute: ActivatedRoute,
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
    return this.postsApiService.getLatestPosts(
      this.networkService.getActiveNetworkInstant().api,
      {
        category: this.activatedRoute.snapshot.params[HubCategoryRouteParam],
        fromOwner: fromPost && fromPost.owner,
        fromUUID: fromPost && fromPost.uuid,
        limit: count,
      },
    );
  }
}

import { Injectable, Injector, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '@core/auth';
import { PostsListItem } from '@core/services';
import { HubPostsService } from '../../services';

@Injectable()
export class FollowingPageService extends HubPostsService implements OnDestroy {
  protected loadingInitialCount: number = 20;
  protected loadingMoreCount: number = 20;

  constructor(
    private authService: AuthService,
    injector: Injector,
  ) {
    super(injector);
  }

  public ngOnDestroy() {
    this.dispose();
  }

  protected loadPosts(fromPost: PostsListItem | undefined, count: number): Observable<PostsListItem[]> {
    return this.postsService.getPosts({
      after: fromPost && `${fromPost.owner}/${fromPost.uuid}`,
      followedBy: this.authService.getActiveUserInstant().wallet.address,
      limit: count,
    });
  }
}

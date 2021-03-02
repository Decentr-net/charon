import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { PostsListItem } from '@core/services';
import { HubPostsService } from '../../services';

@Injectable()
export class FeedPageService extends HubPostsService implements OnDestroy {
  protected loadingInitialCount: number = 20;

  public ngOnDestroy() {
    this.dispose();
  }

  protected loadPosts(fromPost: PostsListItem | undefined, count: number): Observable<PostsListItem[]> {
    return this.postsService.getPosts({
      after: fromPost && `${fromPost.owner}/${fromPost.uuid}`,
      limit: count,
      sort_by: 'pdv',
    });
  }
}

import { Injectable, Injector, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { PostsListItem } from '@core/services';
import { HubPostsService } from '../../services';

@Injectable()
export class RecentPageService extends HubPostsService implements OnDestroy {
  constructor(injector: Injector) {
    super(injector);
  }

  public ngOnDestroy() {
    this.dispose();
  }

  protected loadPosts(fromPost: PostsListItem | undefined, count: number): Observable<PostsListItem[]> {
    return this.postsService.getPosts({
      after: fromPost && `${fromPost.owner}/${fromPost.uuid}`,
      limit: count,
    });
  }
}

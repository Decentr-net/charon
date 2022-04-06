import { Injectable, Injector, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PostsListItem } from '@core/services';
import { HubPostsService } from '../../services';

@Injectable()
export class FeedPageService extends HubPostsService implements OnDestroy {
  constructor(injector: Injector) {
    super(injector);
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  protected loadPosts(): Observable<PostsListItem[]> {
    return of([]);
  }
}

import { Injectable, Injector, OnDestroy } from '@angular/core';
import { Observable, partition } from 'rxjs';
import { delay, switchMapTo } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthService } from '@core/auth';
import { FollowingService, PostsListItem } from '@core/services';
import { HubPostsService } from '../../services';
import { ONE_SECOND } from '../../../../../../../shared/utils/date';

@UntilDestroy()
@Injectable()
export class FollowingPageService extends HubPostsService implements OnDestroy {
  protected loadingInitialCount: number = 20;
  protected loadingMoreCount: number = 20;

  constructor(
    private authService: AuthService,
    injector: Injector,
  ) {
    super(injector);

    const [followingUpdating$, followingUpdated$] = partition(
      FollowingService.isFollowingUpdating$,
      (isUpdating) => isUpdating,
    );

    followingUpdating$.pipe(
      switchMapTo(followingUpdated$),
      delay(ONE_SECOND * 5),
      untilDestroyed(this),
    ).subscribe(() => this.reload());
  }

  public ngOnDestroy(): void {
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

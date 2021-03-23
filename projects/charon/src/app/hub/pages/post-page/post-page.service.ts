import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NotificationService } from '@shared/services/notification';
import { PostsListItem, PostsService } from '@core/services';
import { HubPostIdRouteParam, HubPostOwnerRouteParam } from '../../hub-route';
import { HubPostsService } from '../../services';

@UntilDestroy()
@Injectable()
export class PostPageService {
  private readonly post$: BehaviorSubject<PostsListItem> = new BehaviorSubject(void 0);

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private postsService: PostsService,
    private hubPostsService: HubPostsService,
    private router: Router,
  ) {
    this.activatedRoute.params.pipe(
      switchMap((params) => this.getPostChanges(
        params[HubPostOwnerRouteParam],
        params[HubPostIdRouteParam]),
      ),
      untilDestroyed(this),
    ).subscribe(this.post$);
  }

  public getPost(): Observable<PostsListItem> {
    return this.post$;
  }

  public deletePost(post: PostsListItem): void {
    this.hubPostsService.deletePost(post).pipe(
      untilDestroyed(this),
    ).subscribe(() => this.router.navigate(['../../../']));
  }

  private getPostChanges(
    owner: PostsListItem['owner'],
    postId: PostsListItem['uuid'],
  ): Observable<PostsListItem> {
    return this.hubPostsService.getPostChanges(postId).pipe(
      switchMap((post) => post ? of(post) : this.getPostLive(owner, postId)),
    );
  }

  private getPostLive(owner: PostsListItem['owner'], postId: PostsListItem['uuid']): Observable<PostsListItem> {
    return this.postsService.getPost({ owner, uuid: postId });
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, mapTo, mergeMap, switchMap, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LikeWeight, Post } from 'decentr-js';

import { NotificationService } from '@shared/services/notification';
import { PostsService } from '@core/services';
import { HubPostIdRouteParam, HubPostOwnerRouteParam } from '../../hub-route';
import { HubPostsService } from '../../services';
import { PostWithAuthor, PostWithLike } from '../../models/post';

@UntilDestroy()
@Injectable()
export class PostPageService {
  private readonly post$: BehaviorSubject<PostWithAuthor> = new BehaviorSubject(void 0);

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private postsService: PostsService,
    private hubPostsService: HubPostsService,
  ) {
    this.activatedRoute.params.pipe(
      mergeMap((params) => this.getPostWithAuthorChanges(
        params[HubPostOwnerRouteParam],
        params[HubPostIdRouteParam]),
      ),
      untilDestroyed(this),
    ).subscribe(this.post$);
  }

  public getPost(): Observable<PostWithAuthor> {
    return this.post$;
  }

  public likePost(postId: Post['uuid'], likeWeight: LikeWeight): Observable<void> {
    const targetPost = this.hubPostsService.getPost(postId);

    if (targetPost) {
      return this.hubPostsService.likePost(postId, likeWeight);
    }

    const post = this.post$.value;

    const update = HubPostsService.getPostLikesCountUpdate(post, likeWeight);
    this.updatePost({
      likeWeight,
      ...update,
    });

    return this.postsService.likePost(this.post$.value, likeWeight).pipe(
      catchError((error) => {
        this.notificationService.error(error);

        return of(void 0);
      }),
      mergeMap(() => this.getPostLive(post.owner, post.uuid)),
      tap((post) => this.updatePost(post)),
      mapTo(void 0),
    );
  }

  private getPostWithAuthorChanges(owner: Post['owner'], postId: Post['uuid']): Observable<PostWithAuthor> {
    return this.hubPostsService.getPostChanges(postId).pipe(
      switchMap((post) => post ? of(post) : this.getPostLive(owner, postId)),
      switchMap((post) => this.hubPostsService.getPublicProfile(post.owner).pipe(
        map((author) => ({ ...post, author })),
      )),
    );
  }

  private getPostLive(owner: Post['owner'], postId: Post['uuid']): Observable<PostWithLike> {
    return this.postsService.getPost({ owner, uuid: postId }).pipe(
      mergeMap((post) => this.hubPostsService.updatePostsWithLikes([post])),
      map(([post]) => post),
    );
  }

  private updatePost(update: Partial<PostWithLike>): void {
    this.post$.next({
      ...this.post$.value,
      ...update,
    });
  }
}

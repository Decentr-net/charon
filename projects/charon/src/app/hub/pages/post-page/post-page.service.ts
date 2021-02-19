import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LikeWeight, Post } from 'decentr-js';

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
    const update = HubPostsService.getPostLikesCountUpdate(this.post$.value, likeWeight);
    this.post$.next({
      ...post,
      ...update,
    });

    return EMPTY;
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
}

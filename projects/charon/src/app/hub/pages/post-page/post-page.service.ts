import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { Post } from 'decentr-js';

import { PostsService } from '@core/services';
import { HubPostIdRouteParam, HubPostOwnerRouteParam } from '../../hub-route';
import { HubPostsService } from '../../services';
import { PostWithAuthor, PostWithLike } from '../../models/post';

@Injectable()
export class PostPageService {
  constructor(
    private activatedRoute: ActivatedRoute,
    private postsService: PostsService,
    private hubPostsService: HubPostsService,
  ) {
  }

  public getPost(): Observable<PostWithAuthor> {
    return this.activatedRoute.params.pipe(
      mergeMap((params) => this.getPostWithAuthorChanges(
        params[HubPostOwnerRouteParam],
        params[HubPostIdRouteParam]),
      ),
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
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { LikeWeight, Post } from 'decentr-js';

import { AuthService } from '@core/auth';
import { PostWithLike } from '../models/post';
import { HubPostsService } from './hub-posts.service';

@Injectable()
export class HubLikesService {
  public static isLikeUpdating: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    protected authService: AuthService,
    protected hubPostsService: HubPostsService,
  ) {
  }

  public canLikePost(postId: Post['uuid']): Observable<boolean> {
    const post = this.hubPostsService.getPost(postId);
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    if (post.owner === walletAddress) {
      return of(false);
    }

    return HubLikesService.isLikeUpdating.pipe(
      map((isUpdating) => !isUpdating),
    );
  }

  public getPostChanges(postId: Post['uuid']): Observable<PostWithLike> {
    return this.hubPostsService.getPostChanges(postId);
  }

  public likePost(postId: Post['uuid'], likeWeight: LikeWeight): Observable<void> {
    if (HubLikesService.isLikeUpdating.value) {
      return;
    }

    HubLikesService.isLikeUpdating.next(true);

    return this.hubPostsService.likePost(postId, likeWeight).pipe(
      finalize(() => HubLikesService.isLikeUpdating.next(false)),
    );
  }
}

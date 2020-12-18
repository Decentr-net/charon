import { Injectable } from '@angular/core';
import { LikeWeight, Post } from 'decentr-js'

import { PostsApiService } from '../api';
import { AuthService } from '../../auth';
import { NetworkService } from '../network';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable()
export class PostsService {
  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
    private postsApiService: PostsApiService
  ) {
  }

  public likePost(post: Pick<Post, 'owner' | 'uuid'>, likeWeight: LikeWeight): Observable<void> {
    const user = this.authService.getActiveUserInstant();

    return this.postsApiService.likePost(
      this.networkService.getActiveNetworkInstant().api,
      user.wallet.address,
      user.wallet.privateKey,
      {
        author: post.owner,
        postId: post.uuid,
      },
      likeWeight,
    ).pipe(
      mapTo(void 0),
    );
  }

  public getLikedPosts(): Observable<any> {
    return this.postsApiService.getLikedPosts(
      this.networkService.getActiveNetworkInstant().api,
      this.authService.getActiveUserInstant().wallet.address,
    );
  }
}
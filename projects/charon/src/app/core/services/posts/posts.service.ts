import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { LikeWeight, Post, PostIdentificationParameters } from 'decentr-js'

import { PostsApiService } from '../api';
import { AuthService } from '../../auth';
import { NetworkService } from '../network';

@Injectable()
export class PostsService {
  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
    private postsApiService: PostsApiService
  ) {
  }

  public getPost(
    postIdentificationParameters: Pick<Post, 'owner' | 'uuid'>,
  ): Observable<Post> {
    return this.postsApiService.getPost(
      this.networkService.getActiveNetworkInstant().api,
      {
        author: postIdentificationParameters.owner,
        postId: postIdentificationParameters.uuid,
      },
    );
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

  public deletePost(
    post: PostIdentificationParameters,
  ): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return this.postsApiService.deletePost(
      this.networkService.getActiveNetworkInstant().api,
      wallet.address,
      wallet.privateKey,
      post,
    ).pipe(
      mapTo(void 0),
    );
  }
}

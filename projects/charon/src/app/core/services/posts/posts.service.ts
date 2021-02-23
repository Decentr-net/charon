import { Injectable } from '@angular/core';
import { defer, from, Observable } from 'rxjs';
import { LikeWeight, Post, PostCreate, PostIdentificationParameters } from 'decentr-js'

import { MessageBus } from '@shared/message-bus';
import { CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { MessageCode } from '@scripts/messages';
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

  public createPost(post: PostCreate): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.PostCreate, {
        walletAddress: wallet.address,
        post: post,
        privateKey: wallet.privateKey
      })
      .then(response => {
        if (!response.success) {
          throw response.error;
        }
      }));
  }

  public likePost(post: Pick<Post, 'owner' | 'uuid'>, likeWeight: LikeWeight): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return from(new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.PostLike, {
        walletAddress: wallet.address,
        postIdentificationParameters: {
          author: post.owner,
          postId: post.uuid,
        },
        likeWeight,
        privateKey: wallet.privateKey
      })
      .then(response => {
        if (!response.success) {
          throw response.error;
        }
      }));
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

    return from(new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.PostDelete, {
        walletAddress: wallet.address,
        postIdentificationParameters: {
          author: post.author,
          postId: post.postId,
        },
        privateKey: wallet.privateKey
      })
      .then(response => {
        if (!response.success) {
          throw response.error;
        }
      }));
  }
}

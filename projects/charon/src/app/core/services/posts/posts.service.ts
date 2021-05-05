import { Injectable } from '@angular/core';
import { defer, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LikeWeight, Post, PostCreate, PostIdentificationParameters } from 'decentr-js'

import { MessageBus } from '@shared/message-bus';
import { CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { MessageCode } from '@scripts/messages';
import { PostsApiService, PostsListFilterOptions, PostsListResponse } from '../api';
import { AuthService } from '../../auth';
import { NetworkService } from '../network';
import { PostsListItem } from './posts.definitions';

@Injectable()
export class PostsService {
  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
    private postsApiService: PostsApiService
  ) {
  }

  public getPost(postIdentificationParameters: Pick<Post, 'owner' | 'uuid'>): Observable<PostsListItem> {
    return this.postsApiService.getPost(
      postIdentificationParameters,
      this.authService.getActiveUserInstant().wallet.address,
    ).pipe(
      map((response) => ({
        ...response.post,
        author: response.profile,
        stats: response.stats,
      }))
    );
  }

  public getPosts(filterOptions?: PostsListFilterOptions): Observable<PostsListItem[]> {
    return this.postsApiService.getPosts({
      requestedBy: this.authService.getActiveUserInstant().wallet.address,
      ...filterOptions,
    }).pipe(
      map(this.mapPostsResponseToList),
    );
  }

  public createPost(
    post: PostCreate,
  ): Observable<CharonAPIMessageBusMap[MessageCode.PostCreate]['response']['messageValue']> {
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

        return response.messageValue;
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

  private mapPostsResponseToList(postsListResponse: PostsListResponse): PostsListItem[] {
    return postsListResponse.posts.map((post) => {
      const profile = postsListResponse.profiles[post.owner];

      return {
        ...post,
        author: profile,
        stats: postsListResponse.stats[`${post.owner}/${post.uuid}`],
      };
    });
  }
}

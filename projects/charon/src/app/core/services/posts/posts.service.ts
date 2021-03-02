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
    return this.postsApiService.getPost(postIdentificationParameters);
  }

  public getPosts(filterOptions?: PostsListFilterOptions): Observable<PostsListItem[]> {
    return this.postsApiService.getPosts(filterOptions).pipe(
      map(this.mapPostsResponseToList),
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

  public getLikedPosts(): Observable<Record<Post['uuid'], LikeWeight.Down | LikeWeight.Up>> {
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

  private mapPostsResponseToList(postsListResponse: PostsListResponse): PostsListItem[] {
    return postsListResponse.posts.map((post) => {
      const profile = postsListResponse.profiles[post.owner];

      return {
        ...post,
        createdAt: post.created_at,
        dislikesCount: post.dislikes,
        likesCount: post.likes,
        likeWeight: 0,
        previewImage: post.preview_image,
        author: {
          ...profile,
          firstName: profile.first_name,
          lastName: profile.last_name,
        },
        stats: postsListResponse.stats[`${post.owner}/${post.uuid}`],
      };
    });
  }
}

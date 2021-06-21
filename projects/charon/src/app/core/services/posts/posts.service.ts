import { Injectable } from '@angular/core';
import { defer, forkJoin, from, Observable, of } from 'rxjs';
import { catchError, delay, map, mergeMap, repeatWhen, skipWhile, take, tap } from 'rxjs/operators';
import { LikeWeight, Post, PostCreate, PostIdentificationParameters } from 'decentr-js'

import { MessageBus } from '@shared/message-bus';
import { getArrayUniqueValues } from '@shared/utils/array';
import { ONE_SECOND } from '@shared/utils/date';
import { CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { MessageCode } from '@scripts/messages';
import { PostsApiService, PostsListFilterOptions } from '../api';
import { AuthService } from '../../auth';
import { NetworkService } from '../network';
import { UserService } from '../user';
import { PostsListItem } from './posts.definitions';

@Injectable()
export class PostsService {
  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
    private postsApiService: PostsApiService,
    private userService: UserService,
  ) {
  }

  public getPost(postIdentificationParameters: Pick<Post, 'owner' | 'uuid'>): Observable<PostsListItem> {
    return forkJoin([
      this.postsApiService.getPost(
        postIdentificationParameters,
        this.authService.getActiveUserInstant().wallet.address,
      ),
      this.userService.getProfile(postIdentificationParameters.owner),
    ]).pipe(
      map(([postResponse, profile]) => ({
        ...postResponse.post,
        author: {
          ...profile,
          postsCount: postResponse.profileStats.postsCount,
        },
        stats: postResponse.stats,
      })),
    );
  }

  public getPosts(filterOptions?: PostsListFilterOptions): Observable<PostsListItem[]> {
    return this.postsApiService.getPosts({
      requestedBy: this.authService.getActiveUserInstant().wallet.address,
      ...filterOptions,
    }).pipe(
      mergeMap((postsListResponse) => {
        if (!postsListResponse.posts.length) {
          return of([]);
        }

        const addresses = getArrayUniqueValues(postsListResponse.posts.map(({ owner }) => owner));

        return this.userService.getProfiles(addresses).pipe(
          map((profiles) => {
            return postsListResponse.posts.map((post) => ({
                ...post,
                author: {
                  ...profiles[post.owner],
                  postsCount: postsListResponse.profileStats[post.owner].postsCount,
                },
                stats: postsListResponse.stats[`${post.owner}/${post.uuid}`],
            }));
          })
        )
      }),
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
        postIdentificationParameters: post,
        privateKey: wallet.privateKey
      })).pipe(
        tap((response) => {
          if (!response.success) {
            throw response.error;
          }
        }),
        mergeMap(() => this.getPost({ owner: post.author, uuid: post.postId }).pipe(
          catchError(() => of(undefined)),
          repeatWhen((notifier) => notifier.pipe(
            delay(ONE_SECOND),
          )),
          skipWhile((post) => !!post),
          take(1),
        )),
      );
  }
}

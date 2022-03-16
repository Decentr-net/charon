import { Injectable } from '@angular/core';
import { defer, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';
import { LikeWeight, Post, PostsListFilterOptions } from 'decentr-js';

import { MessageBus } from '@shared/message-bus';
import { getArrayUniqueValues } from '@shared/utils/array';
import { ConfigService } from '@shared/services/configuration';
import { ONE_SECOND } from '@shared/utils/date';
import { retryTimes } from '@shared/utils/observable';
import { uuid } from '@shared/utils/uuid';
import { assertMessageResponseSuccess, CharonAPIMessageBusMap } from '@scripts/background/charon-api/message-bus-map';
import { MessageCode } from '@scripts/messages';
import { AuthService } from '../../auth';
import { DecentrService } from '../decentr';
import { NetworkService } from '../network';
import { UserService } from '../user';
import { PostCreate, PostsListItem } from './posts.definitions';

@Injectable()
export class PostsService {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private decentrService: DecentrService,
    private networkService: NetworkService,
    private userService: UserService,
  ) {
  }

  public getPost(postIdentificationParameters: Pick<Post, 'owner' | 'uuid'>): Observable<PostsListItem> {
    return forkJoin([
      this.decentrService.theseusClient.pipe(
        mergeMap((theseusClient) => theseusClient.posts.getPost(
          postIdentificationParameters,
          this.authService.getActiveUserInstant().wallet.address,
        ))
      ),
      this.userService.getProfile(postIdentificationParameters.owner),
      this.configService.getShareUrl(),
      this.networkService.getActiveNetworkId().pipe(
        take(1),
      ),
    ]).pipe(
      map(([postResponse, profile, shareUrl, networkId]) => ({
        ...postResponse.post,
        author: {
          ...profile,
          profileExists: !!profile,
          postsCount: postResponse.profileStats.postsCount,
        },
        stats: postResponse.stats || [],
        shareLink: this.createShareLink(shareUrl, networkId, postResponse.post.slug),
      })),
    );
  }

  public getPosts(filterOptions?: PostsListFilterOptions): Observable<PostsListItem[]> {
    return this.decentrService.theseusClient.pipe(
      mergeMap((theseusClient) => theseusClient.posts.getPosts({
        requestedBy: this.authService.getActiveUserInstant().wallet.address,
        ...filterOptions,
      })),
      mergeMap((postsListResponse) => {
        if (!postsListResponse.posts.length) {
          return of([]);
        }

        const addresses = getArrayUniqueValues(postsListResponse.posts.map(({ owner }) => owner));

        return forkJoin([
          this.userService.getProfiles(addresses),
          this.configService.getShareUrl(),
          this.networkService.getActiveNetworkId().pipe(
            take(1),
          ),
        ]).pipe(
          map(([profiles, shareUrl, networkId]) => {
            return postsListResponse.posts.map((post) => ({
              ...post,
              author: {
                ...profiles[post.owner],
                postsCount: postsListResponse.profileStats[post.owner].postsCount,
              },
              stats: postsListResponse.stats[`${post.owner}/${post.uuid}`] || [],
              shareLink: this.createShareLink(shareUrl, networkId, post.slug),
            }));
          })
        );
      }),
    );
  }

  public createPost(
    request: PostCreate,
  ): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    const owner = wallet.address;
    const postId = uuid();

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.PostCreate, {
        request: { ...request, owner, uuid: postId },
      })).pipe(
        map((response) => assertMessageResponseSuccess(response)),
        mergeMap(() => this.getPost({ owner, uuid: postId }).pipe(
          retryTimes(10, ONE_SECOND),
          map(() => void 0),
        )),
      );
  }

  public likePost(post: Pick<Post, 'owner' | 'uuid'>, weight: LikeWeight): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.PostLike, {
        request: {
          owner: wallet.address,
          postOwner: post.owner,
          postUuid: post.uuid,
          weight,
        },
      })
    ).pipe(
      map(assertMessageResponseSuccess),
    );
  }

  public deletePost(
    post: Pick<Post, 'owner' | 'uuid'>,
  ): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.PostDelete, {
        request: {
          owner: wallet.address,
          postOwner: post.owner,
          postUuid: post.uuid,
        },
      })).pipe(
        map(assertMessageResponseSuccess),
        mergeMap(() => this.getPost(post).pipe(
          map(() => true),
          catchError(() => of(false)),
          map((postExists) => {
            if (postExists) {
              throw new Error();
            }

            return void 0;
          }),
          retryTimes(10, ONE_SECOND),
        )),
      );
  }

  private createShareLink(shareUrl: string, networkId: string, slug: Post['slug']): string {
    return `${shareUrl}`
      + (networkId !== 'mainnet' ? `/${networkId}` : '')
      + `/${slug}`;
  }
}

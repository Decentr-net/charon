import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import {
  BroadcastResponse,
  Decentr,
  PopularPostsPeriod,
  Post,
  PostCreate,
  PostsFilterOptions,
  UserPostsFilterOptions,
  Wallet,
} from 'decentr-js';

import { Environment } from '@environments/environment.definitions';

@Injectable()
export class PostsApiService {
  constructor(private environment: Environment) {
  }

  public getLatestPosts(
    api: string,
    filterOptions?: PostsFilterOptions,
  ): Observable<Post[]> {
    return from(
      this.createDecentrConnector(api)
        .getLatestPosts(filterOptions),
    );
  }

  public getPopularPosts(
    api: string,
    period: PopularPostsPeriod,
    filterOptions?: PostsFilterOptions,
  ): Observable<Post[]> {
    return from(
      this.createDecentrConnector(api)
        .getPopularPosts(period, filterOptions)
    );
  }

  public getUserPosts(
    api: string,
    walletAddress: Wallet['address'],
    filterOptions?: UserPostsFilterOptions,
  ): Observable<Post[]> {
    return from(
      this.createDecentrConnector(api)
      .getUserPosts(walletAddress, filterOptions),
    );
  }

  public createPost(
    api: string,
    walletAddress: Wallet['address'],
    privateKey: Wallet['privateKey'],
    post: PostCreate,
  ): Observable<BroadcastResponse> {
    return from(
      this.createDecentrConnector(api)
        .createPost(walletAddress, post, { broadcast: true, privateKey }),
    );
  }

  private createDecentrConnector(api: string): Decentr {
    return new Decentr(api, this.environment.chainId);
  }
}

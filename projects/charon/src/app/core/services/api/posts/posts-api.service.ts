import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import {
  Decentr,
  PopularPostsPeriod,
  Post,
  PostIdentificationParameters,
  PostsFilterOptions,
  UserPostsFilterOptions,
  Wallet,
} from 'decentr-js';

import { Environment } from '@environments/environment.definitions';

@Injectable()
export class PostsApiService {
  constructor(private environment: Environment) {
  }

  public getPost(
    api: string,
    postIdentificationParameters: PostIdentificationParameters,
  ): Observable<Post> {
    return from(
      this.createDecentrConnector(api).getPost(postIdentificationParameters)
    );
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

  public getLikedPosts(
    api: string,
    walletAddress: Wallet['address'],
  ): Observable<any> {
    return from(
      this.createDecentrConnector(api).getLikedPosts(walletAddress),
    );
  }

  private createDecentrConnector(api: string): Decentr {
    return new Decentr(api, this.environment.chainId);
  }
}

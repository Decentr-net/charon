import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Decentr, Post, PostsFilterOptions, UserPostsFilterOptions, Wallet } from 'decentr-js';

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

  private createDecentrConnector(api: string): Decentr {
    return new Decentr(api, this.environment.chainId);
  }
}

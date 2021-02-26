import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Decentr,
  PopularPostsPeriod,
  Post,
  PostIdentificationParameters,
  PostsFilterOptions,
  UserPostsFilterOptions,
  Wallet,
} from 'decentr-js';

import { ConfigService } from '@shared/services/configuration';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class PostsApiService {
  constructor(
    private configService: ConfigService,
  ) {
  }

  public getPost(
    api: string,
    postIdentificationParameters: PostIdentificationParameters,
  ): Observable<Post> {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.community.getPost(postIdentificationParameters)),
    );
  }

  public getLatestPosts(
    api: string,
    filterOptions?: PostsFilterOptions,
  ): Observable<Post[]> {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.community.getLatestPosts(filterOptions)),
    );
  }

  public getPopularPosts(
    api: string,
    period: PopularPostsPeriod,
    filterOptions?: PostsFilterOptions,
  ): Observable<Post[]> {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.community.getPopularPosts(period, filterOptions)),
    );
  }

  public getUserPosts(
    api: string,
    walletAddress: Wallet['address'],
    filterOptions?: UserPostsFilterOptions,
  ): Observable<Post[]> {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.community.getUserPosts(walletAddress, filterOptions)),
    );
  }

  public getLikedPosts(
    api: string,
    walletAddress: Wallet['address'],
  ): Observable<any> {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.community.getLikedPosts(walletAddress)),
    );
  }

  private createDecentrConnector(api: string): Observable<Decentr> {
    return this.configService.getChainId().pipe(
      map((chainId) => new Decentr(api, chainId)),
    );
  }
}
